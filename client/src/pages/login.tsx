import { useState } from "react";
import { Link } from "wouter";
import { Loader2, Phone, ArrowRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import bkLogo from "@assets/BK_logo_1772721148069.jpeg";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.slice(0, 10);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);

    // Simulate login - in production, call your API
    setTimeout(() => {
      localStorage.setItem("auth_token", "logged_in_" + Date.now());
      localStorage.setItem("user_phone", "+91" + phone);
      window.location.reload();
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F8F4EC' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-border/30 overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6 text-center" style={{ backgroundColor: 'rgba(122, 158, 126, 0.1)' }}>
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden shadow-md">
              <img src={bkLogo} alt="Babita's Kitchen" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground font-serif">
              <span style={{ color: '#8B5E3C' }}>Welcome</span>
              <span style={{ color: '#7A9E7E', marginLeft: '6px' }}>Back</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">Sign in with your phone number</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

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
                    className="h-12 pl-20 rounded-xl border-border/60 bg-background"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || phone.length !== 10}
              className="w-full h-12 rounded-xl text-white font-semibold text-lg"
              style={{ backgroundColor: '#7A9E7E' }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-semibold flex items-center justify-center gap-1 mt-2">
                <UserPlus className="w-4 h-4" />
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

