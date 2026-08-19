'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, Volume2, ArrowRight, Heart, Star } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { SAMPLE_STORIES } from '@/lib/sampleStories';

export default function StoryShowcase() {
  const { locale, toggleFavorite } = useAppStore();
  const t = translations[locale];

  return (
    <section className="py-20 bg-[#FFFDF5] dark:bg-[#002621] relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-butter-200 text-pine-900 border border-pine-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pine-800" />
              <span>{locale === 'uz' ? "Namunaviy Ertaklar" : "Featured Stories"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-pine-900 dark:text-butter-200 font-display">
              {t.featuredStories}
            </h2>
            <p className="text-base text-pine-700/80 dark:text-butter-100/80 max-w-xl font-medium">
              {locale === 'uz'
                ? "Har bir ertak bolajonlarga ezgu qadriyatlarni singdirish bilan birga, ularning tasavvur olamini kengaytiradi."
                : "Every story nurtures noble moral virtues while expanding your child's imagination."}
            </p>
          </div>

          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-pine-800 hover:bg-pine-700 text-butter-200 border-2 border-butter-200 font-extrabold text-sm shadow-md hover:shadow-lg transition-all self-start md:self-auto"
          >
            <span>{t.ctaCreate}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {SAMPLE_STORIES.map((story) => {
            const title = locale === 'uz' ? story.title_uz : story.title_en;
            const prologue = locale === 'uz' ? story.prologue_uz : story.prologue_en;
            const lesson = locale === 'uz' ? story.reflection.todays_lesson_uz : story.reflection.todays_lesson_en;

            return (
              <div
                key={story.id}
                className="bg-white dark:bg-[#01342e] rounded-3xl overflow-hidden border border-amber-200/80 dark:border-emerald-700/60 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                {/* Cover Banner */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-900">
                  <img
                    src={story.cover_image_url}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B] via-[#1E1B4B]/30 to-transparent"></div>
                  
                  {/* Virtue & Age Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-400/90 text-[#1E1B4B] text-xs font-extrabold shadow-sm">
                      {story.child_profile.parent_goal === 'kindness'
                        ? (locale === 'uz' ? "✨ Iymon & Farishtalar" : "✨ Faith & Angels")
                        : story.child_profile.parent_goal === 'generosity'
                        ? (locale === 'uz' ? "✨ Saxovat & Ulashish" : "✨ Generosity")
                        : (locale === 'uz' ? "🌱 Sabr-toqat" : "🌱 Patience")}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-md text-slate-800 text-xs font-bold">
                      {story.child_profile.age} {locale === 'uz' ? "yosh" : "yo"}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFavorite(story.id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:text-rose-500 transition-colors shadow"
                    aria-label="Save Favorite"
                  >
                    <Heart className={`w-4 h-4 ${story.is_favorite ? 'text-rose-500 fill-rose-500' : ''}`} />
                  </button>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-extrabold font-display leading-tight mb-1">
                      {title}
                    </h3>
                    <p className="text-xs text-amber-200 font-medium line-clamp-1">
                      {story.child_profile.child_name} {locale === 'uz' ? "uchun maxsus ertak" : "personalized story"}
                    </p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600 dark:text-emerald-100 leading-relaxed line-clamp-2">
                      {prologue}
                    </p>

                    {/* Today's lesson preview */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-emerald-950/80 border border-amber-200/60 dark:border-emerald-700/60 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
                      <span className="text-lg leading-none">🌙</span>
                      <div>
                        <span className="font-bold text-amber-900 dark:text-amber-300 block mb-0.5">{t.todaysLesson}:</span>
                        <p className="line-clamp-2 text-slate-700 dark:text-emerald-200">{lesson}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-3">
                    <Link
                      href={`/story/${story.id}`}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{t.readStory}</span>
                    </Link>

                    <Link
                      href={`/story/${story.id}?audio=true`}
                      className="py-3 px-4 rounded-xl border border-amber-300 dark:border-emerald-700 bg-amber-50 dark:bg-emerald-900/60 hover:bg-amber-100 dark:hover:bg-emerald-800 text-amber-900 dark:text-amber-200 font-bold text-sm flex items-center gap-1.5 transition-all"
                      title={t.listenAudio}
                    >
                      <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                      <span className="hidden sm:inline">{t.listenAudio}</span>
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
