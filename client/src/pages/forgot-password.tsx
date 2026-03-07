import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import bkLogo from "@assets/BK_logo_1772721148069.jpeg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error } = await resetPassword(email);
    
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F8F4EC' }}>
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
              <span style={{ color: '#8B5E3C' }}>Babita's</span>
              <span style={{ color: '#7A9E7E', marginLeft: '6px' }}>Kitchen</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">Reset your password</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            {success ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">Check your email!</h3>
                <p className="text-muted-foreground text-sm">
                  We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
                </p>
                <Link href="/login">
                  <Button
                    variant="link"
                    className="mt-4 text-primary"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <>
                <p className="text-muted-foreground text-sm text-center">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 pl-12 rounded-xl border-border/60 bg-background focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all"
                  style={{ backgroundColor: '#7A9E7E' }}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <div className="text-center">
                  <Link href="/login" className="text-sm text-primary hover:underline font-medium inline-flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                  </Link>
                </div>
              </>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}

