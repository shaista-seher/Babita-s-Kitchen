import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";
import { useLocation as useUserLocation } from "@/context/location-context";
import { useCart } from "@/context/cart-context";
import { ShoppingBag, User as UserIcon, LogOut, Menu, MapPin, Loader2, Search, X } from "lucide-react";
import bkLogo from "@assets/BK_logo_new.jpeg";
import bk2Logo from "@assets/BK2_logo.jpeg";
import navbarBg from "@assets/navabar.jpeg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, signOut } = useAuth();
  const { location, requestLocation, searchLocation, isLoading: locationLoading, clearLocation } = useUserLocation();
  const { totalItems } = useCart();
  const [locationPath] = useLocation();
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  // Auto-prompt for location after login if not set
  useEffect(() => {
    if (isAuthenticated && !location) {
      // Small delay to let the page load first
      const timer = setTimeout(() => {
        setShowLocationPrompt(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, location]);

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/login";
  };

  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locationQuery.trim()) {
      await searchLocation(locationQuery);
      setShowLocationSearch(false);
      setShowLocationPrompt(false);
      setLocationQuery("");
    }
  };

  const handleRequestLocation = async () => {
    await requestLocation();
    setShowLocationPrompt(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Responsive Container - Full width on mobile, centered with max-width on larger screens */}
      <div className="w-full mx-auto min-h-screen bg-[#f8f6f2] flex flex-col">
        <header className="sticky top-0 z-50 border-b-0 pb-0 w-full">
        <div className="absolute inset-0 z-0">
          <img src={navbarBg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img src={bkLogo} alt="Babita's Kitchen" className="w-20 h-20 object-contain rounded-full" />
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold leading-tight" style={{ color: '#8B5E3C' }}>Babita's</span>
              <span className="font-serif text-lg font-bold leading-tight" style={{ color: '#7A9E7E' }}>Kitchen</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-medium text-foreground/90">
            <Link href="/" className={`hover:text-primary transition-colors ${locationPath === '/' || locationPath === '/home' ? 'text-primary font-semibold' : ''}`}>Menu</Link>
            <Link href="/" className="hover:text-primary transition-colors">Specials</Link>
            <Link href="/story" className={`hover:text-primary transition-colors ${locationPath === '/story' ? 'text-primary font-semibold' : ''}`}>Our Story</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Location Indicator with Search - visible on all screens */}
            {isAuthenticated && (
              <div className="relative">
                <button 
                  onClick={() => setShowLocationSearch(!showLocationSearch)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-sm hover:bg-primary/30 transition-colors"
                >
                  {locationLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                  {location ? (
                    <span className="max-w-[150px] truncate hidden sm:inline">{location.areaName || 'Delivery set'}</span>
                  ) : (
                    <span className="hidden sm:inline">Set Location</span>
                  )}
                </button>

                {/* Location Search Dropdown */}
                {showLocationSearch && (
                  <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-2xl shadow-xl border border-border p-4 z-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-sm text-foreground">Search Location</h4>
                      <button 
                        onClick={() => setShowLocationSearch(false)}
                        className="p-1 hover:bg-secondary/10 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <form onSubmit={handleLocationSearch} className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          type="text"
                          placeholder="Enter your address..."
                          value={locationQuery}
                          onChange={(e) => setLocationQuery(e.target.value)}
                          className="pl-9 h-10 rounded-xl"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        size="sm" 
                        className="h-10 rounded-xl"
                        disabled={locationLoading}
                      >
                        {locationLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                      </Button>
                    </form>
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2">Or use your current location</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full rounded-xl gap-2"
                        onClick={() => {
                          requestLocation();
                          setShowLocationSearch(false);
                        }}
                        disabled={locationLoading}
                      >
                        <MapPin className="w-4 h-4" />
                        Use Current Location
                      </Button>
                    </div>
                    {location && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Current: {location.areaName}</span>
                          <button 
                            onClick={() => clearLocation()}
                            className="text-xs text-red-500 hover:text-red-600"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <Link href="/cart" className="relative p-2 rounded-full hover:bg-primary/10 transition-colors text-primary">
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-[#E2725B] text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <Button variant="ghost" className="rounded-full gap-2 text-primary hover:bg-primary/10 hover:text-primary">
                    <UserIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout} 
                  className="rounded-full text-primary/80 hover:text-primary hover:bg-primary/10"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button className="rounded-full bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all font-medium">
                  Sign In
                </Button>
              </Link>
            )}
            
            <Button variant="ghost" size="icon" className="md:hidden text-primary">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>

      <footer className="mt-auto pt-16 pb-8 border-t border-border/20 relative overflow-hidden w-full">
        <div className="absolute inset-0 z-0">
          <img src={navbarBg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-md">
                  <img src={bk2Logo} alt="Logo" className="w-full h-full object-cover object-center scale-110" />
                </div>
                <span className="font-semibold text-2xl font-serif" style={{ color: '#8B5E3C' }}>Babita's</span>
                <span className="font-semibold text-2xl font-serif" style={{ color: '#7A9E7E' }}>Kitchen</span>
              </div>
              <p className="max-w-sm leading-relaxed" style={{ color: '#8B4513' }}>
                True taste of home wherever you roam. We craft organic, wholesome, and delicious meals that nourish the soul.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-6" style={{ color: '#8B4513' }}>Explore</h4>
              <ul className="space-y-4" style={{ color: '#A0522D' }}>
                <li><Link href="/" className="hover:opacity-80 transition-opacity">Today's Menu</Link></li>
                <li><Link href="/" className="hover:opacity-80 transition-opacity">Meal Plans</Link></li>
                <li><Link href="/" className="hover:opacity-80 transition-opacity">Gift Cards</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-6" style={{ color: '#8B4513' }}>Support</h4>
              <ul className="space-y-4" style={{ color: '#A0522D' }}>
                <li><Link href="/" className="hover:opacity-80 transition-opacity">Contact Us</Link></li>
                <li><Link href="/" className="hover:opacity-80 transition-opacity">FAQ</Link></li>
                <li><Link href="/" className="hover:opacity-80 transition-opacity">Delivery Info</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-black/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm" style={{ color: '#A0522D' }}>
            <p>© {new Date().getFullYear()} Babita's Kitchen. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/" className="hover:opacity-80">Privacy Policy</Link>
              <Link href="/" className="hover:opacity-80">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Location Prompt Modal - Shows after login */}
      {showLocationPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Set Your Delivery Location</h3>
              <p className="text-muted-foreground text-sm">
                We need your location to show available restaurants and delivery options near you.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleRequestLocation}
                disabled={locationLoading}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium"
              >
                {locationLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Getting your location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5 mr-2" />
                    Use Current Location
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <form onSubmit={handleLocationSearch} className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    type="text"
                    placeholder="Enter your address..."
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={locationLoading || !locationQuery.trim()}
                  className="w-full h-12 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium"
                >
                  {locationLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search Address'}
                </Button>
              </form>

              <button 
                onClick={() => setShowLocationPrompt(false)}
                className="w-full text-sm text-muted-foreground hover:text-foreground py-2"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
