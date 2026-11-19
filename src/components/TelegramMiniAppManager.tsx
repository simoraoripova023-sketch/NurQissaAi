'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTelegram } from '@/lib/useTelegram';
import { useAppStore } from '@/lib/store';
import { Home, Sparkles, BookOpen, Trees, Gamepad2, Award } from 'lucide-react';

export default function TelegramMiniAppManager() {
  const { isTelegram, user, colorScheme, hapticSelection } = useTelegram();
  const { setTheme, childProfile, updateChildProfile } = useAppStore();
  const pathname = usePathname();

  // Sync theme with Telegram color scheme
  useEffect(() => {
    if (isTelegram && colorScheme) {
      setTheme(colorScheme === 'dark' ? 'night' : 'day');
    }
  }, [isTelegram, colorScheme, setTheme]);

  // Sync user info if available
  useEffect(() => {
    if (isTelegram && user && !childProfile.child_name) {
      updateChildProfile({
        child_name: user.first_name || 'Nurulloh',
      });
    }
  }, [isTelegram, user, childProfile.child_name, updateChildProfile]);

  // If reading a story page (e.g. /story/xyz), we hide bottom bar for full immersion
  const isReadingStory = pathname.startsWith('/story/');

  if (!isTelegram || isReadingStory) {
    return null;
  }

  const navItems = [
    { label: 'Bosh sahifa', href: '/', icon: Home },
    { label: 'Ertak yaratish', href: '/create', icon: Sparkles, highlight: true },
    { label: 'Kutubxona', href: '/library', icon: BookOpen },
    { label: 'Fazilatlar', href: '/tree', icon: Trees },
    { label: 'O\'yinlar', href: '/games', icon: Gamepad2 },
  ];

  return (
    <nav 
      aria-label="Telegram Mini App Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0E1326]/95 backdrop-blur-md border-t border-emerald-900/10 dark:border-emerald-500/20 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-lg transition-transform"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => hapticSelection()}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                  isActive 
                    ? 'bg-gradient-to-tr from-emerald-600 to-amber-500 text-white ring-4 ring-emerald-500/20' 
                    : 'bg-gradient-to-tr from-emerald-500 to-amber-400 text-white shadow-emerald-500/30'
                }`}>
                  <Icon className="w-6 h-6 animate-pulse" />
                </div>
                <span className={`text-[10px] font-semibold mt-1 ${isActive ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => hapticSelection()}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors active:scale-95 ${
                isActive 
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
