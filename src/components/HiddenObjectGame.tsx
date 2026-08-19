'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Moon, Check, Gift } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import confetti from 'canvas-confetti';

interface HiddenObjectGameProps {
  pageNumber: number;
  storyId: string;
}

export default function HiddenObjectGame({ pageNumber, storyId }: HiddenObjectGameProps) {
  const { locale, foundHiddenObjects, markHiddenObjectFound, addNurCoins } = useAppStore();
  const t = translations[locale];

  // Specific hidden object placement for page 1, 3, 5, 7
  const objectId = `${storyId}_p${pageNumber}_magic`;
  const isFound = foundHiddenObjects.includes(objectId);
  const [showCelebration, setShowCelebration] = useState(false);

  // Position based on page number
  const positions: Record<number, { top: string; left: string; icon: string; name_uz: string; name_en: string }> = {
    1: { top: '28%', left: '82%', icon: '⭐', name_uz: "Sehrli Yulduzcha", name_en: "Magic Star" },
    2: { top: '65%', left: '18%', icon: '🌙', name_uz: "Kumush Hilol", name_en: "Silver Crescent" },
    3: { top: '22%', left: '74%', icon: '🌟', name_uz: "Oltin Nurcha", name_en: "Golden Light" },
    4: { top: '78%', left: '35%', icon: '💎', name_uz: "Hikmat Billuri", name_en: "Wisdom Crystal" },
    5: { top: '35%', left: '20%', icon: '🎁', name_uz: "Saxovat Hadya", name_en: "Generosity Gift" },
    6: { top: '70%', left: '80%', icon: '🌸', name_uz: "Sehrli Atirgul", name_en: "Enchanted Rose" },
    7: { top: '40%', left: '85%', icon: '💖', name_uz: "Mehr Yuragi", name_en: "Heart of Love" },
    8: { top: '25%', left: '75%', icon: '✨', name_uz: "Shukr Nuri", name_en: "Light of Gratitude" },
  };

  const item = positions[pageNumber] || positions[1];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFound) {
      markHiddenObjectFound(objectId);
      setShowCelebration(true);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 },
      });
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  return (
    <>
      {/* Clickable Hidden Object on Illustration */}
      <motion.button
        type="button"
        onClick={handleClick}
        style={{ top: item.top, left: item.left }}
        whileHover={{ scale: 1.3, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        className={`absolute z-30 transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer transition-all duration-300 ${
          isFound
            ? 'bg-amber-400/90 text-white shadow-lg ring-4 ring-amber-300/60 scale-110'
            : 'bg-black/30 hover:bg-black/60 backdrop-blur-sm opacity-60 hover:opacity-100 animate-pulse'
        }`}
        title={isFound ? item.name_uz : t.spotHiddenObject}
      >
        <span className="text-xl sm:text-2xl drop-shadow-md select-none">{item.icon}</span>
        {!isFound && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>
        )}
      </motion.button>

      {/* Instant Celebratory Floating Pill */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-amber-500 to-emerald-600 text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
            <span>{t.hiddenObjectFound}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
