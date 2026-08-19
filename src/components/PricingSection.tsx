'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, BookOpen, Crown, Printer, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';

export default function PricingSection() {
  const { locale, setIsOrderModalOpen } = useAppStore();
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
      name: locale === 'uz' ? "Nur Pro (Oylik)" : "Nur Pro (Monthly)",
      price: locale === 'uz' ? "49,000" : "4.99",
      currency: locale === 'uz' ? "so'm" : "$",
      period: locale === 'uz' ? "/oy" : "/mo",
      description: locale === 'uz' ? "Har oqshom yangi ertak eshituvchi oilalar uchun" : "For families reading bedtime stories every night",
      popular: true,
      buttonText: locale === 'uz' ? "Pro obunani faollashtirish" : "Get Pro Access",
      buttonLink: "/create",
      features: [
        locale === 'uz' ? "Cheksiz ertaklar yaratish" : "Unlimited AI bedtime stories",
        locale === 'uz' ? "Ovozli ertakchi (Audio TTS)" : "Full Audio Narration (TTS)",
        locale === 'uz' ? "Yuqori sifatli PDF yuklab olish" : "High-Res printable PDF downloads",
        locale === 'uz' ? "Barcha qadriyatlar va janrlar" : "All virtue themes & adventure settings",
        locale === 'uz' ? "Shaxsiy raqamli kutubxona" : "Personal family cloud library",
      ],
    },
    {
      name: locale === 'uz' ? "Qattiq Muqovali Kitob" : "Hardcover Print",
      price: locale === 'uz' ? "129,000" : "14.99",
      currency: locale === 'uz' ? "so'm" : "$",
      period: locale === 'uz' ? "/dona" : "/book",
      description: locale === 'uz' ? "Farzandingiz qo'lida ushlab o'qiydigan haqiqiy sovg'a" : "A physical keepsake hardcover storybook",
      popular: false,
      buttonText: locale === 'uz' ? "Kitob buyurtma qilish" : "Order Physical Book",
      isOrderModal: true,
      features: [
        locale === 'uz' ? "Qalin yaltiroq yoki mat qattiq muqova" : "Premium glossy or matte hardcover",
        locale === 'uz' ? "Zich matbaalik porloq sahifalar" : "Thick premium art paper pages",
        locale === 'uz' ? "Farzandingiz surati va ismi muqovada" : "Child's photo & name on front cover",
        locale === 'uz' ? "O'zbekiston bo'ylab bepul yetkazish" : "Free domestic shipping",
        locale === 'uz' ? "Esdalik sovg'a qutisi" : "Gift box packaging included",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-white dark:bg-[#002621] relative overflow-hidden border-t border-amber-100 dark:border-emerald-800 transition-colors duration-300">
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
                  ? 'bg-gradient-to-b from-[#1E1B4B] to-[#141238] text-white shadow-2xl scale-105 border-2 border-amber-400 z-10'
                  : 'bg-[#FFFDF5] dark:bg-[#01342e] text-slate-900 dark:text-slate-100 border border-amber-200/80 dark:border-emerald-700/60 shadow-md hover:shadow-xl'
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
                  <h3 className={`text-xl font-bold font-display ${plan.popular ? 'text-amber-300' : 'text-[#1E1B4B] dark:text-amber-200'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs mt-1 ${plan.popular ? 'text-slate-300' : 'text-slate-600 dark:text-emerald-100'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-4xl font-extrabold font-display ${plan.popular ? 'text-white' : 'text-[#1E1B4B] dark:text-amber-100'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm font-semibold ${plan.popular ? 'text-amber-300' : 'text-slate-500 dark:text-emerald-300'}`}>
                    {plan.currency} {plan.period}
                  </span>
                </div>

                <div className={`space-y-3 pt-6 border-t ${plan.popular ? 'border-indigo-800' : 'border-amber-100 dark:border-emerald-800'} mb-8`}>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        plan.popular ? 'bg-amber-400/20 text-amber-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className={plan.popular ? 'text-slate-200' : 'text-slate-700 dark:text-emerald-100'}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {plan.isOrderModal ? (
                  <button
                    onClick={() => setIsOrderModalOpen(true)}
                    className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{plan.buttonText}</span>
                  </button>
                ) : (
                  <Link
                    href={plan.buttonLink || "/create"}
                    className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/25'
                        : 'bg-white dark:bg-emerald-950 border-2 border-amber-300 dark:border-emerald-700 text-amber-900 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-emerald-900 shadow-sm'
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

      </div>
    </section>
  );
}
