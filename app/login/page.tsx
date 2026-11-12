"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP sent to your email!");
        if (data.developmentOtp) {
          toast.info(`Development OTP: ${data.developmentOtp}`, { duration: 10000 });
        }
        setStep("otp");
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signIn("OTP", {
        email,
        otp,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Logged in successfully!");
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
    <main className="flex min-h-screen bg-stone-50 dark:bg-[#121212] transition-colors duration-300">
      {/* Left Side: Image / Branding */}
      <div className="hidden lg:flex flex-1 relative bg-stone-900">
        <Image 
          src="https://images.unsplash.com/photo-1618220179428-22790b46a0eb?q=80&w=2727&auto=format&fit=crop" 
          alt="Premium Furniture Craftsmanship" 
          fill 
          className="object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <Image src="/logo.jpeg" alt="Logo" width={48} height={48} className="rounded-lg shadow-lg" />
            <h1 className="text-3xl font-bold font-sans text-white tracking-tight">Kaashta Crafts</h1>
          </Link>
          <div className="max-w-md">
            <h2 className="text-4xl font-bold font-playfair text-white mb-4">Crafted for your comfort.</h2>
            <p className="text-stone-300 text-lg">Join us to explore premium wooden furniture that brings warmth and elegance to your home.</p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 xl:px-32 relative">
        <Link href="/" className="lg:hidden absolute top-8 left-6 flex items-center gap-3">
          <Image src="/logo.jpeg" alt="Logo" width={40} height={40} className="rounded-md" />
          <h1 className="text-2xl font-bold font-sans text-stone-900 dark:text-stone-100">Kaashta Crafts</h1>
        </Link>

        <div className="w-full max-w-md mx-auto mt-16 lg:mt-0">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 font-playfair mb-3">
              {step === "email" ? "Welcome Back" : "Verify Your Email"}
            </h2>
            <p className="text-stone-500 dark:text-stone-400">
              {step === "email" 
                ? "Enter your email to login or create an account." 
                : `We've sent a 6-digit code to ${email}`}
            </p>
          </div>

          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address" 
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 transition-all shadow-sm"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-300 dark:disabled:bg-stone-800 disabled:text-stone-500 text-stone-900 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>Continue with Email <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 w-5 h-5" />
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP" 
                  maxLength={6}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 transition-all shadow-sm text-center tracking-[0.5em] font-bold text-lg"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading || otp.length < 6}
                className="w-full bg-stone-900 dark:bg-amber-500 hover:bg-stone-800 dark:hover:bg-amber-400 disabled:bg-stone-300 dark:disabled:bg-stone-800 disabled:text-stone-500 text-white dark:text-stone-900 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Login"}
              </button>

              <button 
                type="button"
                onClick={() => setStep("email")}
                className="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 text-sm font-medium mt-4 transition-colors"
              >
                Wrong email? Go back
              </button>
            </form>
          )}

          <div className="mt-12">
            <div className="relative flex items-center mb-8">
              <div className="flex-grow border-t border-stone-200 dark:border-stone-800"></div>
              <span className="flex-shrink-0 mx-4 text-stone-400 dark:text-stone-500 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-stone-200 dark:border-stone-800"></div>
            </div>
            
            <button 
              onClick={() => signIn("google", { callbackUrl })}
              className="w-full bg-white dark:bg-[#1f1f1f] border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-3 shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
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
      <div className="flex min-h-screen items-center justify-center bg-stone-50 dark:bg-[#121212]">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
