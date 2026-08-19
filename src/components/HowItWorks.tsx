'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Sparkles, BookOpenCheck, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';

export default function HowItWorks() {
  const { locale } = useAppStore();
  const t = translations[locale];

  const steps = [
    {
      stepNumber: "01",
      icon: Camera,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50 border-amber-200",
      title: t.step1Title,
      description: t.step1Desc,
      tag: locale === 'uz' ? "Surat & Ism" : "Photo & Profile",
    },
    {
      stepNumber: "02",
      icon: Sparkles,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-50 border-emerald-200",
      title: t.step2Title,
      description: t.step2Desc,
      tag: locale === 'uz' ? "NurQissa v0.2 AI" : "Generative AI",
    },
    {
      stepNumber: "03",
      icon: BookOpenCheck,
      iconColor: "text-indigo-500",
      bgColor: "bg-indigo-50 border-indigo-200",
      title: t.step3Title,
      description: t.step3Desc,
      tag: locale === 'uz' ? "Kitob & Audio" : "Interactive & Print",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-[#002621] relative overflow-hidden border-y border-amber-100 dark:border-emerald-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-butter-200 text-pine-900 border border-pine-800 text-xs font-bold uppercase tracking-wider">
            {locale === 'uz' ? "Oson va Qulay Jarayon" : "Simple 3-Step Process"}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-pine-900 dark:text-butter-200 font-display">
            {t.howItWorks}
          </h2>
          <p className="text-base sm:text-lg text-pine-700/80 dark:text-butter-100/80 font-medium">
            {t.howItWorksSub}
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative bg-[#FFFDF5] dark:bg-[#01342e] p-8 rounded-3xl border border-amber-200/70 dark:border-emerald-700/60 shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1.5"
              >
                {/* Step badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${step.bgColor} dark:bg-emerald-950 dark:border-emerald-700 border flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${step.iconColor}`} />
                  </div>
                  <span className="text-3xl font-black text-slate-300 dark:text-emerald-800/80 font-mono group-hover:text-amber-300 transition-colors">
                    {step.stepNumber}
                  </span>
                </div>

                <span className="inline-block px-2.5 py-1 rounded-md bg-amber-100/80 dark:bg-emerald-950 text-amber-900 dark:text-amber-300 border border-transparent dark:border-emerald-700/60 text-xs font-semibold mb-3">
                  {step.tag}
                </span>

                <h3 className="text-xl font-bold text-[#1E1B4B] dark:text-amber-200 mb-2 font-display">
                  {step.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-emerald-100 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/create"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-pine-800 hover:bg-pine-700 text-butter-200 border-2 border-butter-200 font-extrabold text-base shadow-xl transition-all"
          >
            <span>{locale === 'uz' ? "Hoziroq ertak yaratib ko'rish" : "Try Creating a Story Now"}</span>
            <ArrowRight className="w-4 h-4 text-butter-200" />
          </Link>
        </div>

      </div>
    </section>
  );
}
