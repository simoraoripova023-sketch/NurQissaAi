'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Home, PlusCircle, Target, Library, 
  X, ChevronRight
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import confetti from 'canvas-confetti';

interface MagicMushroomPullLampProps {
  onMenuToggle?: (open: boolean) => void;
}

export default function MagicMushroomPullLamp({ onMenuToggle }: MagicMushroomPullLampProps) {
  const pathname = usePathname();
  const { locale, theme, stories, nurCoins } = useAppStore();
  const t = translations[locale];

  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSparkling, setIsSparkling] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { 
      href: '/', 
      label: locale === 'uz' ? 'Bosh sahifa' : 'Home', 
      desc: locale === 'uz' ? 'Asosiy vitrina va tanishtiruv' : 'Main showcase & overview',
      icon: Home, 
      badge: undefined,
    },
    { 
      href: '/create', 
      label: t.createStory, 
      desc: locale === 'uz' ? 'AI bilan yangi ertak yaratish' : 'Create new AI fairytale',
      icon: PlusCircle, 
      highlight: true,
    },
    { 
      href: '/missions', 
      label: t.missions, 
      desc: locale === 'uz' ? 'Kunlik vazifalar va tangalar' : 'Daily missions & rewards',
      icon: Target, 
      badge: undefined,
    },
    { 
      href: '/library', 
      label: t.library, 
      desc: locale === 'uz' ? 'Siz yaratgan ertaklar javoni' : 'Your saved storybooks shelf',
      icon: Library, 
      badge: stories.length > 0 ? stories.length : undefined,
    },
  ];

  const handleToggle = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    setIsSparkling(true);
    setTimeout(() => setIsSparkling(false), 800);

    if (onMenuToggle) onMenuToggle(nextOpen);

    // Light sparkle celebration
    if (nextOpen) {
      confetti({
        particleCount: 22,
        spread: 50,
        origin: { y: 0.15, x: 0.24 },
        colors: ['#FFEFB3', '#013E37', '#F59E0B', '#10B981'],
      });
    }
  };

  // Close on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative inline-flex items-center select-none">
      
      {/* Interactive Cute Magic Mushroom Pill Button (Matches Boyqushcha Style) */}
      <motion.button
        type="button"
        onClick={handleToggle}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-butter-200 hover:bg-butter-300 border-2 border-pine-800 text-pine-950 font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all group focus:outline-none"
        title={locale === 'uz' ? "Sehrli qo'ziqorin orqali bo'limlarga o'tish" : "Magic Mushroom Menu"}
      >
        
        {/* Animated Cute Magic Mushroom Icon Container */}
        <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
          
          {/* Glowing Ambient Halo */}
          <div className="absolute -inset-1 rounded-full bg-amber-300/40 blur-xs opacity-80 group-hover:opacity-100 transition-opacity" />

          {/* Continuously Moving & Swaying Mushroom Character */}
          <motion.div
            animate={{ 
              rotate: [-5, 5, -5],
              y: [-1.5, 1.5, -1.5],
              scale: [1, 1.03, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3.2, 
              ease: "easeInOut" 
            }}
            className="relative z-10 flex flex-col items-center"
          >
            <svg width="30" height="28" viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Mushroom Dome Cap */}
              <path
                d="M3 24C3 12.402 11.5066 3 22 3C32.4934 3 41 12.402 41 24C41 25.5 39.8 26.5 38 26.5C31.5 26.5 27 25 22 25C17 25 12.5 26.5 6 26.5C4.2 26.5 3 25.5 3 24Z"
                fill="#013E37"
                stroke="#FFEFB3"
                strokeWidth="2.4"
              />
              {/* Fairytale Warm Cream Spots */}
              <circle cx="14" cy="14" r="3.2" fill="#FFEFB3" />
              <circle cx="28" cy="11" r="2.6" fill="#FFEFB3" />
              <circle cx="22" cy="19" r="2.2" fill="#FFEFB3" />
              <circle cx="34" cy="19" r="2" fill="#FFEFB3" />

              {/* Glowing Base / Stem */}
              <path
                d="M17 26.5V32C17 33.5 19 34.5 22 34.5C25 34.5 27 33.5 27 32V26.5"
                fill="#FFEFB3"
                stroke="#013E37"
                strokeWidth="1.8"
              />
            </svg>

            {/* Tiny Dangling Golden Pull String Bell under stem */}
            <motion.div
              animate={{ 
                rotate: [-8, 8, -8],
                x: [-1, 1, -1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2, 
                ease: "easeInOut" 
              }}
              className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-pine-900 -mt-1 shadow-xs flex items-center justify-center"
            >
              <div className="w-0.5 h-0.5 rounded-full bg-pine-950" />
            </motion.div>
          </motion.div>

          {/* Mini Sparkle in Corner */}
          <Sparkles className="w-3 h-3 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
        </div>

        {/* Two-line Text Label (Exact Layout Match with Boyqushcha) */}
        <div className="flex flex-col text-left pr-1">
          <span className="text-[11px] sm:text-xs font-black leading-tight text-pine-950 flex items-center gap-1">
            <span>{locale === 'uz' ? "Sehrli Menyu" : "Magic Menu"}</span>
          </span>
          <span className="text-[9px] font-bold text-pine-700 leading-none">
            {locale === 'uz' ? "Qo'ziqorincha 🍄" : "Magic Lamp 🍄"}
          </span>
        </div>

      </motion.button>

      {/* Cascading Floating Dropdown Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 top-full mt-3 w-80 sm:w-84 bg-[#FFFDF5]/95 dark:bg-[#002621]/95 backdrop-blur-xl border-2 border-pine-800 dark:border-butter-300 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 z-50 overflow-hidden"
          >
            {/* Fairytale Background Glow */}
            <div className="absolute -top-12 -left-12 w-36 h-36 bg-amber-400/20 dark:bg-butter-300/10 rounded-full blur-2xl pointer-events-none" />

            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b border-butter-300/80 dark:border-pine-700/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-butter-200 dark:bg-pine-800 flex items-center justify-center text-lg border border-pine-800/30">
                  🍄
                </div>
                <div>
                  <h4 className="text-sm font-black text-pine-900 dark:text-butter-200">
                    {locale === 'uz' ? "NurQissa AI — Bo'limlar" : "NurQissa AI — Sections"}
                  </h4>
                  <p className="text-[10px] font-semibold text-pine-600 dark:text-butter-300/80">
                    {locale === 'uz' ? "Tezkor sahifalar javoni" : "Quick access drawer"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-butter-200 dark:bg-pine-800 border border-pine-800/30 text-xs font-black text-pine-900 dark:text-butter-200">
                  🌟 {nurCoins}
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-pine-700 dark:text-butter-300 hover:bg-butter-200 dark:hover:bg-pine-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1.5 pt-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all group ${
                      isActive
                        ? 'bg-pine-800 text-butter-200 dark:bg-butter-200 dark:text-pine-950 shadow-md border-2 border-butter-300 dark:border-pine-800'
                        : link.highlight
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md hover:scale-[1.02] border border-emerald-500'
                        : 'text-pine-900 dark:text-butter-100 hover:bg-butter-200/80 dark:hover:bg-pine-800/80 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isActive
                          ? 'bg-butter-300 text-pine-900'
                          : link.highlight
                          ? 'bg-white/20 text-white'
                          : 'bg-butter-200 dark:bg-pine-900 text-pine-800 dark:text-butter-200'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs sm:text-sm font-black leading-tight">
                          {link.label}
                        </span>
                        <span className={`text-[10px] font-medium leading-tight ${
                          isActive 
                            ? 'text-butter-300 dark:text-pine-800' 
                            : link.highlight 
                            ? 'text-emerald-100' 
                            : 'text-pine-600 dark:text-butter-300/70'
                        }`}>
                          {link.desc}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {link.badge !== undefined && (
                        <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-butter-300 text-pine-900 border border-pine-800/20">
                          {link.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ${
                        link.highlight ? 'text-white' : ''
                      }`} />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Bottom Tip */}
            <div className="pt-2 border-t border-butter-300/80 dark:border-pine-700/80 flex items-center justify-between text-[11px] font-bold text-pine-700 dark:text-butter-300 px-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {locale === 'uz' ? "Sehrli qo'ziqorin chiroq" : "Magic Lamp"}
              </span>
              <span className="text-[10px] text-pine-500 dark:text-butter-400">
                {locale === 'uz' ? "Yopish uchun bosing" : "Click to close"}
              </span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
