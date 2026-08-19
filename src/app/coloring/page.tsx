'use client';

import React from 'react';
import ColoringStudio from '@/components/ColoringStudio';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Star } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function ColoringPage() {
  const { locale, nurCoins } = useAppStore();
  const isUz = locale === 'uz';

  return (
    <div className="min-h-screen bg-[#FFFDF5] dark:bg-[#002621] py-10 pb-20 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
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
              href="/games"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 text-white text-xs font-black shadow-md hover:scale-105 transition-all"
            >
              <span>🧩 {isUz ? "Mozaika & O'yinlar" : "Puzzle Games"}</span>
            </Link>
          </div>
        </div>

        {/* The Coloring Studio Component */}
        <ColoringStudio />

      </div>
    </div>
  );
}
