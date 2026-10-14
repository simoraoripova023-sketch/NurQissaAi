'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, BookOpen, Crown, Printer, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';

export default function PricingSection() {
  const { locale, setIsOrderModalOpen, setIsPricingModalOpen } = useAppStore();
  const t = translations[locale];

  const plans = [
    {
      name: locale === 'uz' ? "Bepul Sinov" : "Free Trial",
      price: "0",
      currency: locale === 'uz' ? "so'm" : "$",
      period: locale === 'uz' ? "abadiy" : "forever",
      description: locale === 'uz' ? "NurQissa mo'jizasini sinab ko'rish uchun" : "Explore the magic of NurQissa",
      popular: false,
      buttonText: locale === 'uz' ? "Bepul boshlash" : "Start Free",
      buttonLink: "/create",
      features: [
        locale === 'uz' ? "2 ta to'liq shaxsiylashtirilgan ertak" : "2 full personalized storybooks",
        locale === 'uz' ? "8 sahifali rang-barang illyustratsiya" : "8 illustrated story pages",
        locale === 'uz' ? "Ertak xotimasi va ota-ona suhbati" : "Bedtime reflection & discussion",
        locale === 'uz' ? "Veb-brauzerda interaktiv o'qish" : "Interactive web reader",
      ],
    },
    {
      name: locale === 'uz' ? "«Nurli Oila» To'plami" : "Radiant Family Pack",
      price: locale === 'uz' ? "69 000" : "6.99",
      currency: locale === 'uz' ? "so'm" : "$",
      period: locale === 'uz' ? "/to'plam" : "/pack",
      description: locale === 'uz' ? "Oylik to'liq ertakxonlik va tarbiya uchun" : "For regular family bedtime reading & morals",
      popular: true,
      buttonText: locale === 'uz' ? "Paketni tanlash" : "Get Family Pack",
      isPricingModal: true,
      features: [
        locale === 'uz' ? "10 ta to'liq shaxsiy ertak" : "10 full personalized storybooks",
        locale === 'uz' ? "80 ta 3D Pixar uslubidagi rasmlar" : "80 OpenAI 3D Pixar illustrations",
        locale === 'uz' ? "Ovozli ertakchi (Audio TTS)" : "Full Audio Narration (TTS)",
        locale === 'uz' ? "Yuqori sifatli PDF yuklab olish" : "High-Res printable PDF downloads",
        locale === 'uz' ? "Barcha qadriyatlar va ibratlar" : "All virtue themes & moral stories",
      ],
    },
    {
      name: locale === 'uz' ? "«VIP Cheksiz Obuna»" : "VIP Unlimited",
      price: locale === 'uz' ? "99 000" : "9.99",
      currency: locale === 'uz' ? "so'm" : "$",
      period: locale === 'uz' ? "/oy" : "/mo",
      description: locale === 'uz' ? "Har oqshom yangi ertak va ustuvor navbat" : "Unlimited bedtime stories every month",
      popular: false,
      buttonText: locale === 'uz' ? "VIP obuna bo'lish" : "Get VIP Access",
      isPricingModal: true,
      features: [
        locale === 'uz' ? "Cheksiz ertaklar yaratish" : "Unlimited AI bedtime stories",
        locale === 'uz' ? "Barcha maxsus qahramonlar" : "All premium heroes & storylines",
        locale === 'uz' ? "Tezkor VIP generatsiya navbati" : "Fastest VIP generation queue",
        locale === 'uz' ? "Ovozli ertakchi + PDF yuklab olish" : "Audio TTS narration & PDF download",
        locale === 'uz' ? "Yangi o'yin va funksiyalarga birinchi kirish" : "Early access to all new features",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-white dark:bg-[#1B200B] relative overflow-hidden border-t border-amber-100 dark:border-pine-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-butter-200 text-pine-900 border border-pine-800 text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-pine-800" />
            <span>{t.pricing}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-pine-900 dark:text-butter-200 font-display">
            {t.pricingTitle}
          </h2>
          <p className="text-base sm:text-lg text-pine-700/80 dark:text-butter-100/80 font-medium">
            {t.pricingSub}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-b from-[#2B3113] to-[#1B200B] text-white shadow-2xl scale-105 border-2 border-amber-400 z-10'
                  : 'bg-[#FFFDF5] dark:bg-[#283013] text-slate-900 dark:text-slate-100 border border-amber-200/80 dark:border-pine-700/60 shadow-md hover:shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>{locale === 'uz' ? "Eng Mashhur Tanlov" : "Most Popular"}</span>
                </div>
              )}

              <div>
                <div className="mb-6">
                  <h3 className={`text-xl font-bold font-display ${plan.popular ? 'text-amber-300' : 'text-[#1E1B4B] dark:text-butter-200'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs mt-1 ${plan.popular ? 'text-slate-300' : 'text-slate-600 dark:text-butter-100/70'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-4xl font-extrabold font-display ${plan.popular ? 'text-white' : 'text-[#1E1B4B] dark:text-butter-100'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm font-semibold ${plan.popular ? 'text-amber-300' : 'text-slate-500 dark:text-butter-300'}`}>
                    {plan.currency} {plan.period}
                  </span>
                </div>

                <div className={`space-y-3 pt-6 border-t ${plan.popular ? 'border-pine-700' : 'border-amber-100 dark:border-pine-700'} mb-8`}>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        plan.popular ? 'bg-amber-400/20 text-amber-300' : 'bg-butter-200 dark:bg-pine-900 text-pine-900 dark:text-butter-200'
                      }`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className={plan.popular ? 'text-slate-200' : 'text-slate-700 dark:text-butter-100/90'}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {(plan as any).isPricingModal ? (
                  <button
                    onClick={() => setIsPricingModalOpen(true)}
                    className="w-full py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                  >
                    <Crown className="w-4 h-4" />
                    <span>{plan.buttonText}</span>
                  </button>
                ) : (
                  <Link
                    href={plan.buttonLink || "/create"}
                    className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/25'
                        : 'bg-white dark:bg-pine-900 border-2 border-amber-300 dark:border-pine-700 text-pine-900 dark:text-butter-200 hover:bg-amber-50 dark:hover:bg-pine-800 shadow-sm'
                    }`}
                  >
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

            </div>
          ))}
        </div>

        {/* Physical Hardcover Book Promo Banner */}
        <div className="mt-12 rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500/15 via-butter-400/20 to-orange-500/15 dark:from-pine-900/80 dark:to-pine-950/90 border-2 border-amber-400/50 dark:border-pine-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/30 text-pine-950 dark:text-butter-200 text-xs font-black uppercase tracking-wider">
              <span>🎁 {locale === 'uz' ? "Haqiqiy Qo'lda Ushlanadigan Sovg'a" : "Physical Keepsake"}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-pine-950 dark:text-butter-100">
              {locale === 'uz' ? "Qattiq Muqovali Shaxsiy Kitob — 129 000 so'm" : "Personalized Hardcover Book — 129,000 UZS"}
            </h3>
            <p className="text-xs sm:text-sm text-pine-800/80 dark:text-butter-200/80 max-w-2xl">
              {locale === 'uz'
                ? "Farzandingiz surati va ismi bilan chop etilgan yaltiroq qalin muqova, zich porloq sahifalar va O'zbekiston bo'ylab bepul yetkazib berish xizmati."
                : "A premium keepsake hardcover storybook printed with your child's photo and name, with free shipping across Uzbekistan."}
            </p>
          </div>

          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm shadow-md hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{locale === 'uz' ? "Kitob buyurtma qilish" : "Order Hardcover Book"}</span>
          </button>
        </div>

      </div>
    </section>
  );
}
