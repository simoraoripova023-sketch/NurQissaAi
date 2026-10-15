'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Heart, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Star, 
  Moon, 
  Compass, 
  ShieldCheck, 
  Sun,
  Flame,
  Award,
  Gem,
  Gift
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';

interface VirtueItem {
  id: string;
  arabic: string;
  arabicMeaning: string;
  titleUz: string;
  titleEn: string;
  descUz: string;
  descEn: string;
  pedagogicalUz: string;
  pedagogicalEn: string;
  storyExampleUz: string;
  storyExampleEn: string;
  colorTheme: {
    gradient: string;
    border: string;
    hoverBorder: string;
    badgeBg: string;
    badgeText: string;
    iconBg: string;
    iconGlow: string;
    tagBg: string;
    tagText: string;
  };
  iconType: 'patience' | 'gratitude' | 'generosity' | 'honesty' | 'respect' | 'courage';
}

export default function VirtuesSection() {
  const { locale } = useAppStore();
  const t = translations[locale];
  const [activeVirtue, setActiveVirtue] = useState<string | null>(null);

  const virtues: VirtueItem[] = [
    {
      id: 'patience',
      arabic: 'الصَّبْرُ',
      arabicMeaning: 'As-Sabr',
      titleUz: 'Sabr-toqat va bosiqlik',
      titleEn: 'Patience & Composure (As-Sabr)',
      descUz: 'Kutishni, qiyinchilikda shoshilmaslikni va har bir ishning o\'z vaqt-soati borligini chuqur his qiladi.',
      descEn: 'Teaches children the wisdom of waiting calmly, emotional composure, and steadfast perseverance.',
      pedagogicalUz: 'Shoshqaloqlik o\'rniga vazminlik bilan to\'g\'ri qaror chiqarish',
      pedagogicalEn: 'Replaces impatience with mindful, thoughtful resilience',
      storyExampleUz: '«Yusufjonning shoshilmagan niholi»',
      storyExampleEn: '“Yusuf and the Patient Sprout”',
      colorTheme: {
        gradient: 'from-amber-500/[0.08] via-orange-500/[0.04] to-transparent',
        border: 'border-amber-300/40 dark:border-amber-500/30',
        hoverBorder: 'hover:border-amber-500 dark:hover:border-amber-400',
        badgeBg: 'bg-amber-100/90 dark:bg-amber-950/60',
        badgeText: 'text-amber-800 dark:text-amber-300',
        iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600',
        iconGlow: 'shadow-[0_0_24px_rgba(245,158,11,0.45)]',
        tagBg: 'bg-amber-50 dark:bg-amber-950/40',
        tagText: 'text-amber-900 dark:text-amber-200',
      },
      iconType: 'patience',
    },
    {
      id: 'gratitude',
      arabic: 'الشُّكْرُ',
      arabicMeaning: 'Ash-Shukr',
      titleUz: 'Shukronalik va qadriga yetish',
      titleEn: 'Gratitude & Contentment (Ash-Shukr)',
      descUz: 'Har bir ne\'mat uchun "Alhamdulillah" deb quvonish, boriga minnatdor bo\'lish va qanoat tuyg\'usini o\'rganadi.',
      descEn: 'Instills joy in saying "Alhamdulillah", cherishing daily blessings, and cultivating a contented heart.',
      pedagogicalUz: 'Nolish o\'rniga qo\'lidagi bor imkoniyatlardan quvonish',
      pedagogicalEn: 'Transforming complaints into thankful appreciation',
      storyExampleUz: '«Oydin kechadagi minnatdor yulduzcha»',
      storyExampleEn: '“The Grateful Star in the Crescent Sky”',
      colorTheme: {
        gradient: 'from-emerald-500/[0.08] via-teal-500/[0.04] to-transparent',
        border: 'border-emerald-300/40 dark:border-emerald-500/30',
        hoverBorder: 'hover:border-emerald-500 dark:hover:border-emerald-400',
        badgeBg: 'bg-emerald-100/90 dark:bg-emerald-950/60',
        badgeText: 'text-emerald-800 dark:text-emerald-300',
        iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-600',
        iconGlow: 'shadow-[0_0_24px_rgba(16,185,129,0.45)]',
        tagBg: 'bg-emerald-50 dark:bg-emerald-950/40',
        tagText: 'text-emerald-900 dark:text-emerald-200',
      },
      iconType: 'gratitude',
    },
    {
      id: 'generosity',
      arabic: 'السَّخَاءُ',
      arabicMeaning: "As-Sakha'",
      titleUz: 'Saxovat va xolis hadya',
      titleEn: "Generosity & Sincere Giving (As-Sakha')",
      descUz: 'O\'z o\'yinchoqlari, shirinliklari va mehrini do\'stlari bilan quvonch ila bo\'lishish baxtini his etadi.',
      descEn: 'Discovers the unmatched warmth of sharing toys, treats, and sincere kindness with others.',
      pedagogicalUz: 'Baxillikdan saqlanib, saxovatdan qalb xotirjamligini topish',
      pedagogicalEn: 'Overcoming possessiveness to experience the joy of sharing',
      storyExampleUz: '«Saxovatli anhor bo\'yidagi bolalar»',
      storyExampleEn: '“The Generous Children by the Flowing Brook”',
      colorTheme: {
        gradient: 'from-sky-500/[0.08] via-indigo-500/[0.04] to-transparent',
        border: 'border-sky-300/40 dark:border-sky-500/30',
        hoverBorder: 'hover:border-sky-500 dark:hover:border-sky-400',
        badgeBg: 'bg-sky-100/90 dark:bg-sky-950/60',
        badgeText: 'text-sky-800 dark:text-sky-300',
        iconBg: 'bg-gradient-to-br from-sky-400 to-indigo-600',
        iconGlow: 'shadow-[0_0_24px_rgba(14,165,233,0.45)]',
        tagBg: 'bg-sky-50 dark:bg-sky-950/40',
        tagText: 'text-sky-900 dark:text-sky-200',
      },
      iconType: 'generosity',
    },
    {
      id: 'honesty',
      arabic: 'الصِّدْقُ',
      arabicMeaning: 'As-Sidq',
      titleUz: 'Rostgo\'ylik va halollik',
      titleEn: 'Honesty & Pure Integrity (As-Sidq)',
      descUz: 'Har qanday vaziyatda, hatto qiyin bo\'lsa ham haqiqatni aytish jasorati va vijdoni pok bo\'lish huzuri.',
      descEn: 'Inspires moral bravery to speak the truth with sincerity, fostering honesty and a clear conscience.',
      pedagogicalUz: 'Yolg\'on va aldovdan qochib, omonatdor va ishonchli bo\'lish',
      pedagogicalEn: 'Building trustworthiness and fearless integrity',
      storyExampleUz: '«Haqiqat so\'zlagan jajji yo\'lovchi»',
      storyExampleEn: '“The Little Traveler Who Spoke the Truth”',
      colorTheme: {
        gradient: 'from-purple-500/[0.08] via-violet-500/[0.04] to-transparent',
        border: 'border-purple-300/40 dark:border-purple-500/30',
        hoverBorder: 'hover:border-purple-500 dark:hover:border-purple-400',
        badgeBg: 'bg-purple-100/90 dark:bg-purple-950/60',
        badgeText: 'text-purple-800 dark:text-purple-300',
        iconBg: 'bg-gradient-to-br from-purple-400 to-indigo-600',
        iconGlow: 'shadow-[0_0_24px_rgba(168,85,247,0.45)]',
        tagBg: 'bg-purple-50 dark:bg-purple-950/40',
        tagText: 'text-purple-900 dark:text-purple-200',
      },
      iconType: 'honesty',
    },
    {
      id: 'respect',
      arabic: 'بِرُّ الوَالِدَيْنِ',
      arabicMeaning: "Birr al-Walidayn",
      titleUz: 'Ota-onani e\'zozlash',
      titleEn: 'Honoring & Loving Parents',
      descUz: 'Ota-onaga shirin so\'z aytish, ularning duosini olish va oiladagi mehr rishtalarini mustahkamlash odobi.',
      descEn: 'Emphasizes speaking gently to parents, cherishing their blessings, and deepening filial devotion.',
      pedagogicalUz: 'Kattalarga hurmat, muloyim so\'zlashish va minnatdorlik',
      pedagogicalEn: 'Gentle speech, honoring parents, and familial respect',
      storyExampleUz: '«Onajonimning jannat ifori»',
      storyExampleEn: '“Mother’s Gentle Blessing and Love”',
      colorTheme: {
        gradient: 'from-rose-500/[0.08] via-pink-500/[0.04] to-transparent',
        border: 'border-rose-300/40 dark:border-rose-500/30',
        hoverBorder: 'hover:border-rose-500 dark:hover:border-rose-400',
        badgeBg: 'bg-rose-100/90 dark:bg-rose-950/60',
        badgeText: 'text-rose-800 dark:text-rose-300',
        iconBg: 'bg-gradient-to-br from-rose-400 to-red-600',
        iconGlow: 'shadow-[0_0_24px_rgba(244,63,94,0.45)]',
        tagBg: 'bg-rose-50 dark:bg-rose-950/40',
        tagText: 'text-rose-900 dark:text-rose-200',
      },
      iconType: 'respect',
    },
    {
      id: 'courage',
      arabic: 'الشَّجَاعَةُ',
      arabicMeaning: "Ash-Shaja'ah",
      titleUz: 'Jasorat va ezgu intilish',
      titleEn: "Courage & Noble Purpose (Ash-Shaja'ah)",
      descUz: 'Qo\'rquvni yaxshilik bilan yengish, nochorlarga himoyachi bo\'lish va ezgu maqsadlar yo\'lida mardlik.',
      descEn: 'Empowers children to overcome fears for goodness, protect the vulnerable, and act with noble bravery.',
      pedagogicalUz: 'Ikkilanish va qo\'rquvni yengib, mustaqil va dadil qadam tashlash',
      pedagogicalEn: 'Transforming timidness into courageous and kind leadership',
      storyExampleUz: '«Kichik qalbdagi buyuk jasorat»',
      storyExampleEn: '“The Brave Little Lion’s Kindness”',
      colorTheme: {
        gradient: 'from-amber-600/[0.08] via-yellow-500/[0.04] to-transparent',
        border: 'border-yellow-300/40 dark:border-yellow-500/30',
        hoverBorder: 'hover:border-yellow-500 dark:hover:border-yellow-400',
        badgeBg: 'bg-yellow-100/90 dark:bg-yellow-950/60',
        badgeText: 'text-yellow-800 dark:text-yellow-300',
        iconBg: 'bg-gradient-to-br from-amber-500 to-yellow-600',
        iconGlow: 'shadow-[0_0_24px_rgba(234,179,8,0.45)]',
        tagBg: 'bg-yellow-50 dark:bg-yellow-950/40',
        tagText: 'text-yellow-900 dark:text-yellow-200',
      },
      iconType: 'courage',
    },
  ];

  // Custom Illuminated Emblem Visualizer
  const renderEmblem = (type: VirtueItem['iconType'], iconBg: string, iconGlow: string) => {
    return (
      <div className={`relative w-14 h-14 rounded-2xl ${iconBg} ${iconGlow} flex items-center justify-center p-2.5 text-white shadow-lg transition-transform duration-300 group-hover:scale-108 group-hover:rotate-1`}>
        {/* Subtle decorative inner ring */}
        <div className="absolute inset-1 rounded-xl border border-white/30 pointer-events-none" />
        
        {type === 'patience' && (
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 drop-shadow-sm" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 22h14M5 2h14" />
            <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
            <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
            <circle cx="12" cy="17" r="1" fill="currentColor" />
            <circle cx="12" cy="7" r="1" fill="currentColor" />
          </svg>
        )}

        {type === 'gratitude' && (
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 drop-shadow-sm" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {/* Illuminated hands in prayer & crescent light */}
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5" />
            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-5.7-2.4L3.8 17a2 2 0 0 1 3-2.6L8 16" />
            <path d="M12 2v3M19 4l-2 2M5 4l2 2" strokeWidth="1.5" />
          </svg>
        )}

        {type === 'generosity' && (
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 drop-shadow-sm" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 12 20 22 4 22 4 12" />
            <rect x="2" y="7" width="20" height="5" rx="1" />
            <line x1="12" y1="22" x2="12" y2="7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            <circle cx="12" cy="14" r="1.5" fill="currentColor" />
          </svg>
        )}

        {type === 'honesty' && (
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 drop-shadow-sm" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 19 8.5 16 22 8 22 5 8.5 12 2" />
            <line x1="5" y1="8.5" x2="19" y2="8.5" />
            <line x1="12" y1="2" x2="8" y2="22" />
            <line x1="12" y1="2" x2="16" y2="22" />
          </svg>
        )}

        {type === 'respect' && (
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 drop-shadow-sm" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <path d="M12 11c-1.5-2-4.5-.5-3.5 2 1 2.5 3.5 4.5 3.5 4.5s2.5-2 3.5-4.5c1-2.5-2-4-3.5-2z" fill="currentColor" fillOpacity="0.4" />
          </svg>
        )}

        {type === 'courage' && (
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 drop-shadow-sm" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8v8M8 12h8" strokeWidth="2" />
          </svg>
        )}
      </div>
    );
  };

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-[#FCFBF7] via-[#FFFDF5] to-[#F7F5EC] dark:from-[#001D19] dark:via-[#002621] dark:to-[#001714] relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative Enchanted Background Elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-b from-amber-200/25 via-emerald-200/15 to-transparent dark:from-emerald-500/10 dark:via-pine-700/10 rounded-full blur-3xl pointer-events-none -z-10" />
      
      {/* Subtle Islamic Arched Star Watermark */}
      <div className="absolute -top-12 right-0 w-96 h-96 opacity-[0.035] dark:opacity-[0.06] pointer-events-none -z-10">
        <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full text-pine-900 dark:text-butter-200">
          <polygon points="100,10 120,70 185,70 135,110 155,170 100,135 45,170 65,110 15,70 80,70" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          
          {/* Luminous Top Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-700/80 dark:border-emerald-500/60 text-emerald-950 dark:text-emerald-200 text-xs sm:text-sm font-extrabold shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="tracking-wide uppercase">
              {locale === 'uz' ? "Bolalar Qalbidagi Ma'naviy Poydevor" : "Spiritual & Moral Foundations"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 dark:bg-emerald-400" />
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-pine-900 dark:text-emerald-100 font-display tracking-tight leading-[1.2]">
            {locale === 'uz' ? (
              <>
                Singdiriladigan <span className="text-emerald-700 dark:text-emerald-400 underline decoration-emerald-400/60 decoration-wavy decoration-2">Go&apos;zal Fazilatlar</span>
              </>
            ) : (
              <>
                Core Virtues We <span className="text-emerald-700 dark:text-emerald-400 underline decoration-emerald-400/60 decoration-wavy decoration-2">Gently Nurture</span>
              </>
            )}
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-pine-800/80 dark:text-emerald-200/85 font-medium leading-relaxed max-w-2xl mx-auto">
            {locale === 'uz'
              ? "Quruq tanbeh yoki zerikarli nasihatlarsiz — har bir ertak bolangizni mehr, sabr va ezgulik sari qiziqarli sarguzashtlar orqali yetaklaydi."
              : "No dry preaching or pressure — each tale gently embeds patience, gratitude, and moral brilliance through captivating adventures."}
          </p>
        </div>

        {/* 6 Virtues Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {virtues.map((item) => {
            const isUz = locale === 'uz';
            const title = isUz ? item.titleUz : item.titleEn;
            const desc = isUz ? item.descUz : item.descEn;
            const pedagogical = isUz ? item.pedagogicalUz : item.pedagogicalEn;
            const storyExample = isUz ? item.storyExampleUz : item.storyExampleEn;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveVirtue(item.id)}
                onMouseLeave={() => setActiveVirtue(null)}
                className={`group relative rounded-3xl p-6 sm:p-7 bg-white/95 dark:bg-[#012A25]/90 backdrop-blur-md border ${item.colorTheme.border} ${item.colorTheme.hoverBorder} shadow-[0_10px_30px_rgba(0,38,33,0.04)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_45px_rgba(16,185,129,0.18)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden`}
              >
                {/* Subtle Card Ambient Glow */}
                <div className={`absolute -right-16 -top-16 w-44 h-44 rounded-full bg-gradient-to-br ${item.colorTheme.gradient} blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />
                
                {/* Top Row: Illuminated Emblem & Arabic Calligraphy Stamp */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    {renderEmblem(item.iconType, item.colorTheme.iconBg, item.colorTheme.iconGlow)}

                    {/* Arabic Honorific Badge */}
                    <div className="text-right">
                      <div className="inline-block px-3 py-1 rounded-xl bg-amber-50/80 dark:bg-pine-900/80 border border-amber-200/60 dark:border-amber-400/20 shadow-xs">
                        <span className="font-serif text-lg font-bold text-amber-900 dark:text-amber-200 tracking-wider block leading-tight">
                          {item.arabic}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-pine-600 dark:text-amber-400/80 block">
                          {item.arabicMeaning}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Virtue Title */}
                  <h3 className="text-xl font-black text-pine-900 dark:text-butter-100 font-display tracking-tight mb-2.5 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                    {title}
                  </h3>

                  {/* Core Description */}
                  <p className="text-sm text-pine-800/80 dark:text-butter-100/75 leading-relaxed mb-4">
                    {desc}
                  </p>
                </div>

                {/* Bottom Section: Pedagogical Insight & Story Tag */}
                <div className="pt-4 mt-2 border-t border-pine-900/10 dark:border-butter-200/10 space-y-2.5">
                  
                  {/* Pedagogical Takeaway Pill */}
                  <div className={`p-2.5 rounded-2xl ${item.colorTheme.tagBg} border border-dashed border-amber-300/50 dark:border-amber-500/30 flex items-start gap-2 text-xs font-medium ${item.colorTheme.tagText}`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <span>
                      <strong className="font-bold">{isUz ? "Bola o'rganadi: " : "Child gains: "}</strong>
                      {pedagogical}
                    </span>
                  </div>

                  {/* Story Connection Pill */}
                  <div className="flex items-center justify-between text-xs text-pine-700 dark:text-butter-200/80 pt-1">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[11px] opacity-90">
                      <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>{isUz ? "Ertak namunasi:" : "Story theme:"}</span>
                    </span>
                    <span className="font-storybook text-sm text-pine-900 dark:text-butter-300 font-bold truncate max-w-[170px]">
                      {storyExample}
                    </span>
                  </div>
                </div>

                {/* Subtle Interactive Shimmer Border on Hover */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>

        {/* Master Pedagogical Philosophy & Interactive CTA Banner */}
        <div className="mt-16 sm:mt-20 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-pine-950 via-pine-900 to-pine-950 border-2 border-butter-500/40 text-butter-100 relative overflow-hidden shadow-book-lg">
          
          {/* Subtle Glowing Moons & Stars in Background */}
          <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
            <Moon className="w-72 h-72 text-butter-300" />
          </div>
          <div className="absolute top-6 left-8 opacity-20 pointer-events-none animate-pulse">
            <Sparkles className="w-12 h-12 text-butter-400" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Quote and Wisdom Text */}
            <div className="space-y-3.5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-butter-200/15 border border-butter-400/30 text-butter-200 text-xs font-bold uppercase tracking-widest">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>{locale === 'uz' ? "NurQissa Tarbiyaviy Falsafasi" : "NurQissa Pedagogical Creed"}</span>
              </div>

              <p className="text-lg sm:text-2xl font-serif italic text-butter-100 font-display leading-snug">
                {locale === 'uz'
                  ? "«Farzandingizga go‘zal xulq va sabrni mehr bilan o‘rgating — shunda ular kelajakda butun dunyoga nur taratadi.»"
                  : "“Teach your child noble manners and beautiful character with love — and they will illuminate the world wherever they walk.”"}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-4 text-xs sm:text-sm text-butter-300/80 font-medium">
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {locale === 'uz' ? "Hadisi shariflar hikmati" : "Prophetic wisdom"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {locale === 'uz' ? "Psixologik xavfsiz mazmun" : "Child-safe storytelling"}
                </span>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="shrink-0 w-full md:w-auto text-center">
              <Link
                href="/create"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-butter-200 hover:bg-butter-300 text-pine-900 font-black text-sm sm:text-base border-2 border-pine-800 shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-pine-900" />
                <span>{locale === 'uz' ? "Shu Fazilatlar Bilan Ertak Yaratish" : "Create Story With These Virtues"}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-pine-900" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
