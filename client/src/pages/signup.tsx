
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";
import { Loader2, Phone, User, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { motion } from "framer-motion";
import bkLogo from "@assets/BK_logo_1772721148069.jpeg";

type SignupStep = "details" | "otp" | "success";

export default function Signup() {
  const [step, setStep] = useState<SignupStep>("details");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  
  const { signInWithPhone, signUp, verifyOTP } = useAuth();
  const [, setLocation] = useLocation();

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

    if (!firstName.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsLoading(true);

    const result = await signInWithPhone(phone);
    if (result.error) {
      setError(result.error.message);
    } else {
      sessionStorage.setItem('signupName', `${firstName} ${lastName}`.trim());
      setStep("otp");
      setResendTimer(30);
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);

    await signUp(firstName, lastName, phone);
    
    const result = await verifyOTP(phone, otp);
    
    if (result.error) {
      setError(result.error.message);
      setIsLoading(false);
    } else {
      window.dispatchEvent(new Event('auth-change'));
      // Redirect to home after successful signup with delay
      setTimeout(() => {
        window.location.href = "/home";
      }, 200);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    const result = await signInWithPhone(phone);
    if (!result.error) {
      setResendTimer(30);
    } else {
      setError(result.error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (step === "otp" && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, resendTimer]);

  if (step === "success") {
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
              Your account has been created successfully. Let's start ordering!
            </p>
            <Button
              onClick={() => setLocation("/home")}
              className="w-full h-12 rounded-xl text-white font-semibold"
              style={{ backgroundColor: '#7A9E7E' }}
            >
              Go to Home
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F8F4EC' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-border/30 overflow-hidden">
            <div className="p-8 pb-6 text-center relative" style={{ backgroundColor: 'rgba(122, 158, 126, 0.1)' }}>
              <button
                onClick={() => setStep("details")}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/5 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
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
              <p className="text-xs text-muted-foreground mt-2">
                Check console for OTP
              </p>
            </div>

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
                  "Verify & Create Account"
                )}
              </Button>

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
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12" style={{ backgroundColor: '#F8F4EC' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-border/30 overflow-hidden">
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

          <form onSubmit={handleSendOTP} className="p-8 space-y-5">
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
              <label className="text-sm font-medium text-gray-800 ml-1">First Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <Input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="h-12 pl-12 rounded-xl border-gray-300 bg-white text-gray-800"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800 ml-1">Last Name</label>
              <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-12 rounded-xl border-gray-300 bg-white text-gray-800"
              />
            </div>

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
                    className="h-12 pl-20 rounded-xl border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-green-200"
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
                  Send OTP
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <Button
              onClick={() => setLocation("/login")}
              variant="ghost"
              className="w-full text-muted-foreground"
            >
              Already have an account? Sign In
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

