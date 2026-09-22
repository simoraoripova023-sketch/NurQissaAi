'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Sparkles, Home, PlusCircle, Target, Library, Trophy, Palette,
  X, ChevronRight
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import confetti from 'canvas-confetti';

interface MagicUmbrellaMenuProps {
  onMenuToggle?: (open: boolean) => void;
}

export default function MagicUmbrellaMenu({ onMenuToggle }: MagicUmbrellaMenuProps) {
  const pathname = usePathname();
  const { locale, theme, stories, nurCoins } = useAppStore();
  const t = translations[locale];

  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Framer motion drag value for pulling down the umbrella handle
  const y = useMotionValue(0);
  const handleOffset = useTransform(y, [0, 25], [0, 15]);

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
      href: '/games', 
      label: locale === 'uz' ? 'Hikmatli O\'yinlar' : 'Wisdom Games', 
      desc: locale === 'uz' ? 'Montessori, Poklik, Ozuqachi & Mozaika' : 'Montessori sorting, I Spy & Puzzles',
      icon: Trophy, 
      badge: '🎮 O\'yin',
    },
    { 
      href: '/coloring', 
      label: locale === 'uz' ? 'Sehrli Ijodxona' : 'Creative Studio', 
      desc: locale === 'uz' ? 'Saboqlar bo\'yash, Sehrli chiziqlar & Stikerlar' : 'Aqida coloring, Tracing & Stickers',
      icon: Palette, 
      badge: '🎨 Ijod',
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
    if (onMenuToggle) onMenuToggle(nextOpen);

    // Light sparkle celebration when opened
    if (nextOpen) {
      confetti({
        particleCount: 26,
        spread: 55,
        origin: { y: 0.15, x: 0.24 },
        colors: ['#FFEFB3', '#013E37', '#F59E0B', '#38BDF8', '#A855F7'],
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
      
      {/* Interactive Cute "Sirli Soyabon" Button (Matches Boyqushcha Style) */}
      <motion.button
        type="button"
        onClick={handleToggle}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-butter-200 hover:bg-butter-300 border-2 border-pine-800 text-pine-950 font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all group focus:outline-none"
        title={locale === 'uz' ? "Sirli Soyabon — Bo'limlarni ochish uchun torting yoki bosing" : "Secret Umbrella — Click or pull to open"}
      >
        
        {/* Animated Fairytale Umbrella Icon Container */}
        <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
          
          {/* Glowing Ambient Halo */}
          <div className="absolute -inset-1 rounded-full bg-amber-300/40 blur-xs opacity-80 group-hover:opacity-100 transition-opacity" />

          {/* Continuously Swaying & Floating Umbrella Character */}
          <motion.div
            animate={isOpen ? { rotate: 0, scale: 1.05 } : { 
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
            
            {/* Top Spire / Tip */}
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-t-full border border-pine-900 -mb-0.5 z-20 shadow-xs" />

            {/* Dynamic Morphing Umbrella Canopy (Closed vs Open) */}
            <div className="relative flex items-center justify-center">
              <AnimatePresence mode="wait">
                {!isOpen ? (
                  /* CLOSED / FOLDED SLENDER UMBRELLA CANOPY */
                  <motion.svg
                    key="closed-umbrella"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.22, type: 'spring' }}
                    width="26"
                    height="19"
                    viewBox="0 0 26 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Folded canopy in deep pine with gold highlights */}
                    <path
                      d="M13 1.5C10 6.5 8.5 12 8.5 17C10.5 16 15.5 16 17.5 17C17.5 12 16 6.5 13 1.5Z"
                      fill="#013E37"
                      stroke="#012621"
                      strokeWidth="1.5"
                    />
                    {/* Canopy folds and stars */}
                    <path d="M13 1.5V16" stroke="#FFEFB3" strokeWidth="1.2" strokeLinecap="round" />
                    <circle cx="13" cy="7.5" r="1.3" fill="#F59E0B" />
                    <circle cx="13" cy="12.5" r="1" fill="#FFEFB3" />
                  </motion.svg>
                ) : (
                  /* OPEN / BLOSSOMED MAGICAL UMBRELLA DOME */
                  <motion.svg
                    key="open-umbrella"
                    initial={{ scale: 0.5, y: -3, opacity: 0 }}
                    animate={{ scale: 1.15, y: 0, opacity: 1 }}
                    exit={{ scale: 0.5, y: -3, opacity: 0 }}
                    transition={{ duration: 0.28, type: 'spring', damping: 14 }}
                    width="32"
                    height="19"
                    viewBox="0 0 32 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Wide blooming fairytale dome in dark pine */}
                    <path
                      d="M2 14.5C3 5.5 9 1.5 16 1.5C23 1.5 29 5.5 30 14.5C27 13 24 14.5 22 13C20 14.5 17 13 16 13.5C15 13 12 14.5 10 13C8 14.5 5 13 2 14.5Z"
                      fill="#013E37"
                      stroke="#012621"
                      strokeWidth="1.5"
                    />
                    {/* Arched ribs and starry spots */}
                    <path d="M16 1.5V13.5" stroke="#FFEFB3" strokeWidth="1" strokeLinecap="round" />
                    <path d="M16 1.5C13 5.5 10 9.5 10 13" stroke="#FFEFB3" strokeWidth="1" strokeLinecap="round" />
                    <path d="M16 1.5C19 5.5 22 9.5 22 13" stroke="#FFEFB3" strokeWidth="1" strokeLinecap="round" />
                    <circle cx="7" cy="9.5" r="1.2" fill="#F59E0B" />
                    <circle cx="16" cy="6.5" r="1.3" fill="#FFEFB3" />
                    <circle cx="25" cy="9.5" r="1.2" fill="#F59E0B" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>

            {/* Clearly Visible Classic Dark J-Hook Umbrella Handle (Tortiladigan qismi) */}
            <motion.div
              style={{ y: handleOffset }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 20 }}
              dragElastic={0.25}
              onDragStart={() => setIsPulling(true)}
              onDragEnd={(_, info) => {
                setIsPulling(false);
                if (info.offset.y > 8) {
                  handleToggle();
                }
              }}
              className="relative flex flex-col items-center -mt-1 cursor-grab active:cursor-grabbing"
            >
              {/* Dark Solid Metallic/Wooden J-Hook Handle SVG (Bold & Distinct in #013E37 / Gold) */}
              <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                {/* Central Shaft Line */}
                <line x1="9" y1="0" x2="9" y2="8" stroke="#013E37" strokeWidth="2.6" strokeLinecap="round" />
                {/* Inner Gold Highlight on Shaft */}
                <line x1="9" y1="1" x2="9" y2="6" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" />
                
                {/* Classic Umbrella Curved J-Hook Handle */}
                <path
                  d="M9 8C9 11.5 6.5 13.5 4 13.5C2 13.5 1 12 1 10C1 8.5 2 7.5 3 7.5"
                  stroke="#013E37"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Gold Highlight along the hook */}
                <path
                  d="M8.5 9C8.5 11 6.5 12.3 4.2 12.3"
                  stroke="#FFEFB3"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Handle Tip Knob */}
                <circle cx="3" cy="7.5" r="1.5" fill="#F59E0B" stroke="#013E37" strokeWidth="0.8" />
              </svg>
            </motion.div>

          </motion.div>

          {/* Mini Sparkle in Corner */}
          <Sparkles className="w-3 h-3 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
        </div>

        {/* Two-line Text Label: "Sirli Soyabon" (Hidden on mobile, visible on tablet/desktop) */}
        <div className="hidden md:flex flex-col text-left pr-1">
          <span className="text-[11px] sm:text-xs font-black leading-tight text-pine-950 flex items-center gap-1">
            <span>{locale === 'uz' ? "Sirli Soyabon" : "Secret Umbrella"}</span>
          </span>
          <span className="text-[9px] font-bold text-pine-700 leading-none">
            {isOpen 
              ? (locale === 'uz' ? "Ochiq ☂️" : "Open ☂️") 
              : (locale === 'uz' ? "Sehrli bo'limlar ☂️" : "Magic sections ☂️")}
          </span>
        </div>

      </motion.button>

      {/* Cascading Floating Dropdown Menu Panel (Opens below) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute left-0 sm:left-0 top-full mt-3 w-[calc(100vw-20px)] max-w-[340px] sm:w-84 bg-[#FFFDF5]/95 dark:bg-[#002621]/95 backdrop-blur-xl border-2 border-pine-800 dark:border-butter-300 rounded-3xl p-3.5 sm:p-5 shadow-2xl space-y-3 z-50 overflow-hidden max-h-[85vh] overflow-y-auto"
          >
            {/* Fairytale Background Ambient Glow */}
            <div className="absolute -top-12 -left-12 w-36 h-36 bg-amber-400/20 dark:bg-butter-300/10 rounded-full blur-2xl pointer-events-none" />

            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b border-butter-300/80 dark:border-pine-700/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-butter-200 dark:bg-pine-800 flex items-center justify-center text-lg border border-pine-800/30">
                  ☂️
                </div>
                <div>
                  <h4 className="text-sm font-black text-pine-900 dark:text-butter-200">
                    {locale === 'uz' ? "Sirli Soyabon — Bo'limlar" : "Secret Umbrella — Sections"}
                  </h4>
                  <p className="text-[10px] font-semibold text-pine-600 dark:text-butter-300/80">
                    {locale === 'uz' ? "Sehrli soyabon ostidagi sahifalar" : "Pages under the secret umbrella"}
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
                {locale === 'uz' ? "Sirli Soyabon" : "Secret Umbrella"}
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
