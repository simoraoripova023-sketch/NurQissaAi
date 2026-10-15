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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-emerald-400/25 via-emerald-600/20 to-teal-500/25 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 flex flex-col space-y-5 sm:space-y-6 lg:space-y-7 text-center lg:text-left justify-center">
            
            {/* Badges Container */}
            <div className="flex flex-col items-center lg:items-start gap-2.5 sm:gap-3">
              {/* Top Wisdom / Guiding Value Motto */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-600/60 text-emerald-950 dark:text-emerald-200 text-xs sm:text-sm font-medium backdrop-blur-sm shadow-xs">
                <span className="text-emerald-700 dark:text-emerald-400">📖</span>
                <span className="italic">
                  {locale === 'uz'
                    ? "«Farzand tarbiyasidagi eng yaxshi meros — uning qalbiga ekilgan go‘zal xulqdir»"
                    : "“The greatest gift in raising a child is the noble character planted in their heart.”"}
                </span>
              </div>

              {/* Top Pill Badge (Shifted down with comfortable margin) */}
              <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2 rounded-full bg-emerald-100/90 dark:bg-pine-900 border-2 border-emerald-800 dark:border-emerald-500 text-emerald-950 dark:text-emerald-100 text-xs sm:text-sm font-black shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 dark:text-emerald-300" />
                <span>{locale === 'uz' ? "NurQissa — Bolalar Qalbidagi Nur" : "NurQissa AI — Bedtime Story Engine"}</span>
              </div>
            </div>

            {/* Headline with extra breathing room */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-pine-900 dark:text-emerald-100 leading-[1.25] sm:leading-[1.2] font-display">
              <div className="block">{t.heroTitle}</div>
              <div className="mt-3 sm:mt-3.5 inline-block px-3.5 py-1.5 sm:px-4 sm:py-2 text-xl sm:text-3xl lg:text-4xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white rounded-xl sm:rounded-2xl border-2 border-emerald-400 shadow-md">
                {t.heroHighlight}
              </div>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-pine-800/80 dark:text-emerald-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              {t.heroSubtitle}
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
              <Link
                href="/create"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-sm sm:text-base border-2 border-emerald-400 shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200" />
                <span>{t.ctaCreate}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

              <Link
                href="/story/aqilli-bola-yusuf"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-7 sm:py-4 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-pine-900/80 dark:hover:bg-pine-800 border-2 border-emerald-700 dark:border-emerald-500 text-emerald-950 dark:text-emerald-100 font-black text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800 dark:text-emerald-300" />
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
                <span className="font-extrabold text-pine-900 dark:text-emerald-200 text-xs sm:text-sm">5.0</span>
                <span className="text-emerald-700 dark:text-emerald-400 text-xs font-bold">(1,200+ oila)</span>
              </div>
              <span className="hidden sm:inline text-emerald-300 dark:text-emerald-700">•</span>
              <p className="text-xs text-pine-700/90 dark:text-emerald-200/90 font-medium">
                {locale === 'uz' ? "Ota-onalar va bolajonlar mehrini qozongan" : "Loved by parents & young heroes"}
              </p>
            </div>

            {/* Trust Highlights / Features */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 sm:gap-x-6 gap-y-2 max-w-xl mx-auto lg:mx-0 border-t border-emerald-200 dark:border-emerald-800/80 text-xs sm:text-sm font-bold text-pine-900 dark:text-emerald-200">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{locale === 'uz' ? "Bolangiz qiyofasida" : "Child photo likeness"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{locale === 'uz' ? "Jonli mayin ovozda" : "Audio narration"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
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
