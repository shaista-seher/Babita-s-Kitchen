import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserLocation {
  latitude: number;
  longitude: number;
  fullAddress: string;
  areaName?: string;
}

interface LocationContextType {
  location: UserLocation | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => void;
  searchLocation: (query: string) => Promise<void>;
  updateAddress: (address: string) => void;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Free geocoding using OpenStreetMap Nominatim
async function reverseGeocode(lat: number, lon: number): Promise<{ address: string; areaName: string }> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await response.json();
    
    const address = data.display_name || '';
    // Extract a short area name
    const areaName = data.address?.suburb || data.address?.city || data.address?.town || data.address?.village || 'Your Area';
    
    return { address, areaName };
  } catch (error) {
    console.error('Geocoding error:', error);
    return { address: `${lat.toFixed(4)}, ${lon.toFixed(4)}`, areaName: 'Unknown Area' };
  }
}

// Geocoding search query to coordinates
async function geocodeAddress(query: string): Promise<{ lat: number; lon: number; displayName: string } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user has saved location in localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
      } catch {
        localStorage.removeItem('userLocation');
      }
    }
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const { address, areaName } = await reverseGeocode(latitude, longitude);
          
          const newLocation: UserLocation = {
            latitude,
            longitude,
            fullAddress: address,
            areaName,
          };
          
          setLocation(newLocation);
          localStorage.setItem('userLocation', JSON.stringify(newLocation));
        } catch (err) {
          setError('Failed to get address from location');
          setLocation({
            latitude,
            longitude,
            fullAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          });
        }
        
        setIsLoading(false);
      },
      (err) => {
        setError('Location permission denied. Please enter your address manually.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  };

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setError('Please enter a valid address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await geocodeAddress(query);
      
      if (result) {
        const { address, areaName } = await reverseGeocode(result.lat, result.lon);
        
        const newLocation: UserLocation = {
          latitude: result.lat,
          longitude: result.lon,
          fullAddress: address,
          areaName,
        };
        
        setLocation(newLocation);
        localStorage.setItem('userLocation', JSON.stringify(newLocation));
      } else {
        setError('Location not found. Please try a different search term.');
      }
    } catch (err) {
      setError('Failed to search location. Please try again.');
    }
    
    setIsLoading(false);
  };

  const updateAddress = (address: string) => {
    if (location) {
      const updatedLocation = { ...location, fullAddress: address };
      setLocation(updatedLocation);
      localStorage.setItem('userLocation', JSON.stringify(updatedLocation));
    }
  };

  const clearLocation = () => {
    setLocation(null);
    setError(null);
    localStorage.removeItem('userLocation');
  };

  const value: LocationContextType = {
    location,
    isLoading,
    error,
    requestLocation,
    searchLocation,
    updateAddress,
    clearLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

