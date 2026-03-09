import { useState, useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "./context/cart-context";
import { LocationProvider } from "./context/location-context";
import { AuthProvider, useAuth } from "./context/auth-context";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import Home from "@/pages/home";
import ProductDetails from "@/pages/product-details";
import Cart from "@/pages/cart";
import Profile from "@/pages/profile";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import ForgotPassword from "@/pages/forgot-password";
import Story from "@/pages/story";

// Opening Video Component
function OpeningVideo({ onComplete }: { onComplete?: () => void }) {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const video = document.getElementById('opening-video') as HTMLVideoElement;
    if (!video) return;

    video.addEventListener('canplay', () => setIsLoading(false));
    video.addEventListener('ended', handleVideoEnd);
    
    video.play().catch(() => {
      handleVideoEnd();
    });

    return () => {
      video.removeEventListener('canplay', () => setIsLoading(false));
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, []);

  const handleVideoEnd = () => {
    setIsFading(true);
    setTimeout(() => {
      if (onComplete) onComplete();
      setLocation("/login");
    }, 1000);
  };

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      if (onComplete) onComplete();
      setLocation("/login");
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isFading ? 0 : 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <video
        id="opening-video"
        className="w-full h-full object-contain"
        playsInline
        muted
        autoPlay
      >
        <source src="/opening-video.mp4" type="video/mp4" />
      </video>

      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/30 transition-colors z-50"
      >
        Skip →
      </button>
    </motion.div>
  );
}

// Main Router with auth handling
function MainRouter() {
  const [showVideo, setShowVideo] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Force re-render when auth changes
  const [, setAuthCheck] = useState(0);

  // Check if user has seen video
  useEffect(() => {
    const seenVideo = localStorage.getItem("hasSeenVideo");
    if (!seenVideo) {
      setShowVideo(true);
      localStorage.setItem("hasSeenVideo", "true");
    }
  }, []);

  // Listen for auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      setAuthCheck(n => n + 1);
    };
    
    // Listen for custom auth change event
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    // Also poll for changes (for same-tab updates)
    const interval = setInterval(handleAuthChange, 300);
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      clearInterval(interval);
    };
  }, []);

  // Check auth from localStorage directly
  const isAuth = isAuthenticated || !!localStorage.getItem("auth_token");

  // Show video first
  if (showVideo) {
    return <OpeningVideo onComplete={() => { setShowVideo(false); }} />;
  }

  // If not authenticated, show login
  if (!isAuth) {
    return (
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route>
          <Login />
        </Route>
      </Switch>
    );
  }

  // Authenticated routes - redirect to home
  return (
    <Switch>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/home">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/forgot-password">
        <ForgotPassword />
      </Route>
      <Route path="/product/:id">
        <ProductDetails />
      </Route>
      <Route path="/story">
        <Story />
      </Route>
      <Route path="/cart">
        <Cart />
      </Route>
      <Route path="/profile">
        <Profile />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
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
              <MainRouter />
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
