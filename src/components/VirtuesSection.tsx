'use client';

import React from 'react';
import { Heart, Sparkles, ShieldCheck, Sun, Moon, Star, Compass, Gift, Smile } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';

export default function VirtuesSection() {
  const { locale } = useAppStore();
  const t = translations[locale];

  const virtues = [
    {
      icon: "⏳",
      title: t.patience,
      desc: t.patienceDesc,
      bg: "from-amber-500/10 to-orange-500/10",
      border: "border-amber-200",
    },
    {
      icon: "🤲",
      title: t.gratitude,
      desc: t.gratitudeDesc,
      bg: "from-emerald-500/10 to-teal-500/10",
      border: "border-emerald-200",
    },
    {
      icon: "🎁",
      title: t.generosity,
      desc: t.generosityDesc,
      bg: "from-blue-500/10 to-indigo-500/10",
      border: "border-blue-200",
    },
    {
      icon: "💎",
      title: t.honesty,
      desc: t.honestyDesc,
      bg: "from-purple-500/10 to-pink-500/10",
      border: "border-purple-200",
    },
    {
      icon: "🏡",
      title: t.respect_parents,
      desc: t.respect_parentsDesc,
      bg: "from-rose-500/10 to-red-500/10",
      border: "border-rose-200",
    },
    {
      icon: "🦁",
      title: t.courage,
      desc: t.courageDesc,
      bg: "from-yellow-500/10 to-amber-500/10",
      border: "border-yellow-200",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#FFFDF5] dark:from-[#002621] dark:to-[#01342e] relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-butter-200 text-pine-900 border border-pine-800 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>{locale === 'uz' ? "Tarbiya & Qadriyatlar" : "Character & Faith"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-pine-900 dark:text-butter-200 font-display">
            {t.virtuesTitle}
          </h2>
          <p className="text-base sm:text-lg text-pine-700/80 dark:text-butter-100/80 font-medium">
            {t.virtuesSub}
          </p>
        </div>

        {/* Virtues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {virtues.map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl bg-gradient-to-br ${item.bg} bg-white/80 dark:bg-emerald-950/80 border ${item.border} dark:border-emerald-700/60 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1`}
            >
              <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-[#1E1B4B] dark:text-amber-200 mb-1.5 font-display">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Banner Quote Card */}
        <div className="mt-14 p-8 rounded-3xl bg-[#1E1B4B] dark:bg-emerald-950 border border-transparent dark:border-emerald-700/80 text-amber-100 relative overflow-hidden shadow-xl">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Moon className="w-64 h-64 text-amber-400" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-3">
            <Sparkles className="w-6 h-6 text-amber-400 mx-auto animate-pulse" />
            <p className="text-lg sm:text-xl font-medium italic text-amber-200 font-display">
              {locale === 'uz'
                ? "\"Farzandlaringizga go'zal odob va fazilatlarni mehr bilan o'rgating, shunda ular kelajakda butun jamiyatga nur taratadi.\""
                : "\"Teach your children noble manners and virtues with love, and they will grow to illuminate the entire world.\""}
            </p>
            <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
              NurQissa Pedagogik Falsafasi
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
