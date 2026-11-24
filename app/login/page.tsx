"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowRight, ShieldCheck, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Suspense } from "react";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Verification passcode sent!");
        if (data.developmentOtp) {
          toast.info(`Passcode: ${data.developmentOtp}`, { duration: 10000 });
        }
        setStep("otp");
      } else {
        toast.error(data.error || "Failed to send verification code");
      }
    } catch (error) {
      toast.error("An error occurred while sending code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (cleanOtp.length < 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signIn("OTP", {
        email: email.toLowerCase().trim(),
        otp: cleanOtp,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Signed in successfully!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred during verification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-[#F7F5F0] dark:bg-[#14100E] text-[#241812] dark:text-[#F7F5F0] transition-colors duration-300 font-sans">
      
      {/* Left Column: Brand Storyboard (Desktop) */}
      <div className="hidden lg:flex flex-1 relative bg-[#241812] overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1618220179428-22790b46a0eb?q=80&w=2727&auto=format&fit=crop" 
          alt="Premium Furniture Craftsmanship" 
          fill 
          className="object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#241812] via-[#241812]/50 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-between p-14 z-10">
          <Link href="/" className="flex items-center gap-3 w-fit group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden ring-1 ring-[#C49A50]/40">
              <Image src="/logo.jpeg" alt="Logo" fill className="object-cover" />
            </div>
            <span className="text-2xl font-bold font-playfair text-[#F7F5F0] tracking-tight">Kaashta Crafts</span>
          </Link>
          
          <div className="max-w-md">
            <div className="flex items-center gap-2 text-[#C49A50] text-xs font-bold uppercase tracking-[0.2em] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Collector Privilege</span>
            </div>
            <h2 className="text-4xl font-bold font-playfair text-[#F7F5F0] mb-4 leading-tight">
              Timeless woodcraft, sculpted for life.
            </h2>
            <p className="text-[#EAE1D2]/80 text-base leading-relaxed font-sans">
              Sign in to manage your orders, curate your private wishlist, and unlock exclusive guild collector benefits.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Clean Minimalist Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-20 xl:px-28 relative">
        <Link href="/" className="lg:hidden absolute top-8 left-6 flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-1 ring-[#EAE1D2]">
            <Image src="/logo.jpeg" alt="Logo" fill className="object-cover" />
          </div>
          <span className="text-xl font-bold font-playfair text-[#241812] dark:text-[#F7F5F0]">Kaashta Crafts</span>
        </Link>

        <div className="w-full max-w-sm mx-auto mt-20 lg:mt-0">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-[#241812] dark:text-[#F7F5F0] font-playfair mb-2">
              {step === "email" ? "Collector Sign In" : "Security Verification"}
            </h2>
            <p className="text-xs sm:text-sm text-[#82786E] dark:text-[#A39A90]">
              {step === "email" 
                ? "Enter your email to receive an instant verification passcode." 
                : `We've dispatched a 6-digit passcode to ${email}`}
            </p>
          </div>

          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82786E] w-4 h-4" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address" 
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#EAE1D2] dark:border-[#2E241E] focus:outline-none focus:border-[#C49A50] focus:ring-2 focus:ring-[#C49A50]/20 bg-white/90 dark:bg-[#1E1713]/90 text-sm text-[#241812] dark:text-[#F7F5F0] placeholder:text-[#82786E]/70 transition-all shadow-2xs"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#241812] hover:bg-[#38261C] dark:bg-[#C49A50] dark:hover:bg-[#D4AF37] disabled:bg-stone-300 text-[#F7F5F0] dark:text-[#241812] py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>Send Verification Code <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82786E] w-4 h-4" />
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code" 
                  maxLength={6}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#EAE1D2] dark:border-[#2E241E] focus:outline-none focus:border-[#C49A50] focus:ring-2 focus:ring-[#C49A50]/20 bg-white/90 dark:bg-[#1E1713]/90 text-sm text-[#241812] dark:text-[#F7F5F0] placeholder:text-[#82786E]/70 transition-all shadow-2xs text-center tracking-[0.4em] font-mono font-bold"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading || otp.length < 6}
                className="w-full bg-[#241812] hover:bg-[#38261C] dark:bg-[#C49A50] dark:hover:bg-[#D4AF37] disabled:bg-stone-300 text-[#F7F5F0] dark:text-[#241812] py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Continue"}
              </button>

              <div className="flex items-center justify-between text-xs mt-2 px-1">
                <button 
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-[#82786E] hover:text-[#241812] dark:hover:text-[#F7F5F0] font-medium transition-colors cursor-pointer"
                >
                  ← Edit email
                </button>
                <button 
                  type="button"
                  onClick={() => handleSendOtp()}
                  disabled={isLoading}
                  className="text-[#C49A50] hover:text-[#D4AF37] font-semibold transition-colors cursor-pointer"
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}

          <div className="mt-8">
            <div className="relative flex items-center mb-6">
              <div className="flex-grow border-t border-[#EAE1D2] dark:border-[#2E241E]"></div>
              <span className="flex-shrink-0 mx-3 text-[#82786E] text-xs uppercase tracking-wider">or sign in with</span>
              <div className="flex-grow border-t border-[#EAE1D2] dark:border-[#2E241E]"></div>
            </div>
            
            <button 
              onClick={() => signIn("google", { callbackUrl })}
              className="w-full bg-white dark:bg-[#1E1713] border border-[#EAE1D2] dark:border-[#2E241E] hover:border-[#C49A50] text-[#241812] dark:text-[#F7F5F0] py-3 rounded-full font-semibold text-xs transition-all flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#F7F5F0] dark:bg-[#14100E]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C49A50]" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
