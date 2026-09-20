'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, User, Phone, Lock, Heart, CheckCircle2, 
  ArrowRight, ShieldCheck, AlertCircle, KeyRound, RotateCcw, 
  ArrowLeft, Check, Smartphone, Mail
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { cleanUzbekPhoneDigits, formatUzbekPhoneDisplay, isUzbekPhoneValid } from '@/lib/phoneHelper';
import confetti from 'canvas-confetti';

export default function AuthModal() {
  const { locale, isAuthModalOpen, setIsAuthModalOpen, loginUser, logoutUser, currentUser, nurCoins } = useAppStore();
  const t = translations[locale];

  // Auth flow states: 'form' (main phone/options), 'otp' (SMS code), 'google' (Google account), 'github' (GitHub account)
  const [authStep, setAuthStep] = useState<'form' | 'otp' | 'google' | 'github'>('form');
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [parentName, setParentName] = useState('');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [childName, setChildName] = useState('');
  const [password, setPassword] = useState('');

  // Google specific states
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleChildName, setGoogleChildName] = useState('');

  // GitHub specific states
  const [githubUsername, setGithubUsername] = useState('');
  const [githubEmail, setGithubEmail] = useState('');
  const [githubChildName, setGithubChildName] = useState('');
  
  // OTP states
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const [otpCountdown, setOtpCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [demoOtpCode, setDemoOtpCode] = useState<string>('');
  
  // Feedback & Loading states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // OTP input references
  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Handle countdown timer for OTP resend
  useEffect(() => {
    let timer: any = null;
    if (authStep === 'otp' && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [authStep, otpCountdown]);

  // Focus first OTP input when transitioning to OTP step
  useEffect(() => {
    if (authStep === 'otp') {
      setTimeout(() => {
        otpInputRefs[0].current?.focus();
      }, 150);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStep]);

  // Reset states when modal is closed
  useEffect(() => {
    if (!isAuthModalOpen) {
      setAuthStep('form');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = cleanUzbekPhoneDigits(e.target.value);
    setPhoneDigits(cleaned);
    if (errorMsg) setErrorMsg('');
  };

  // Step 1: Request SMS code
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Strict 9-digit validation
    if (!isUzbekPhoneValid(phoneDigits)) {
      setErrorMsg(
        locale === 'uz'
          ? "Telefon raqam aniq 9 xonali bo'lishi shart (masalan: 90 123 45 67)"
          : "Phone number must be exactly 9 digits (e.g. 90 123 45 67)"
      );
      return;
    }

    setIsSendingSms(true);
    try {
      const res = await fetch('/api/auth/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneDigits,
          name: parentName || 'Hurmatli Ota-ona',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || (locale === 'uz' ? "SMS yuborishda xatolik yuz berdi" : "Failed to send SMS"));
      }

      setDemoOtpCode(data.demoCode || '');
      setAuthStep('otp');
      setOtpDigits(['', '', '', '']);
      setOtpCountdown(60);
      setCanResend(false);
      setSuccessMsg(
        locale === 'uz'
          ? "Tasdiqlash kodi telefoningizga yuborildi!"
          : "Verification code has been sent to your phone!"
      );
    } catch (err: any) {
      setErrorMsg(err.message || (locale === 'uz' ? "SMS yuborishda xatolik yuz berdi" : "Error sending SMS"));
    } finally {
      setIsSendingSms(false);
    }
  };

  // OTP inputs logic
  const handleOtpChange = (index: number, val: string) => {
    const digitsOnly = val.replace(/\D/g, '');
    setErrorMsg('');

    if (digitsOnly.length > 1) {
      // Pasted full 4-digit code into box
      const chars = digitsOnly.slice(0, 4).split('');
      const newOtp = [...otpDigits];
      chars.forEach((c, i) => {
        if (i < 4) newOtp[i] = c;
      });
      setOtpDigits(newOtp);
      const nextIdx = Math.min(chars.length, 3);
      otpInputRefs[nextIdx].current?.focus();

      if (chars.length === 4) {
        triggerVerification(chars.join(''));
      }
      return;
    }

    const newOtp = [...otpDigits];
    newOtp[index] = digitsOnly;
    setOtpDigits(newOtp);

    // Auto move to next input
    if (digitsOnly && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }

    // Auto verify if all 4 digits entered
    const completeCode = newOtp.join('');
    if (completeCode.length === 4 && !newOtp.includes('')) {
      triggerVerification(completeCode);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  // Step 2: Confirm OTP & Log in
  const triggerVerification = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length < 4) {
      setErrorMsg(
        locale === 'uz'
          ? "Iltimos, 4 xonali tasdiqlash kodini to'liq kiriting"
          : "Please enter the complete 4-digit code"
      );
      return;
    }

    setIsVerifyingOtp(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/verify-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneDigits,
          code: code,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || (locale === 'uz' ? "Noto'g'ri kod kiritildi" : "Invalid verification code"));
      }

      // Success: Log in user
      const formattedPhone = `+998 ${formatUzbekPhoneDisplay(phoneDigits)}`;
      loginUser({
        name: parentName || (locale === 'uz' ? "Aziz Ota-ona" : "Dear Parent"),
        phone: formattedPhone,
        childName: childName || "Ali",
      });

      // Confetti celebration
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFEFB3', '#013E37', '#F59E0B', '#10B981'],
      });
    } catch (err: any) {
      setErrorMsg(err.message || (locale === 'uz' ? "Kodni tasdiqlashda xatolik yuz berdi" : "Error verifying code"));
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Resend SMS code
  const handleResendSms = async () => {
    if (!canResend || isSendingSms) return;
    setIsSendingSms(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneDigits,
          name: parentName || 'Hurmatli Ota-ona',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "SMS yuborishda xatolik");
      }

      setDemoOtpCode(data.demoCode || '');
      setOtpDigits(['', '', '', '']);
      setOtpCountdown(60);
      setCanResend(false);
      setSuccessMsg(
        locale === 'uz'
          ? "Yangi SMS kod muvaffaqiyatli yuborildi!"
          : "New SMS code successfully sent!"
      );
      otpInputRefs[0].current?.focus();
    } catch (err: any) {
      setErrorMsg(err.message || "Qayta yuborishda xatolik");
    } finally {
      setIsSendingSms(false);
    }
  };

  // Handle Google OAuth or initiate authentic Google Account flow
  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    // 1. Check if real Supabase OAuth is configured
    const hasValidSupabase =
      typeof process !== 'undefined' &&
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    if (hasValidSupabase) {
      setIsGoogleLoading(true);
      try {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        return;
      } catch (err: any) {
        setIsGoogleLoading(false);
        setErrorMsg(err?.message || (locale === 'uz' ? "Supabase Google tizimiga ulanishda xatolik" : "Supabase Google login failed"));
        setGoogleName(parentName || '');
        setGoogleChildName(childName || '');
        setAuthStep('google');
        return;
      }
    }

    // 2. Check if Google Client ID is configured for Google Identity Services
    const googleClientId = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID : undefined;
    if (googleClientId && typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      setIsGoogleLoading(true);
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.access_token) {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
              });
              const userInfo = await res.json();
              if (userInfo?.email) {
                loginUser({
                  name: userInfo.name || userInfo.email.split('@')[0],
                  phone: userInfo.email,
                  childName: childName || (locale === 'uz' ? "Alijon" : "Ali"),
                });
                confetti({
                  particleCount: 65,
                  spread: 75,
                  origin: { y: 0.6 },
                  colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'],
                });
                setIsGoogleLoading(false);
                return;
              }
            }
            setIsGoogleLoading(false);
          },
          error_callback: () => {
            setIsGoogleLoading(false);
            setGoogleName(parentName || '');
            setGoogleChildName(childName || '');
            setAuthStep('google');
          }
        });
        client.requestAccessToken();
        return;
      } catch {
        setIsGoogleLoading(false);
        setGoogleName(parentName || '');
        setGoogleChildName(childName || '');
        setAuthStep('google');
        return;
      }
    }

    // 3. Open dedicated Google Account Sign-In screen for real user credentials
    setGoogleName(parentName || '');
    setGoogleChildName(childName || '');
    setAuthStep('google');
  };

  // Confirm Google Account credentials
  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    let email = googleEmail.trim().toLowerCase();
    if (!email) {
      setErrorMsg(locale === 'uz' ? "Iltimos, Google (Gmail) pochtangizni kiriting" : "Please enter your Google (Gmail) email");
      return;
    }

    if (!email.includes('@')) {
      email = `${email}@gmail.com`;
      setGoogleEmail(email);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg(locale === 'uz' ? "Noto'g'ri elektron pochta formati (masalan: ismingiz@gmail.com)" : "Invalid email address format");
      return;
    }

    const finalName = googleName.trim() || email.split('@')[0];
    const finalChild = googleChildName.trim() || (locale === 'uz' ? "Alijon" : "Ali");

    loginUser({
      name: finalName,
      phone: email,
      childName: finalChild,
    });

    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'],
    });
  };

  // Handle GitHub OAuth or GitHub Account flow
  const handleGithubLogin = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    const hasValidSupabase =
      typeof process !== 'undefined' &&
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    if (hasValidSupabase) {
      setIsGithubLoading(true);
      try {
        const { supabase } = await import('@/lib/supabase');
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        return;
      } catch (err: any) {
        setIsGithubLoading(false);
        setErrorMsg(err?.message || (locale === 'uz' ? "GitHub tizimiga ulanishda xatolik" : "GitHub login failed"));
        setGithubUsername(parentName || '');
        setGithubChildName(childName || '');
        setAuthStep('github');
        return;
      }
    }

    // Direct GitHub Flow
    setGithubUsername(parentName || '');
    setGithubChildName(childName || '');
    setAuthStep('github');
  };

  // Confirm GitHub Account credentials
  const handleGithubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const username = githubUsername.trim();
    if (!username) {
      setErrorMsg(locale === 'uz' ? "Iltimos, GitHub foydalanuvchi nomingizni kiriting" : "Please enter your GitHub username");
      return;
    }

    let email = githubEmail.trim().toLowerCase();
    if (!email) {
      email = `${username.toLowerCase().replace(/[^a-z0-9_-]/g, '')}@github.com`;
    }

    const finalName = username;
    const finalChild = githubChildName.trim() || (locale === 'uz' ? "Alijon" : "Ali");

    loginUser({
      name: finalName,
      phone: email,
      childName: finalChild,
    });

    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#24292e', '#4078c0', '#6e5494', '#bd2c00'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md bg-[#FFFDF5] dark:bg-[#002621] border-2 border-pine-800 dark:border-butter-300 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-butter-200 hover:bg-butter-300 text-pine-900 border border-pine-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* If user is already logged in, show Account Profile */}
        {currentUser?.isLoggedIn ? (
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-butter-200 border-2 border-pine-800 mx-auto flex items-center justify-center text-3xl shadow-md">
              🦉
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 border border-emerald-400 text-[10px] font-black text-emerald-800 mb-1">
                <span>✓ {locale === 'uz' ? "Tizimga kirilgan" : "Logged in"}</span>
              </div>
              <h2 className="text-xl font-black text-pine-900 dark:text-butter-200 font-display">
                {currentUser.name}
              </h2>
              <p className="text-xs text-pine-700/80 dark:text-butter-300 font-mono mt-0.5">
                {currentUser.phone}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-pine-900 border border-amber-300 dark:border-pine-700">
                <span className="text-[10px] font-bold text-pine-600 dark:text-butter-300 block mb-0.5">
                  {locale === 'uz' ? "Bosh qahramon:" : "Child Name:"}
                </span>
                <span className="text-xs font-black text-pine-950 dark:text-butter-200 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>{currentUser.childName}</span>
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-pine-900 border border-amber-300 dark:border-pine-700">
                <span className="text-[10px] font-bold text-pine-600 dark:text-butter-300 block mb-0.5">
                  {locale === 'uz' ? "Nur Tangalari:" : "Nur Coins:"}
                </span>
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <span>🌟</span>
                  <span>{nurCoins}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  setAuthStep('form');
                  setErrorMsg('');
                }}
                className="py-2.5 px-3 rounded-2xl border-2 border-pine-800 dark:border-butter-300 bg-butter-200 hover:bg-butter-300 text-pine-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{locale === 'uz' ? "Boshqa hisobga o'tish" : "Switch Account"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  setIsAuthModalOpen(false);
                }}
                className="py-2.5 px-3 rounded-2xl border-2 border-rose-300 dark:border-rose-900 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{locale === 'uz' ? "Chiqish" : "Log Out"}</span>
              </button>
            </div>
          </div>
        ) : authStep === 'otp' ? (
          /* STEP 2: SMS OTP Verification Screen */
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => {
                setAuthStep('form');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-pine-800 dark:text-butter-300 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{locale === 'uz' ? "Raqamni o'zgartirish" : "Change phone number"}</span>
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-butter-200 dark:bg-pine-800 border-2 border-pine-800 dark:border-butter-300 mx-auto flex items-center justify-center text-pine-950 dark:text-butter-200 shadow-sm mb-2">
                <Smartphone className="w-6 h-6 text-pine-900 dark:text-butter-200" />
              </div>
              <h2 className="text-xl font-black text-pine-900 dark:text-butter-200 font-display">
                {locale === 'uz' ? "SMS Kodni Kiriting" : "Enter Verification Code"}
              </h2>
              <p className="text-xs text-pine-700/80 dark:text-butter-300/80 font-medium">
                {locale === 'uz' ? (
                  <>
                    <span className="font-bold font-mono text-pine-950 dark:text-butter-200">+998 {formatUzbekPhoneDisplay(phoneDigits)}</span> raqamiga yuborilgan 4 xonali kodni kiriting
                  </>
                ) : (
                  <>
                    Sent to <span className="font-bold font-mono">+998 {formatUzbekPhoneDisplay(phoneDigits)}</span>
                  </>
                )}
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="p-2.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* 4-Box OTP Input */}
            <div className="flex justify-center gap-3 my-4">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={otpInputRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black font-mono rounded-2xl bg-white dark:bg-pine-900 border-2 border-pine-800 dark:border-butter-300 text-pine-950 dark:text-butter-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-pine-950 transition-all"
                />
              ))}
            </div>

            {/* Quick Demo Helper Chip (Allows 1-click test fill) */}
            {demoOtpCode && (
              <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-pine-900/60 border border-amber-300 dark:border-pine-700 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-pine-900 dark:text-butter-200">
                  <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    {locale === 'uz' ? "SMS kod keldi:" : "SMS received:"}{' '}
                    <strong className="font-mono font-black text-amber-700 dark:text-amber-400">{demoOtpCode}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const digits = demoOtpCode.split('').slice(0, 4);
                    setOtpDigits(digits);
                    triggerVerification(demoOtpCode);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-amber-200 hover:bg-amber-300 dark:bg-pine-800 text-pine-950 dark:text-butter-200 text-[11px] font-black transition-colors cursor-pointer border border-amber-400 dark:border-pine-600"
                >
                  {locale === 'uz' ? "Kodni to'ldirish" : "Auto-fill"}
                </button>
              </div>
            )}

            {/* Verification Button */}
            <button
              type="button"
              onClick={() => triggerVerification()}
              disabled={isVerifyingOtp || otpDigits.join('').length < 4}
              className="w-full py-3.5 px-6 rounded-2xl bg-pine-800 hover:bg-pine-700 disabled:opacity-50 text-butter-200 font-extrabold text-sm border-2 border-butter-200 shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isVerifyingOtp ? (locale === 'uz' ? "Tasdiqlanmoqda..." : "Verifying...") : (locale === 'uz' ? "Tasdiqlash & Kirish" : "Verify & Sign In")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Resend SMS section */}
            <div className="text-center pt-2">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendSms}
                  disabled={isSendingSms}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-pine-800 dark:text-butter-300 hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isSendingSms ? (locale === 'uz' ? "Yuborilmoqda..." : "Sending...") : (locale === 'uz' ? "Kodni qayta yuborish" : "Resend SMS code")}</span>
                </button>
              ) : (
                <p className="text-xs text-pine-600/70 dark:text-butter-300/70 font-mono">
                  {locale === 'uz' ? `Qayta yuborish: 00:${otpCountdown < 10 ? `0${otpCountdown}` : otpCountdown}` : `Resend in: 00:${otpCountdown < 10 ? `0${otpCountdown}` : otpCountdown}`}
                </p>
              )}
            </div>
          </div>
        ) : authStep === 'google' ? (
          /* Google Account Sign-In Screen */
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => {
                setAuthStep('form');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-pine-800 dark:text-butter-300 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{locale === 'uz' ? "Boshqa usulga qaytish" : "Go back"}</span>
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-pine-900 border-2 border-slate-200 dark:border-butter-300 mx-auto flex items-center justify-center shadow-md p-2">
                <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-butter-200 text-pine-900 text-[11px] font-black border border-pine-800">
                <Sparkles className="w-3 h-3 text-pine-800" />
                <span>{locale === 'uz' ? "+50 Nur Tangasi Sovg'a! 🌟" : "+50 Nur Coins Bonus! 🌟"}</span>
              </div>

              <h2 className="text-xl font-black text-pine-900 dark:text-butter-200 font-display">
                {locale === 'uz' ? "Google Hisobingiz Bilan Kirish" : "Sign In with Google"}
              </h2>

              <p className="text-xs text-pine-700/80 dark:text-butter-300/80 font-medium max-w-xs mx-auto">
                {locale === 'uz'
                  ? "Farzandingiz ertaklarini saqlash uchun shaxsiy Google (Gmail) pochtangizni kiriting"
                  : "Enter your Google (Gmail) account to access your stories & get 50 Nur Coins"}
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleGoogleSubmit} className="space-y-3.5">
              {/* Google Email */}
              <div>
                <label className="block text-xs font-bold text-pine-900 dark:text-butter-200 mb-1">
                  {locale === 'uz' ? "Google Pochta (Gmail manzili)" : "Google Email (Gmail address)"}
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-pine-700 dark:text-butter-300 absolute left-3.5" />
                  <input
                    type="email"
                    required
                    value={googleEmail}
                    onChange={(e) => { setGoogleEmail(e.target.value); setErrorMsg(''); }}
                    placeholder="sizning.nomingiz@gmail.com"
                    className="w-full pl-10 pr-24 py-2.5 rounded-2xl bg-white dark:bg-pine-900 border-2 border-pine-800/40 dark:border-butter-300/40 text-pine-900 dark:text-butter-200 text-xs font-medium focus:outline-none focus:border-pine-800 dark:focus:border-butter-200"
                  />
                  {!googleEmail.includes('@') && (
                    <button
                      type="button"
                      onClick={() => setGoogleEmail((prev) => prev ? `${prev.trim()}@gmail.com` : '')}
                      className="absolute right-2 px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-pine-800 text-slate-700 dark:text-butter-200 text-[10px] font-bold border border-slate-300 dark:border-pine-700 cursor-pointer"
                    >
                      + @gmail.com
                    </button>
                  )}
                </div>
              </div>

              {/* Real Name */}
              <div>
                <label className="block text-xs font-bold text-pine-900 dark:text-butter-200 mb-1">
                  {locale === 'uz' ? "Ism-sharifingiz" : "Full Name"}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-pine-700 dark:text-butter-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={googleName}
                    onChange={(e) => { setGoogleName(e.target.value); setErrorMsg(''); }}
                    placeholder={locale === 'uz' ? "Masalan: Azamat Karimov" : "e.g. John Doe"}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-pine-900 border-2 border-pine-800/40 dark:border-butter-300/40 text-pine-900 dark:text-butter-200 text-xs font-medium focus:outline-none focus:border-pine-800 dark:focus:border-butter-200"
                  />
                </div>
              </div>

              {/* Child's Name */}
              <div>
                <label className="block text-xs font-bold text-pine-900 dark:text-butter-200 mb-1">
                  {locale === 'uz' ? "Farzandingiz ismi (ixtiyoriy)" : "Child Name (Optional)"}
                </label>
                <div className="relative">
                  <Heart className="w-4 h-4 text-pine-700 dark:text-butter-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={googleChildName}
                    onChange={(e) => setGoogleChildName(e.target.value)}
                    placeholder={locale === 'uz' ? "Masalan: Ali yoki Madina" : "e.g. Ali or Emma"}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-pine-900 border-2 border-pine-800/40 dark:border-butter-300/40 text-pine-900 dark:text-butter-200 text-xs font-medium focus:outline-none focus:border-pine-800 dark:focus:border-butter-200"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-pine-800 hover:bg-pine-700 text-butter-200 font-extrabold text-sm border-2 border-butter-200 shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{locale === 'uz' ? "Google Hisobim Bilan Kirish" : "Sign In with My Google Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : authStep === 'github' ? (
          /* GitHub Account Sign-In Screen */
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => {
                setAuthStep('form');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-pine-800 dark:text-butter-300 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{locale === 'uz' ? "Boshqa usulga qaytish" : "Go back"}</span>
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border-2 border-slate-700 mx-auto flex items-center justify-center shadow-md p-2 text-white">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-butter-200 text-pine-900 text-[11px] font-black border border-pine-800">
                <Sparkles className="w-3 h-3 text-pine-800" />
                <span>{locale === 'uz' ? "+50 Nur Tangasi Sovg'a! 🌟" : "+50 Nur Coins Bonus! 🌟"}</span>
              </div>

              <h2 className="text-xl font-black text-pine-900 dark:text-butter-200 font-display">
                {locale === 'uz' ? "GitHub Hisobingiz Bilan Kirish" : "Sign In with GitHub"}
              </h2>

              <p className="text-xs text-pine-700/80 dark:text-butter-300/80 font-medium max-w-xs mx-auto">
                {locale === 'uz'
                  ? "Ertaklarni saqlash va davom etish uchun GitHub profilingizni ulang"
                  : "Connect your GitHub account to access your stories & rewards"}
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleGithubSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-pine-900 dark:text-butter-200 mb-1">
                  {locale === 'uz' ? "GitHub Foydalanuvchi Nomi (Username)" : "GitHub Username"}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-pine-700 dark:text-butter-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={githubUsername}
                    onChange={(e) => { setGithubUsername(e.target.value); setErrorMsg(''); }}
                    placeholder="masalan: octocat yoki ismingiz"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-pine-900 border-2 border-pine-800/40 dark:border-butter-300/40 text-pine-900 dark:text-butter-200 text-xs font-medium focus:outline-none focus:border-pine-800 dark:focus:border-butter-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-pine-900 dark:text-butter-200 mb-1">
                  {locale === 'uz' ? "Email manzilingiz (ixtiyoriy)" : "Email Address (Optional)"}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-pine-700 dark:text-butter-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={githubEmail}
                    onChange={(e) => setGithubEmail(e.target.value)}
                    placeholder="github-emailingiz@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-pine-900 border-2 border-pine-800/40 dark:border-butter-300/40 text-pine-900 dark:text-butter-200 text-xs font-medium focus:outline-none focus:border-pine-800 dark:focus:border-butter-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-pine-900 dark:text-butter-200 mb-1">
                  {locale === 'uz' ? "Farzandingiz ismi" : "Child Name"}
                </label>
                <div className="relative">
                  <Heart className="w-4 h-4 text-pine-700 dark:text-butter-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={githubChildName}
                    onChange={(e) => setGithubChildName(e.target.value)}
                    placeholder={locale === 'uz' ? "Masalan: Ali yoki Madina" : "e.g. Ali or Emma"}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-pine-900 border-2 border-pine-800/40 dark:border-butter-300/40 text-pine-900 dark:text-butter-200 text-xs font-medium focus:outline-none focus:border-pine-800 dark:focus:border-butter-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm border-2 border-slate-700 shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>{locale === 'uz' ? "GitHub Hisobim Bilan Kirish" : "Sign In with My GitHub Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* STEP 1: Registration / Login Form */
          <>
            {/* Top Header Badge */}
            <div className="text-center space-y-2 mb-5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-butter-200 text-pine-900 text-xs font-black border border-pine-800">
                <Sparkles className="w-3.5 h-3.5 text-pine-800" />
                <span>{locale === 'uz' ? "+50 Nur Tangasi Sovg'a! 🌟" : "+50 Nur Coins Welcome Gift! 🌟"}</span>
              </div>

              <h2 className="text-2xl font-black text-pine-900 dark:text-butter-200 font-display">
                {authMode === 'signup' 
                  ? (locale === 'uz' ? "Ro'yxatdan O'tish" : "Create an Account")
                  : (locale === 'uz' ? "Tizimga Kirish" : "Welcome Back")}
              </h2>

              <p className="text-xs text-pine-700/80 dark:text-butter-200/80 font-medium">
                {locale === 'uz'
                  ? "Farzandingiz ertaklarini saqlash va topshiriqlarni kuzatib borish uchun hisobingizga kiring"
                  : "Access your personalized storybooks, missions, and rewards"}
              </p>
            </div>

            {/* Social OAuth Buttons: Google & GitHub */}
            <div className="space-y-2.5 mb-4">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isGithubLoading}
                className="w-full py-2.5 px-4 rounded-2xl border-2 border-slate-300 dark:border-pine-700 bg-white dark:bg-pine-900 hover:bg-slate-50 dark:hover:bg-pine-800 text-slate-800 dark:text-butter-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>
                  {isGoogleLoading
                    ? (locale === 'uz' ? "Google'ga ulanmoqda..." : "Connecting to Google...")
                    : (locale === 'uz' ? "Google orqali davom etish" : "Continue with Google")}
                </span>
              </button>

              {/* GitHub Button */}
              <button
                type="button"
                onClick={handleGithubLogin}
                disabled={isGoogleLoading || isGithubLoading}
                className="w-full py-2.5 px-4 rounded-2xl border-2 border-slate-800 dark:border-slate-700 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>
                  {isGithubLoading
                    ? (locale === 'uz' ? "GitHub'ga ulanmoqda..." : "Connecting to GitHub...")
                    : (locale === 'uz' ? "GitHub orqali davom etish" : "Continue with GitHub")}
                </span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-[1px] bg-slate-200 dark:bg-pine-800" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-butter-300/60 uppercase tracking-wider">
                  {locale === 'uz' ? "yoki telefon raqam orqali" : "or with phone number"}
                </span>
                <div className="flex-1 h-[1px] bg-slate-200 dark:bg-pine-800" />
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-butter-100 dark:bg-pine-900 p-1 rounded-2xl border border-pine-800/30 dark:border-butter-300/30 mb-4">
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  authMode === 'signup'
                    ? 'bg-pine-800 text-butter-200 dark:bg-butter-200 dark:text-pine-950 shadow-sm'
                    : 'text-pine-800 dark:text-butter-200 hover:bg-butter-200/50'
                }`}
              >
                {locale === 'uz' ? "Ro'yxatdan O'tish" : "Sign Up"}
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  authMode === 'login'
                    ? 'bg-pine-800 text-butter-200 dark:bg-butter-200 dark:text-pine-950 shadow-sm'
                    : 'text-pine-800 dark:text-butter-200 hover:bg-butter-200/50'
                }`}
              >
                {locale === 'uz' ? "Kirish" : "Log In"}
              </button>
            </div>

            {/* Error Alert if validation fails */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRequestOtp} className="space-y-3.5">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-pine-900 dark:text-butter-200 mb-1">
                    {locale === 'uz' ? "Ota-onaning ismi" : "Parent Full Name"}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-pine-700 dark:text-butter-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder={locale === 'uz' ? "Masalan: Nilufar opa" : "e.g. Sarah Jenkins"}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-pine-900 border-2 border-pine-800/40 dark:border-butter-300/40 text-pine-900 dark:text-butter-200 text-xs font-medium focus:outline-none focus:border-pine-800 dark:focus:border-butter-200"
                    />
                  </div>
                </div>
              )}

              {/* Strict 9-Digit Uzbek Phone Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-pine-900 dark:text-butter-200">
                    {locale === 'uz' ? "Telefon raqami (O'zbekiston, 9 xonali)" : "Phone Number (Uzbekistan, 9 digits)"}
                  </label>
                  <span className={`text-[10px] font-black ${phoneDigits.length === 9 ? 'text-emerald-600 dark:text-butter-300' : 'text-pine-600 dark:text-butter-400'}`}>
                    {phoneDigits.length} / 9 {locale === 'uz' ? "xona" : "digits"}
                  </span>
                </div>

                <div className="relative flex items-center">
                  {/* Fixed +998 Badge */}
                  <div className="absolute left-2.5 flex items-center gap-1 px-2 py-1 rounded-xl bg-butter-200 border border-pine-800 text-pine-950 font-black text-xs pointer-events-none z-10">
                    <span>🇺🇿</span>
                    <span>+998</span>
                  </div>

                  <input
                    type="tel"
                    required
                    maxLength={14}
                    value={formatUzbekPhoneDisplay(phoneDigits)}
                    onChange={handlePhoneChange}
                    placeholder="(90) 123-45-67"
                    className="w-full pl-24 pr-10 py-2.5 rounded-2xl bg-white dark:bg-pine-900 border-2 border-pine-800/40 dark:border-butter-300/40 text-pine-900 dark:text-butter-200 text-xs font-bold font-mono focus:outline-none focus:border-pine-800 dark:focus:border-butter-200"
                  />

                  {phoneDigits.length === 9 && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                <p className="text-[10px] text-pine-700/70 dark:text-butter-300/70 mt-1 font-medium">
                  {locale === 'uz' ? "SMS tasdiqlash kodi shu raqamga yuboriladi" : "SMS verification code will be sent to this number"}
                </p>
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-pine-900 dark:text-butter-200 mb-1">
                    {locale === 'uz' ? "Farzandingiz ismi" : "Child Name (Optional)"}
                  </label>
                  <div className="relative">
                    <Heart className="w-4 h-4 text-pine-700 dark:text-butter-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder={locale === 'uz' ? "Masalan: Ali yoki Madina" : "e.g. Leo or Emma"}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-pine-900 border-2 border-pine-800/40 dark:border-butter-300/40 text-pine-900 dark:text-butter-200 text-xs font-medium focus:outline-none focus:border-pine-800 dark:focus:border-butter-200"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-pine-900 dark:text-butter-200 mb-1">
                  {locale === 'uz' ? "Parol" : "Password"}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-pine-700 dark:text-butter-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-pine-900 border-2 border-pine-800/40 dark:border-butter-300/40 text-pine-900 dark:text-butter-200 text-xs font-medium focus:outline-none focus:border-pine-800 dark:focus:border-butter-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingSms}
                className="w-full py-3.5 px-6 rounded-2xl bg-pine-800 hover:bg-pine-700 disabled:opacity-50 text-butter-200 font-extrabold text-sm border-2 border-butter-200 shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <span>
                  {isSendingSms 
                    ? (locale === 'uz' ? "SMS kod yuborilmoqda..." : "Sending SMS code...") 
                    : (locale === 'uz' ? "SMS Kodni Olish & Davom Etish" : "Get SMS Code & Continue")}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}

        {/* Trust Note */}
        <div className="mt-5 pt-3 border-t border-butter-300 dark:border-pine-700 flex items-center justify-center gap-2 text-[11px] font-bold text-pine-700 dark:text-butter-300 text-center">
          <ShieldCheck className="w-4 h-4 text-pine-800 dark:text-butter-300" />
          <span>{locale === 'uz' ? "Xavfsiz va bolalar ma'lumotlari to'liq himoyalangan" : "100% Safe & Child Privacy Protected"}</span>
        </div>

      </motion.div>
    </div>
  );
}
