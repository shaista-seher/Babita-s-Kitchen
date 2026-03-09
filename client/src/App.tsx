import { useState } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "./context/cart-context";
import { AuthProvider, useAuth } from "./context/auth-context";
import { LocationProvider, useLocation as useUserLocation } from "./context/location-context";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "@/components/protected-route";
import { Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

import Home from "@/pages/home";
import ProductDetails from "@/pages/product-details";
import Cart from "@/pages/cart";
import Profile from "@/pages/profile";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import ForgotPassword from "@/pages/forgot-password";
import Story from "@/pages/story";
import OpeningVideo from "@/pages/opening-video";

function Router() {
  const { isAuthenticated } = useAuth();
  const { location } = useUserLocation();

  // Check if user has seen the opening video
  const hasSeenOpening = typeof window !== "undefined" && localStorage.getItem("hasSeenOpening");
  const hasAuthToken = typeof window !== "undefined" && localStorage.getItem("auth_token");

  return (
    <Switch>
      {/* Opening video - only shown once */}
      <Route path="/">
        {hasSeenOpening ? (
          hasAuthToken ? (
            location ? (
              <Redirect href="/home" />
            ) : (
              <Redirect href="/location" />
            )
          ) : (
            <Redirect href="/login" />
          )
        ) : (
          <OpeningVideo />
        )}
      </Route>

      {/* Location selection page */}
      <Route path="/location" component={LocationSelection} />

      {/* Public routes */}
      <Route path="/home" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/product/:id" component={ProductDetails} />
      <Route path="/story" component={Story} />
      
      {/* Protected routes */}
      <Route path="/cart">
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      </Route>
      
      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

// Location selection component for the flow
function LocationSelection() {
  const { requestLocation, searchLocation, isLoading, error, location } = useUserLocation();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleRequestLocation = () => {
    requestLocation();
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchLocation(searchQuery);
    }
  };

  // Redirect to home if location is already set
  if (location) {
    return <Redirect href="/home" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F8F4EC' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-border/30 overflow-hidden p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden shadow-md bg-green-100 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground font-serif">
              <span style={{ color: '#8B5E3C' }}>Select</span>
              <span style={{ color: '#7A9E7E', marginLeft: '6px' }}>Location</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">We need your location to deliver delicious food!</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-4"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            {/* Use Current Location Button */}
            <Button
              onClick={handleRequestLocation}
              disabled={isLoading}
              className="w-full h-14 rounded-xl text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: '#7A9E7E' }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                <>
                  <MapPin className="w-5 h-5 mr-2" />
                  Use Current Location
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Search Location */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="w-full h-14 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 font-semibold text-lg hover:border-green-500 hover:text-green-600 transition-colors"
            >
              Search by Address
            </button>

            {showSearch && (
              <form onSubmit={handleSearch} className="space-y-4 mt-4">
                <Input
                  type="text"
                  placeholder="Enter your address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 rounded-xl border-border/60"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !searchQuery.trim()}
                  className="w-full h-12 rounded-xl text-white font-semibold"
                  style={{ backgroundColor: '#8B5E3C' }}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <Toaster />
              <Router />
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

