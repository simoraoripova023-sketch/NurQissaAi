'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Plus, Heart, Trash2, Sparkles, Volume2, 
  Search, ArrowRight, Printer, Star
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';

export default function LibraryPage() {
  const { locale, stories, toggleFavorite, removeStoryFromLibrary, setIsOrderModalOpen, setActiveStory } = useAppStore();
  const t = translations[locale];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);

  const filteredStories = stories.filter((story) => {
    const title = (locale === 'uz' ? story.title_uz : story.title_en).toLowerCase();
    const child = story.child_profile.child_name.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesQuery = title.includes(query) || child.includes(query);
    const matchesFav = filterFavorites ? story.is_favorite : true;
    return matchesQuery && matchesFav;
  });

  return (
    <div className="min-h-screen bg-[#FFFDF5] dark:bg-[#002621] islamic-pattern py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-butter-200 text-pine-900 text-xs font-black uppercase tracking-wider border border-pine-800">
              <Sparkles className="w-3.5 h-3.5 text-pine-800" />
              <span>{locale === 'uz' ? "Shaxsiy Tokcha" : "Personal Bookshelf"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-pine-900 dark:text-butter-200 font-display">
              {t.library}
            </h1>
            <p className="text-sm text-pine-700/80 dark:text-butter-200/80 font-medium">
              {locale === 'uz'
                ? "Farzandingiz uchun yaratilgan barcha sehrli va ibratli ertaklar to'plami"
                : "All personalized values-based bedtime storybooks created for your child"}
            </p>
          </div>

          <Link
            href="/create"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-pine-800 hover:bg-pine-700 text-butter-200 font-extrabold text-sm border-2 border-butter-200 shadow-md hover:shadow-lg transition-all self-start md:self-auto"
          >
            <Plus className="w-5 h-5" />
            <span>{t.createStory}</span>
          </Link>
        </div>

        {/* Filters Bar */}
        <div className="bg-white dark:bg-[#01342e] p-4 rounded-2xl border border-amber-200/80 dark:border-emerald-700/60 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 dark:text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'uz' ? "Ertak yoki bola ismini qidirish..." : "Search by story or child name..."}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-amber-200 dark:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/30 dark:bg-emerald-950/60 text-slate-800 dark:text-amber-100 placeholder:text-slate-400 dark:placeholder:text-emerald-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilterFavorites(!filterFavorites)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterFavorites
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-amber-50 dark:bg-emerald-950 text-slate-700 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-emerald-900 border border-amber-200 dark:border-emerald-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${filterFavorites ? 'fill-white' : ''}`} />
              <span>{locale === 'uz' ? "Sevimlilar" : "Favorites"}</span>
            </button>
            <span className="text-xs text-slate-500 dark:text-emerald-300 font-medium px-2">
              {filteredStories.length} {locale === 'uz' ? "ta kitob" : "books"}
            </span>
          </div>
        </div>

        {/* Books Grid */}
        {filteredStories.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#01342e] rounded-3xl border border-amber-200/80 dark:border-emerald-700/60 p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-emerald-950 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto text-2xl">
              📚
            </div>
            <h3 className="text-xl font-bold text-[#1E1B4B] dark:text-amber-200 font-display">
              {locale === 'uz' ? "Hozircha ertaklar topilmadi" : "No stories found"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100 max-w-sm mx-auto">
              {locale === 'uz'
                ? "Birinchi sehrli ertakni yaratish uchun quyidagi tugmani bosing!"
                : "Click below to create your very first personalized bedtime storybook!"}
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-pine-800 hover:bg-pine-700 text-butter-200 border-2 border-butter-200 font-extrabold text-sm shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t.createStory}</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story) => {
              const title = locale === 'uz' ? story.title_uz : story.title_en;
              const prologue = locale === 'uz' ? story.prologue_uz : story.prologue_en;

              return (
                <div
                  key={story.id}
                  className="bg-white dark:bg-[#01342e] rounded-3xl overflow-hidden border border-amber-200/80 dark:border-emerald-700/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover Preview */}
                    <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-900">
                      <img
                        src={story.cover_image_url}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold shadow">
                          {story.child_profile.child_name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-md text-slate-800 text-[10px] font-bold">
                          {story.pages.length} {locale === 'uz' ? "sahifa" : "pages"}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 flex gap-1.5">
                        <button
                          onClick={() => toggleFavorite(story.id)}
                          className="p-1.5 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:text-rose-500 transition-colors shadow"
                        >
                          <Heart className={`w-3.5 h-3.5 ${story.is_favorite ? 'text-rose-500 fill-rose-500' : ''}`} />
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="text-lg font-bold font-display line-clamp-1">
                          {title}
                        </h3>
                        <p className="text-[11px] text-amber-200">
                          {new Date(story.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Prologue preview */}
                    <div className="p-5">
                      <p className="text-xs text-slate-600 dark:text-emerald-100 line-clamp-2 leading-relaxed">
                        {prologue}
                      </p>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-5 pt-0 flex items-center gap-2">
                    <Link
                      href={`/story/${story.id}`}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{t.readStory}</span>
                    </Link>

                    <button
                      onClick={() => {
                        setActiveStory(story);
                        setIsOrderModalOpen(true);
                      }}
                      className="p-2.5 rounded-xl border border-amber-300 dark:border-emerald-700 bg-amber-50 dark:bg-emerald-950 hover:bg-amber-100 dark:hover:bg-emerald-900 text-amber-900 dark:text-amber-200 text-xs font-bold transition-all"
                      title={t.orderHardcover}
                    >
                      <Printer className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(locale === 'uz' ? "Ushbu ertakni o'chirishni istaysizmi?" : "Delete this story?")) {
                          removeStoryFromLibrary(story.id);
                        }
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-emerald-800 text-slate-400 dark:text-emerald-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
