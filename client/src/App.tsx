import { useState } from "react";
import { Switch, Route, useLocation as useWouterLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "./context/cart-context";
import { LocationProvider, useLocation as useUserLocation } from "./context/location-context";
import NotFound from "@/pages/not-found";
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

function Router() {
  const [isAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("auth_token");
  });
  
  const { location } = useUserLocation();
  const [, setRoute] = useWouterLocation();

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Show location if not set
  if (!location) {
    return <LocationSelection />;
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/product/:id" component={ProductDetails} />
      <Route path="/story" component={Story} />
      <Route path="/cart" component={Cart} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Location selection component
function LocationSelection() {
  const { requestLocation, searchLocation, isLoading, error, location } = useUserLocation();
  const [, setRoute] = useWouterLocation();
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

  if (location) {
    setRoute("/home");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F8F4EC' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Button
              onClick={handleRequestLocation}
              disabled={isLoading}
              className="w-full h-14 rounded-xl text-white font-semibold text-lg"
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

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

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
        <LocationProvider>
          <CartProvider>
            <Toaster />
            <Router />
          </CartProvider>
        </LocationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

