'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, BookOpen, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import HeroIslamicBook from '@/components/HeroIslamicBook';

export default function LandingHero() {
  const { locale } = useAppStore();
  const t = translations[locale];

  return (
    <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-24 lg:pt-12 overflow-hidden islamic-pattern">
      {/* Background Soft Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-amber-200/40 via-emerald-100/30 to-indigo-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 flex flex-col space-y-5 sm:space-y-6 lg:space-y-7 text-center lg:text-left justify-center">
            
            {/* Badges Container */}
            <div className="flex flex-col items-center lg:items-start gap-2.5 sm:gap-3">
              {/* Top Wisdom / Guiding Value Motto */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/70 dark:bg-pine-900/60 border border-amber-300/80 dark:border-amber-400/30 text-pine-900 dark:text-amber-200 text-xs sm:text-sm font-medium backdrop-blur-sm shadow-xs">
                <span className="text-amber-600 dark:text-amber-400">📖</span>
                <span className="italic">
                  {locale === 'uz'
                    ? "«Farzand tarbiyasidagi eng yaxshi meros — uning qalbiga ekilgan go‘zal xulqdir»"
                    : "“The greatest gift in raising a child is the noble character planted in their heart.”"}
                </span>
              </div>

              {/* Top Pill Badge (Shifted down with comfortable margin) */}
              <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2 rounded-full bg-butter-200 border-2 border-pine-800 text-pine-900 text-xs sm:text-sm font-black shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-pine-800 animate-pulse" />
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pine-800" />
                <span>{locale === 'uz' ? "NurQissa — Bolalar Qalbidagi Nur" : "NurQissa AI — Bedtime Story Engine"}</span>
              </div>
            </div>

            {/* Headline with extra breathing room */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-pine-900 dark:text-butter-200 leading-[1.25] sm:leading-[1.2] font-display">
              <div className="block">{t.heroTitle}</div>
              <div className="mt-3 sm:mt-3.5 inline-block px-3.5 py-1.5 sm:px-4 sm:py-2 text-xl sm:text-3xl lg:text-4xl bg-butter-200 text-pine-900 rounded-xl sm:rounded-2xl border-2 border-pine-800 shadow-sm">
                {t.heroHighlight}
              </div>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-pine-800/80 dark:text-butter-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              {t.heroSubtitle}
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
              <Link
                href="/create"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-pine-800 hover:bg-pine-700 text-butter-200 font-extrabold text-sm sm:text-base border-2 border-butter-200 shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-butter-200" />
                <span>{t.ctaCreate}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

              <Link
                href="/story/aqilli-bola-yusuf"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-7 sm:py-4 rounded-full bg-butter-200 hover:bg-butter-300 border-2 border-pine-800 text-pine-900 font-black text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-pine-800" />
                <span>{t.ctaDemo}</span>
              </Link>
            </div>

            {/* Social Proof & Rating (Clean Star Rating & Trust Text) */}
            <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-extrabold text-pine-900 dark:text-butter-200 text-xs sm:text-sm">5.0</span>
                <span className="text-pine-600 dark:text-butter-300 text-xs font-bold">(1,200+ oila)</span>
              </div>
              <span className="hidden sm:inline text-butter-400 dark:text-pine-600">•</span>
              <p className="text-xs text-pine-700/90 dark:text-butter-200/90 font-medium">
                {locale === 'uz' ? "Ota-onalar va bolajonlar mehrini qozongan" : "Loved by parents & young heroes"}
              </p>
            </div>

            {/* Trust Highlights / Features */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 sm:gap-x-6 gap-y-2 max-w-xl mx-auto lg:mx-0 border-t border-butter-300/80 dark:border-pine-700/80 text-xs sm:text-sm font-bold text-pine-800 dark:text-butter-200">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pine-800 dark:text-butter-300 shrink-0" />
                <span>{locale === 'uz' ? "Bolangiz qiyofasida" : "Child photo likeness"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pine-800 dark:text-butter-300 shrink-0" />
                <span>{locale === 'uz' ? "Jonli mayin ovozda" : "Audio narration"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pine-800 dark:text-butter-300 shrink-0" />
                <span>{locale === 'uz' ? "Hikmatli suhbat va ezgu niyatlar" : "Reflection & Dua"}</span>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Masterpiece 3D Single-Leaf Storybook */}
          <div className="lg:col-span-5 flex justify-center w-full mt-4 lg:mt-0">
            <HeroIslamicBook />
          </div>

        </div>
      </div>
    </section>
  );
}
