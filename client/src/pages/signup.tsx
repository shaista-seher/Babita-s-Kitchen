import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Loader2, Phone, User, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import bkLogo from "@assets/BK_logo_1772721148069.jpeg";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [, setLocation] = useLocation();

  // Check for existing auth
  const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("auth_token");

  // Redirect if already authenticated
  if (isAuthenticated) {
    setLocation("/home");
    return null;
  }

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.slice(0, 10);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    if (!firstName.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsLoading(true);

    try {
      // For demo: Simulate signup with phone number
      const demoToken = `phone_token_${phone}_${Date.now()}`;
      localStorage.setItem("auth_token", demoToken);
      localStorage.setItem("user_phone", `+91${phone}`);
      localStorage.setItem("user_name", `${firstName} ${lastName}`.trim());
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Success Step
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F8F4EC' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-border/30">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">
              <span style={{ color: '#8B5E3C' }}>Welcome</span>
              <span style={{ color: '#7A9E7E', marginLeft: '6px' }}>aboard!</span>
            </h1>
            <p className="text-muted-foreground mb-6">
              Your account has been created successfully. Let's set up your delivery location.
            </p>
            <Button
              onClick={() => setLocation("/location")}
              className="w-full h-12 rounded-xl text-white font-semibold"
              style={{ backgroundColor: '#7A9E7E' }}
            >
              Set Location
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Initial Details Step
  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12" style={{ backgroundColor: '#F8F4EC' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-border/30 overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6 text-center" style={{ backgroundColor: 'rgba(122, 158, 126, 0.1)' }}>
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden shadow-md">
              <img src={bkLogo} alt="Babita's Kitchen" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground font-serif">
              <span style={{ color: '#8B5E3C' }}>Create</span>
              <span style={{ color: '#7A9E7E', marginLeft: '6px' }}>Account</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">Join us for authentic homemade food!</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="p-8 space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="h-12 pl-12 rounded-xl border-border/60 bg-background"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">Last Name</label>
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-12 rounded-xl border-border/60 bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <div className="flex items-center">
                  <span className="absolute left-12 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">+91</span>
                  <Input
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={10}
                    required
                    className="h-12 pl-20 rounded-xl border-border/60 bg-background focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || phone.length !== 10 || !firstName.trim()}
              className="w-full h-12 rounded-xl text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: '#7A9E7E' }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

