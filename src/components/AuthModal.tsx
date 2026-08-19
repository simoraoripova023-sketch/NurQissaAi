'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, User, Phone, Lock, Heart, CheckCircle2, 
  ArrowRight, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { cleanUzbekPhoneDigits, formatUzbekPhoneDisplay, isUzbekPhoneValid } from '@/lib/phoneHelper';
import confetti from 'canvas-confetti';

export default function AuthModal() {
  const { locale, isAuthModalOpen, setIsAuthModalOpen, loginUser, currentUser } = useAppStore();
  const t = translations[locale];

  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [parentName, setParentName] = useState('');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [childName, setChildName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = cleanUzbekPhoneDigits(e.target.value);
    setPhoneDigits(cleaned);
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict 9-digit validation
    if (!isUzbekPhoneValid(phoneDigits)) {
      setErrorMsg(
        locale === 'uz'
          ? "Telefon raqam aniq 9 xonali bo'lishi shart (masalan: 90 123 45 67)"
          : "Phone number must be exactly 9 digits (e.g. 90 123 45 67)"
      );
      return;
    }

    // Perform login / registration
    const formattedPhone = `+998 ${formatUzbekPhoneDisplay(phoneDigits)}`;
    loginUser({
      name: parentName || (locale === 'uz' ? "Aziz Ota-ona" : "Dear Parent"),
      phone: formattedPhone,
      childName: childName || "Ali",
    });

    // Confetti celebration
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FFEFB3', '#013E37', '#F59E0B'],
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

        {/* Top Header Badge */}
        <div className="text-center space-y-2 mb-6">
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

        {/* Tab Switcher */}
        <div className="flex bg-butter-100 dark:bg-pine-900 p-1 rounded-2xl border border-pine-800/30 dark:border-butter-300/30 mb-5">
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
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
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
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
        <form onSubmit={handleSubmit} className="space-y-3.5">
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
              {locale === 'uz' ? "Faqat 9 ta raqam kiriting (masalan: 901234567)" : "Enter 9 digits only (e.g. 901234567)"}
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
            className="w-full py-3.5 px-6 rounded-2xl bg-pine-800 hover:bg-pine-700 text-butter-200 font-extrabold text-sm border-2 border-butter-200 shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>{authMode === 'signup' ? (locale === 'uz' ? "Hisob Ochish & Boshlash" : "Sign Up & Get Started") : (locale === 'uz' ? "Kirish" : "Sign In")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Trust Note */}
        <div className="mt-5 pt-3 border-t border-butter-300 dark:border-pine-700 flex items-center justify-center gap-2 text-[11px] font-bold text-pine-700 dark:text-butter-300 text-center">
          <ShieldCheck className="w-4 h-4 text-pine-800 dark:text-butter-300" />
          <span>{locale === 'uz' ? "Xavfsiz va bolalar ma'lumotlari to'liq himoyalangan" : "100% Safe & Child Privacy Protected"}</span>
        </div>

      </motion.div>
    </div>
  );
}
