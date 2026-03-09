
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";
import { Loader2, Phone, ArrowRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { motion, AnimatePresence } from "framer-motion";
import bkLogo from "@assets/BK_logo_1772721148069.jpeg";

type LoginStep = "phone" | "otp";

export default function Login() {
  const [step, setStep] = useState<LoginStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  
  const { verifyOTP } = useAuth();
  const [, setLocation] = useLocation();

  // Check auth directly from localStorage to redirect to home
  useEffect(() => {
    if (localStorage.getItem("auth_token")) {
      setLocation("/home");
    }
  }, [setLocation]);

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.slice(0, 10);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);

    // Simulate sending OTP (demo)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    sessionStorage.setItem('pendingPhone', phone);
    setStep("otp");
    setResendTimer(30);
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setIsLoading(true);

    const { error: verifyError } = await verifyOTP(phone, otp);
    
    if (verifyError) {
      setError(verifyError.message);
      setIsLoading(false);
    } else {
      // Dispatch custom event for auth change
      window.dispatchEvent(new Event('auth-change'));
      // Success - redirect directly to home with slight delay to ensure auth state updates
      setTimeout(() => {
        window.location.href = "/home";
      }, 200);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setResendTimer(30);
    setIsLoading(false);
  };

  // Countdown for resend
  useEffect(() => {
    if (step === "otp" && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, resendTimer]);

  // OTP Verification Step
  if (step === "otp") {
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
              <button
                onClick={() => setStep("phone")}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/5 transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-foreground rotate-180" />
              </button>
              
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden shadow-md">
                <img src={bkLogo} alt="Babita's Kitchen" className="w-full h-full object-cover" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground font-serif">
                <span style={{ color: '#8B5E3C' }}>Verify</span>
                <span style={{ color: '#7A9E7E', marginLeft: '6px' }}>OTP</span>
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Enter the 6-digit code sent to
              </p>
              <p className="text-foreground font-medium mt-1">
                +91 {phone}
              </p>
              <p className="text-xs text-green-600 mt-2">
                Demo: Use OTP 123456
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleVerifyOTP} className="p-8 space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* OTP Input */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-foreground ml-1 block text-center">
                  Enter OTP
                </label>
                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    maxLength={6}
                    className="gap-2"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full h-12 rounded-xl text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all"
                style={{ backgroundColor: '#7A9E7E' }}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Verify & Continue"
                )}
              </Button>

              {/* Resend Section */}
              <div className="text-center space-y-2">
                {resendTimer > 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Resend OTP in <span className="font-medium text-foreground">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isLoading}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Change Phone */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Change phone number?
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // Phone Number Step
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
          <form onSubmit={handleSendOTP} className="p-8 space-y-6">
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
              <label className="text-sm font-medium text-gray-800 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <div className="flex items-center">
                  <span className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-600 font-medium">+91</span>
                  <Input
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={10}
                    required
                    className="h-12 pl-20 rounded-xl border-gray-300 bg-white text-gray-800"
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
                  Send OTP
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <Button
              onClick={() => setLocation("/signup")}
              variant="outline"
              className="w-full h-12 rounded-xl border-2 border-green-500 text-green-600 font-semibold hover:bg-green-50"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Create New Account
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

