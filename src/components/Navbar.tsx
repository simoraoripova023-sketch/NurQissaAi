'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, Moon, Sun, Globe, User, LogIn
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import MagicUmbrellaMenu from '@/components/MagicUmbrellaMenu';
import MagicOwlAuthButton from '@/components/MagicOwlAuthButton';
import AuthModal from '@/components/AuthModal';

export default function Navbar() {
  const pathname = usePathname();
  const { 
    locale, setLocale, nurCoins, theme, toggleTheme, 
    setIsAuthModalOpen, currentUser,
    freeStoriesLeft, hasPaidSubscription, setIsPricingModalOpen
  } = useAppStore();
  const t = translations[locale];

  const toggleLanguage = () => {
    setLocale(locale === 'uz' ? 'en' : 'uz');
  };

  return (
    <>
      <header className="no-print print:hidden sticky top-0 z-40 w-full backdrop-blur-md bg-[#FFFDF5]/95 dark:bg-[#002621]/95 border-b border-butter-300/70 dark:border-pine-700/60 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Left Side: NurQissa AI Logo + Interactive Magic Umbrella Menu Badge */}
            <div className="flex items-center gap-1.5 sm:gap-4">
              
              {/* Main Brand Logo */}
              <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                <div className="relative w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-butter-200 border-2 border-pine-800 p-[2px] shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0">
                  <div className="w-full h-full bg-pine-800 rounded-[8px] sm:rounded-[12px] flex items-center justify-center relative overflow-hidden">
                    <Moon className="w-4 h-4 sm:w-6 sm:h-6 text-butter-200 fill-butter-200/40 transform -rotate-12 transition-transform group-hover:rotate-0 duration-300" />
                    <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-butter-300 absolute top-1 right-1 animate-pulse" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <span className="text-lg sm:text-2xl font-black tracking-tight text-pine-800 dark:text-butter-200 font-display">
                      NurQissa<span className="text-butter-500 dark:text-butter-300 text-sm sm:text-lg font-bold">AI</span>
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-pine-600 dark:text-butter-300 tracking-wide -mt-1 hidden md:inline">
                    {locale === 'uz' ? "Sehrli & Ibratli Ertaklar" : "Bedtime Values Storybooks"}
                  </span>
                </div>
              </Link>

              {/* Separator Line */}
              <div className="h-6 sm:h-8 w-[1.5px] bg-butter-300 dark:bg-pine-700/80 mx-0.5 hidden md:block" />

              {/* Interactive Magic Umbrella Menu Badge (Placed on the Left beside Logo) */}
              <div className="flex items-center">
                <MagicUmbrellaMenu />
              </div>

            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Story Credit / Subscription Pill */}
              <button
                onClick={() => setIsPricingModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-400/20 hover:from-amber-400/30 hover:to-orange-400/30 border-2 border-amber-500/70 text-amber-900 dark:text-amber-200 text-[11px] sm:text-xs font-black shadow-sm hover:scale-105 transition-all"
                title={locale === 'uz' ? "Qissa balansi va tariflar" : "Story balance & plans"}
              >
                {hasPaidSubscription ? (
                  <>
                    <span className="text-xs sm:text-sm">👑</span>
                    <span>VIP</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs sm:text-sm">📖</span>
                    <span>{freeStoriesLeft} {locale === 'uz' ? 'ta' : 'left'}</span>
                  </>
                )}
              </button>

              {/* Nur Coins Pill */}
              <Link
                href="/missions"
                className="flex items-center gap-1 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-butter-200 hover:bg-butter-300 border-2 border-pine-800/60 text-pine-900 text-[11px] sm:text-xs font-black shadow-sm hover:scale-105 transition-all"
                title={t.nurCoins}
              >
                <span className="text-xs sm:text-sm">🌟</span>
                <span>{nurCoins}</span>
              </Link>

              {/* Dedicated Night / Day Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-full border-2 border-pine-800/40 dark:border-butter-200/40 bg-butter-100 dark:bg-pine-900 hover:bg-butter-200 dark:hover:bg-pine-800 text-pine-800 dark:text-butter-200 shadow-sm transition-all flex items-center justify-center"
                title={theme === 'night' ? (locale === 'uz' ? "Kunduzgi rejimga o'tish" : "Switch to Day Mode") : (locale === 'uz' ? "Tungi orom rejimiga o'tish" : "Switch to Night Mode")}
              >
                {theme === 'night' ? (
                  <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-butter-300" />
                ) : (
                  <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pine-800" />
                )}
              </button>

              {/* Cute Fairy Owl Ro'yxatdan O'tish Button */}
              <MagicOwlAuthButton />

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-pine-800/30 dark:border-butter-200/40 bg-white dark:bg-pine-900 hover:bg-butter-100 dark:hover:bg-pine-800 text-pine-800 dark:text-butter-200 text-xs font-bold shadow-sm transition-all"
                title="Tilni o'zgartirish / Change language"
              >
                <Globe className="w-3.5 h-3.5 text-pine-700 dark:text-butter-300" />
                <span>{locale === 'uz' ? "🇺🇿 UZ" : "🇬🇧 EN"}</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Global Auth Modal */}
      <AuthModal />
    </>
  );
}
