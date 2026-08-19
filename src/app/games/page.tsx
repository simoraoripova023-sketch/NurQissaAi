'use client';

import React, { useState } from 'react';
import StoryPuzzleGame from '@/components/StoryPuzzleGame';
import MontessoriLearningGames from '@/components/MontessoriLearningGames';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Trophy, Star, Gamepad2, Brain } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function GamesPage() {
  const { locale, nurCoins } = useAppStore();
  const isUz = locale === 'uz';

  const [gameCategory, setGameCategory] = useState<'montessori' | 'puzzle'>('montessori');

  return (
    <div className="min-h-screen bg-[#FFFDF5] dark:bg-[#002621] py-8 sm:py-12 pb-24 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb & Coins */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 dark:bg-pine-900/80 border border-slate-200 dark:border-pine-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-butter-100 dark:hover:bg-pine-800 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isUz ? "Bosh sahifaga qaytish" : "Back to Home"}</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-100 dark:bg-pine-900 border border-amber-300 dark:border-pine-700 text-xs font-black text-amber-900 dark:text-amber-200 shadow-sm">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{nurCoins} {isUz ? "Nur tangasi" : "Coins"}</span>
            </div>

            <Link
              href="/rewards"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 text-white text-xs font-black shadow-md hover:scale-105 transition-all"
            >
              <span>🏆 {isUz ? "Haftalik Mukofotlar" : "Weekly Awards"}</span>
            </Link>
          </div>
        </div>

        {/* Top Hub Switcher: Montessori Games vs Story Puzzle & Labyrinth */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-3xl bg-slate-200/80 dark:bg-pine-900/90 border border-slate-300 dark:border-pine-700 shadow-inner">
            <button
              onClick={() => setGameCategory('montessori')}
              className={`px-5 sm:px-8 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
                gameCategory === 'montessori'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg scale-[1.02]'
                  : 'text-slate-700 dark:text-slate-300 hover:text-pine-900'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>🌟 {isUz ? "Montessori Zukko O'yinlar (Poklik, Hayvonlar, Detektiv)" : "Montessori Kids Games"}</span>
            </button>
            <button
              onClick={() => setGameCategory('puzzle')}
              className={`px-5 sm:px-8 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
                gameCategory === 'puzzle'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-[1.02]'
                  : 'text-slate-700 dark:text-slate-300 hover:text-pine-900'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>🧩 {isUz ? "Hikmatli Mozaika & Labirint" : "Story Puzzle & Maze"}</span>
            </button>
          </div>
        </div>

        {/* Render Selected Game Hub */}
        {gameCategory === 'montessori' ? (
          <MontessoriLearningGames />
        ) : (
          <StoryPuzzleGame />
        )}

      </div>
    </div>
  );
}
