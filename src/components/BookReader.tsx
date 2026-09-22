'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, BookOpen, Volume2, Download, 
  Printer, Heart, Share2, Sparkles, Moon, Maximize2, Minimize2, 
  MessageCircle, Target, ArrowLeft, Bookmark, HelpCircle, Trophy,
  Wand2, Loader2, Image as ImageIcon
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { StoryBook } from '@/lib/types';
import AudioNarrationBar from './AudioNarrationBar';
import ReflectionModal from './ReflectionModal';
import StoryQuizModal from './StoryQuizModal';
import HiddenObjectGame from './HiddenObjectGame';
import confetti from 'canvas-confetti';

interface BookReaderProps {
  story: StoryBook;
}

export default function BookReader({ story }: BookReaderProps) {
  const { 
    locale, 
    setIsOrderModalOpen, 
    toggleFavorite, 
    addStoryToLibrary, 
    setIsPlayingAudio,
    setIsQuizOpen,
    setActiveQuizStory
  } = useAppStore();
  const t = translations[locale];

  // 0 = Cover page, 1-8 = Story pages, 9 = Reflection/Back cover
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [customPageImages, setCustomPageImages] = useState<Record<number, string>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleGenerateAiImage = async (pageIdx: number) => {
    const page = story.pages[pageIdx - 1];
    if (!page) return;

    setIsGeneratingImage(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: page.image_prompt || `${story.child_profile.child_name} bedtime story fairytale scene`,
          childName: story.child_profile.child_name,
          gender: story.child_profile.gender,
          sceneSummary: page.scene_summary,
          style: story.child_profile.illustration_style || 'pixar_3d',
          seed: pageIdx,
        }),
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        setCustomPageImages((prev) => ({ ...prev, [pageIdx]: data.imageUrl }));
        page.image_url = data.imageUrl;
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } else {
        alert(
          locale === 'uz'
            ? data.error || "Rasm generatsiyasi uchun xatolik yuz berdi (.env.local faylini tekshiring)."
            : data.error || "Generation failed. Please check configuration."
        );
      }
    } catch (err: any) {
      console.error(err);
      alert(locale === 'uz' ? "Rasm yaratishda xatolik yuz berdi" : "Error generating AI image");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const title = locale === 'uz' ? story.title_uz : story.title_en;
  const prologue = locale === 'uz' ? story.prologue_uz : story.prologue_en;
  const totalPages = story.pages.length;

  // Auto-generate high-definition AI illustration if page is currently viewing placeholder
  useEffect(() => {
    if (currentPageIndex >= 1 && currentPageIndex <= totalPages) {
      const page = story.pages[currentPageIndex - 1];
      const currentImg = customPageImages[currentPageIndex] || page?.image_url;
      if (!currentImg || currentImg.startsWith('/api/story-image') || currentImg.includes('.svg')) {
        if (!isGeneratingImage && !customPageImages[currentPageIndex]) {
          handleGenerateAiImage(currentPageIndex);
        }
      }
    }
  }, [currentPageIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextPage();
      } else if (e.key === 'ArrowLeft') {
        prevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex]);

  const nextPage = () => {
    if (currentPageIndex < totalPages + 1) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleDownloadPdf = () => {
    // Print window triggers native high-res PDF generation with custom page breaks
    window.print();
  };

  // Active text and audio for current page
  const currentSpeechText = 
    currentPageIndex === 0 
      ? `${title}. ${prologue}`
      : currentPageIndex <= totalPages 
      ? (locale === 'uz' ? story.pages[currentPageIndex - 1].text_uz : story.pages[currentPageIndex - 1].text_en)
      : (locale === 'uz' ? story.reflection.todays_lesson_uz : story.reflection.todays_lesson_en);

  const currentAudioUrl = 
    currentPageIndex === 0
      ? (story.id === 'aqilli-bola-yusuf' ? '/stories/yusuf/nurqissa_full.mp3' : '/audio/actor_dublyaj_main.mp3')
      : currentPageIndex <= totalPages 
      ? (story.pages[currentPageIndex - 1]?.audio_url || '/audio/actor_dublyaj_main.mp3')
      : undefined;

  return (
    <>
      {/* On-screen interactive reader - hidden during PDF print */}
      <div className="no-print print:hidden min-h-screen bg-[#FFFDF5] dark:bg-[#002621] islamic-pattern pb-16 pt-4 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 mb-6 border-b border-amber-200/80 dark:border-emerald-800/80">
            <div className="flex items-center gap-3">
              <Link
                href="/library"
                className="p-2 rounded-xl bg-white dark:bg-emerald-950 border border-amber-200 dark:border-emerald-700 text-slate-700 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-emerald-900 shadow-sm transition-all"
                title={t.library}
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-[#1E1B4B] dark:text-amber-200 font-display line-clamp-1">
                  {title}
                </h1>
                <p className="text-xs text-amber-800 dark:text-emerald-300 font-medium">
                  {story.child_profile.child_name} {locale === 'uz' ? "nomli qahramon" : "the story hero"} • {story.pages.length} {locale === 'uz' ? "sahifa" : "pages"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Story Quiz Button */}
              <button
                onClick={() => {
                  setActiveQuizStory(story);
                  setIsQuizOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-100/90 dark:bg-emerald-900/90 hover:bg-amber-200 dark:hover:bg-emerald-800 border border-amber-300 dark:border-emerald-600 text-amber-950 dark:text-amber-200 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                <span className="hidden sm:inline">{t.storyQuizTitle}</span>
              </button>

              {/* Save to Library */}
              <button
                onClick={() => {
                  addStoryToLibrary(story);
                  confetti({ particleCount: 50, spread: 60 });
                }}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-emerald-950 border border-amber-200 dark:border-emerald-700 hover:bg-amber-50 dark:hover:bg-emerald-900 text-slate-700 dark:text-amber-200 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">{t.saveToLib}</span>
              </button>

              {/* Favorite toggle */}
              <button
                onClick={() => toggleFavorite(story.id)}
                className={`p-2 rounded-xl border transition-all ${
                  story.is_favorite
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400'
                    : 'bg-white dark:bg-emerald-950 border-amber-200 dark:border-emerald-700 text-slate-700 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-emerald-900'
                }`}
                title="Sevimlilarga qo'shish"
              >
                <Heart className={`w-4 h-4 ${story.is_favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-white dark:bg-emerald-950 border border-amber-200 dark:border-emerald-700 text-slate-700 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-emerald-900 shadow-sm transition-all relative"
                title="Havoladan nusxa olish"
              >
                <Share2 className="w-4 h-4" />
                {copiedLink && (
                  <span className="absolute -bottom-8 right-0 bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap">
                    {locale === 'uz' ? "Nusxalandi!" : "Copied!"}
                  </span>
                )}
              </button>

              {/* Puzzle Game button */}
              <Link
                href="/games"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-pine-950 text-xs font-black shadow-sm transition-all"
                title={locale === 'uz' ? "Ushbu ertak bilan mozaika o'yini o'ynash" : "Play puzzle game with this story"}
              >
                <span>🧩</span>
                <span>{locale === 'uz' ? "Mozaika" : "Puzzle"}</span>
              </Link>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-white dark:bg-emerald-950 border border-amber-200 dark:border-emerald-700 text-slate-700 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-emerald-900 shadow-sm transition-all"
                title="To'liq ekran"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Realistic Book Spread Reader Container */}
          <div className="book-container my-4">
            <div className="relative bg-white dark:bg-[#002621] rounded-3xl overflow-hidden shadow-book-lg border border-amber-300/80 dark:border-emerald-700/80 min-h-[480px] sm:min-h-[540px] flex flex-col justify-between">
              
              {/* Book Pages with Page Turn Transitions */}
              <AnimatePresence mode="wait">
                {/* COVER VIEW (Index 0) */}
                {currentPageIndex === 0 && (
                  <motion.div
                    key="cover"
                    initial={{ opacity: 0, rotateY: -15 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: 15 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-12 min-h-[500px] sm:min-h-[560px] md:min-h-[620px]"
                  >
                    {/* Left: Decorative Cover Spine & Full-Bleed Visual */}
                    <div className="md:col-span-7 relative overflow-hidden bg-slate-950 flex items-center justify-center h-80 sm:h-96 md:h-auto min-h-[320px] md:min-h-full border-b md:border-b-0 md:border-r border-amber-200/60 dark:border-emerald-800/60 group">
                      {!loadedImages['cover'] && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 animate-pulse flex flex-col items-center justify-center text-amber-300 gap-2 z-10">
                          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                          <span className="text-xs font-bold font-serif">{locale === 'uz' ? "Nurli muqova surati yuklanmoqda..." : "Loading cover artwork..."}</span>
                        </div>
                      )}
                      <img
                        src={story.cover_image_url}
                        alt={title}
                        onLoad={() => setLoadedImages(prev => ({ ...prev, cover: true }))}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${loadedImages['cover'] ? 'opacity-100' : 'opacity-0'}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/90 via-[#1E1B4B]/20 to-transparent pointer-events-none"></div>
                      
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-amber-400/95 backdrop-blur-md text-slate-950 font-black text-xs uppercase tracking-wider shadow-md border border-amber-300">
                          <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                          <span>{locale === 'uz' ? "Shaxsiy Ertak Kitobi" : "Personalized Storybook"}</span>
                        </span>
                      </div>

                      <div className="absolute bottom-5 left-5 right-5 z-10 text-white space-y-1">
                        <p className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                          {story.child_profile.child_name} • {story.pages.length} {locale === 'uz' ? "sahifali qissa" : "pages"}
                        </p>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-display text-white drop-shadow-md line-clamp-2">
                          {title}
                        </h3>
                      </div>
                    </div>

                    {/* Right: Book Title, Dedication, Prologue */}
                    <div className="md:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-[#FFFDF9] dark:bg-[#01342e] dark:text-amber-50 book-spine-gradient transition-colors duration-300">
                      <div className="space-y-4 sm:space-y-6">
                        <div className="space-y-1 sm:space-y-2">
                          <p className="text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">
                            NurQissa AI Bedtime Series
                          </p>
                          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] dark:text-amber-200 font-display leading-tight">
                            {title}
                          </h2>
                        </div>

                        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/80 dark:bg-emerald-950/80 border border-amber-200 dark:border-emerald-700/60 space-y-0.5 sm:space-y-1">
                          <p className="text-[10px] sm:text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                            {locale === 'uz' ? "Maxsus bag'ishlov:" : "Special Dedication:"}
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-emerald-100">
                            {story.child_profile.child_name} {locale === 'uz' ? "uchun mehr va duolar bilan" : "with love and prayers"}
                          </p>
                        </div>

                        <p className="text-xs sm:text-sm md:text-base text-slate-700 dark:text-amber-100/90 italic leading-relaxed">
                          "{prologue}"
                        </p>
                      </div>

                      <div className="pt-4 sm:pt-6">
                        <button
                          onClick={nextPage}
                          className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 hover:brightness-110 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          <span>{locale === 'uz' ? "Ertakni o'qishni boshlash" : "Start Reading Story"}</span>
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STORY SPREAD PAGES (Index 1 to 8) */}
                {currentPageIndex >= 1 && currentPageIndex <= totalPages && (
                  <motion.div
                    key={currentPageIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35 }}
                    className="grid grid-cols-1 md:grid-cols-12 min-h-[500px] sm:min-h-[560px] md:min-h-[620px]"
                  >
                    {/* Left Spread: Grand Full-Bleed Story Illustration (7 Cols) */}
                    <div className="md:col-span-7 relative overflow-hidden bg-slate-950 flex items-center justify-center h-80 sm:h-96 md:h-auto min-h-[320px] md:min-h-full group border-b md:border-b-0 md:border-r border-amber-200/60 dark:border-emerald-800/60">
                      {!loadedImages[`page_${currentPageIndex}`] && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 animate-pulse flex flex-col items-center justify-center text-amber-300 gap-2 z-10">
                          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                          <span className="text-xs font-bold font-serif">{locale === 'uz' ? `${currentPageIndex}-sahifa surati chizilmoqda...` : `Generating Page ${currentPageIndex} illustration...`}</span>
                        </div>
                      )}
                      <img
                        src={customPageImages[currentPageIndex] || story.pages[currentPageIndex - 1].image_url}
                        alt={`Page ${currentPageIndex} Scene`}
                        onLoad={() => setLoadedImages(prev => ({ ...prev, [`page_${currentPageIndex}`]: true }))}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-102 ${loadedImages[`page_${currentPageIndex}`] ? 'opacity-100' : 'opacity-0'}`}
                      />

                      {/* Spot the Hidden Object Mini-Game */}
                      <HiddenObjectGame pageNumber={currentPageIndex} storyId={story.id} />

                      {/* AI Image Generation Overlay Button */}
                      <div className="absolute top-3 right-3 z-30 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleGenerateAiImage(currentPageIndex)}
                          disabled={isGeneratingImage}
                          className="px-2.5 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] sm:text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
                          title={locale === 'uz' ? "Ushbu sahna uchun OpenAI DALL-E 3 orqali yangi AI rasm chizish" : "Generate new DALL-E 3 illustration for this scene"}
                        >
                          {isGeneratingImage ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                              <span>{locale === 'uz' ? "Chizilmoqda..." : "Generating..."}</span>
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                              <span>AI DALL-E 3</span>
                            </>
                          )}
                        </button>
                      </div>
                      
                      {/* Scene subtitle */}
                      {story.pages[currentPageIndex - 1].scene_summary && (
                        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-xl text-white text-xs sm:text-sm border border-white/15 flex items-center gap-2 z-20 shadow-md">
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="line-clamp-1 font-medium">{story.pages[currentPageIndex - 1].scene_summary}</span>
                        </div>
                      )}
                    </div>

                    {/* Right Spread: Story Text & Typography (5 Cols) */}
                    <div className="md:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-[#FFFDF9] dark:bg-[#01342e] dark:text-amber-50 book-spine-gradient transition-colors duration-300">
                      
                      {/* Header of page */}
                      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-amber-100 dark:border-emerald-800 text-[11px] sm:text-xs font-bold text-amber-800 dark:text-amber-300">
                        <span className="uppercase tracking-widest line-clamp-1">{title}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-emerald-950 text-amber-900 dark:text-amber-200 font-mono shrink-0 ml-2 border border-transparent dark:border-emerald-700/60">
                          {t.page} {currentPageIndex} / {totalPages}
                        </span>
                      </div>

                      {/* Main Story Narrative */}
                      <div className="my-auto py-4 sm:py-6">
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-900 dark:text-[#FFFDF5] leading-relaxed font-serif tracking-wide selection:bg-amber-200">
                          {locale === 'uz'
                            ? story.pages[currentPageIndex - 1].text_uz
                            : story.pages[currentPageIndex - 1].text_en}
                        </p>
                      </div>

                      {/* Footer / Next Button */}
                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-amber-100 dark:border-emerald-800 gap-2">
                        <button
                          onClick={prevPage}
                          className="p-2 sm:p-2.5 rounded-xl border border-amber-200 dark:border-emerald-700 text-slate-700 dark:text-emerald-200 hover:bg-amber-50 dark:hover:bg-emerald-900 font-bold text-xs flex items-center gap-1 transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>{t.prevPage}</span>
                        </button>

                        <button
                          onClick={nextPage}
                          className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <span>{currentPageIndex === totalPages ? t.reflectionTab : t.nextPage}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* FINAL REFLECTION & BACK COVER (Index = totalPages + 1) */}
                {currentPageIndex > totalPages && (
                  <motion.div
                    key="reflection-view"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35 }}
                    className="p-8 sm:p-12 bg-[#FFFDF9] dark:bg-[#01342e] dark:text-amber-50 min-h-[460px] sm:min-h-[520px] flex flex-col justify-between space-y-6 transition-colors duration-300"
                  >
                    <div className="text-center space-y-2 max-w-xl mx-auto">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-inner">
                        <Moon className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] dark:text-amber-200 font-display">
                        {locale === 'uz' ? "Ertak Tamom, Saboq Davom..." : "The End of the Story, the Beginning of Wisdom"}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-200">
                        {locale === 'uz' ? "Farzandingiz bilan bugungi kunni shirin suhbat va duo bilan yakunlang" : "Complete tonight with a warm talk and peaceful prayer"}
                      </p>
                    </div>

                    {/* Highlights Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto w-full">
                      {/* Today's lesson */}
                      <div className="p-5 rounded-2xl bg-amber-50 dark:bg-emerald-950/80 border border-amber-200/80 dark:border-emerald-700/60 space-y-1.5">
                        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>{t.todaysLesson}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-emerald-100 leading-relaxed font-medium">
                          {locale === 'uz' ? story.reflection.todays_lesson_uz : story.reflection.todays_lesson_en}
                        </p>
                      </div>

                      {/* Dua */}
                      <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-700/60 space-y-1.5">
                        <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-xs">
                          <span>🤲</span>
                          <span>{t.littleDua}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 italic leading-relaxed">
                          "{locale === 'uz' ? story.reflection.little_dua_uz : story.reflection.little_dua_en}"
                        </p>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-amber-100 dark:border-emerald-800">
                      <button
                        onClick={() => {
                          setActiveQuizStory(story);
                          setIsQuizOpen(true);
                        }}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
                      >
                        <HelpCircle className="w-4 h-4 text-amber-200" />
                        <span>{t.storyQuizTitle} 🌟</span>
                      </button>

                      <button
                        onClick={() => setIsReflectionOpen(true)}
                        className="px-6 py-3 rounded-xl bg-[#1E1B4B] dark:bg-emerald-900 hover:bg-[#2A2566] dark:hover:bg-emerald-800 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all border border-transparent dark:border-emerald-700"
                      >
                        <MessageCircle className="w-4 h-4 text-amber-400" />
                        <span>{t.reflectionTab} ({locale === 'uz' ? "Suhbat & Ovoz" : "Discussion & Voice"})</span>
                      </button>

                      <button
                        onClick={() => setIsOrderModalOpen(true)}
                        className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
                      >
                        <Printer className="w-4 h-4 text-amber-200" />
                        <span>{t.orderHardcover}</span>
                      </button>

                      <button
                        onClick={() => setCurrentPageIndex(0)}
                        className="px-4 py-3 rounded-xl border border-slate-300 dark:border-emerald-700 text-slate-700 dark:text-amber-200 hover:bg-slate-50 dark:hover:bg-emerald-900 font-bold text-xs transition-all"
                      >
                        {locale === 'uz' ? "Qaytadan o'qish 🔄" : "Read Again 🔄"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* Audio Narration Bar */}
          <div className="my-6">
            <AudioNarrationBar
              currentText={currentSpeechText}
              audioUrl={currentAudioUrl}
              currentPage={currentPageIndex === 0 ? 1 : currentPageIndex > totalPages ? totalPages : currentPageIndex}
              totalPages={totalPages}
            />
          </div>

          {/* Bottom Page Thumbnails Strip */}
          <div className="bg-white/80 dark:bg-emerald-950/90 backdrop-blur-md p-4 rounded-2xl border border-amber-200/80 dark:border-emerald-800 shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
            {/* Cover thumb */}
            <button
              onClick={() => setCurrentPageIndex(0)}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                currentPageIndex === 0
                  ? 'bg-amber-500 text-white shadow'
                  : 'bg-amber-50 dark:bg-emerald-900/60 text-slate-700 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-emerald-800'
              }`}
            >
              📖 {locale === 'uz' ? "Muqova" : "Cover"}
            </button>

            {/* 8 Pages thumbs */}
            {story.pages.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPageIndex(idx + 1)}
                className={`w-9 h-9 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  currentPageIndex === idx + 1
                    ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-white shadow scale-105'
                    : 'bg-amber-50/70 dark:bg-emerald-900/60 text-slate-700 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-emerald-800 border border-amber-200/60 dark:border-emerald-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}

            {/* Reflection thumb */}
            <button
              onClick={() => setCurrentPageIndex(totalPages + 1)}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                currentPageIndex === totalPages + 1
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-emerald-50 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-800'
              }`}
            >
              🌙 {t.reflectionTab}
            </button>

            {/* Quick PDF button */}
            <button
              onClick={handleDownloadPdf}
              className="ml-auto px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all"
              title="PDF formatida chop etish"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>

        </div>

        {/* Reflection Full Modal Drawer */}
        <ReflectionModal
          reflection={story.reflection}
          story={story}
          isOpen={isReflectionOpen}
          onClose={() => setIsReflectionOpen(false)}
        />

        {/* Story Quiz Modal */}
        <StoryQuizModal />
      </div>

      {/* ========================================================================= */}
      {/* PRINT-ONLY DEDICATED STORYBOOK FOR CLEAN HIGH-RES PDF GENERATION          */}
      {/* ========================================================================= */}
      <div className="hidden print:block w-full max-w-4xl mx-auto text-slate-900 bg-white" data-print="storybook">
        
        {/* PDF PAGE 1: LUXURY BOOK COVER */}
        <div className="pdf-story-page flex flex-col justify-between items-center text-center p-6 border-4 border-amber-400/70 rounded-3xl bg-amber-50/30">
          <div className="w-full flex items-center justify-between pb-3 border-b-2 border-amber-300 text-xs font-bold text-amber-950 uppercase tracking-widest">
            <span>✨ NurQissa AI Bedtime Series</span>
            <span>🌟 Shaxsiy Ibratli Ertak Kitobi</span>
          </div>

          <div className="my-auto w-full flex flex-col items-center max-w-2xl py-4">
            <div className="w-full max-w-lg mb-5 overflow-hidden rounded-2xl border-2 border-amber-400 shadow-md">
              <img
                src={story.cover_image_url}
                alt={title}
                className="w-full h-80 object-cover"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-200/90 border border-amber-400 text-amber-950 font-black text-xs uppercase tracking-wider mb-3">
              <span>{`👶 ${story.child_profile.child_name} (${story.child_profile.age} ${locale === 'uz' ? "yosh" : "years old"}) ${locale === 'uz' ? "uchun maxsus bag'ishlangan" : "special dedication"}`}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display mb-4 leading-tight">
              {title}
            </h1>

            <div className="p-4 rounded-xl bg-amber-100/60 border border-amber-300 text-sm italic text-slate-800 max-w-xl leading-relaxed">
              {`"${prologue}"`}
            </div>
          </div>

          <div className="w-full pt-3 border-t-2 border-amber-300 flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span>NurQissa AI • nurqissa.ai</span>
            <span>{story.pages.length} {locale === 'uz' ? "sahifali sehrli ertak" : "pages fairytale"}</span>
          </div>
        </div>

        {/* PDF PAGES 2 .. N+1: STORY PAGES */}
        {story.pages.map((page) => (
          <div key={page.page_number} className="pdf-story-page flex flex-col justify-between p-6">
            {/* Top Page Header */}
            <div className="w-full flex items-center justify-between pb-2 border-b border-amber-300 text-xs font-bold text-slate-700">
              <span className="text-amber-950 uppercase tracking-wider truncate max-w-md">{title}</span>
              <span className="bg-amber-100 text-amber-950 px-3 py-0.5 rounded-full text-xs font-bold font-mono border border-amber-200">
                {locale === 'uz' ? "Sahifa" : "Page"} {page.page_number} / {totalPages}
              </span>
            </div>

            {/* Center: High-Res Story Illustration & Text */}
            <div className="my-auto w-full flex flex-col items-center py-2">
              <div className="w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-amber-300 shadow-sm mb-4">
                <img
                  src={customPageImages[page.page_number] || page.image_url}
                  alt={`Sahna ${page.page_number}`}
                  className="w-full h-80 object-cover"
                />
              </div>

              {page.scene_summary && (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-semibold mb-3">
                  <span>{`✨ ${page.scene_summary}`}</span>
                </div>
              )}

              <div className="w-full max-w-2xl px-4 py-2">
                <p className="text-xl sm:text-2xl leading-relaxed text-slate-900 font-serif text-justify font-normal">
                  {locale === 'uz' ? page.text_uz : page.text_en}
                </p>
              </div>
            </div>

            {/* Bottom Page Footer */}
            <div className="w-full pt-2 border-t border-amber-200 flex items-center justify-between text-[11px] text-slate-600 font-semibold">
              <span>{`NurQissa AI • ${story.child_profile.child_name} ${locale === 'uz' ? "uchun maxsus ertak" : "story"}`}</span>
              <span>{locale === 'uz' ? `Sahifa ${page.page_number}` : `Page ${page.page_number}`}</span>
            </div>
          </div>
        ))}

        {/* PDF FINAL PAGE: REFLECTION, DUA & LESSON */}
        <div className="pdf-story-page flex flex-col justify-between p-6 bg-emerald-50/30 border-4 border-emerald-400/70 rounded-3xl">
          <div className="w-full flex items-center justify-between pb-3 border-b-2 border-emerald-300 text-xs font-bold text-emerald-950 uppercase tracking-widest">
            <span>🌙 Ertak Tamom, Saboq Davom...</span>
            <span>NurQissa AI Hikmatlar Qutisi</span>
          </div>

          <div className="my-auto w-full flex flex-col items-center max-w-2xl space-y-4 py-3">
            <div className="text-center space-y-1">
              <span className="text-3xl">🤲</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                {locale === 'uz' ? "Bugungi Ibratli Saboq va Duo" : "Today's Moral Wisdom & Prayer"}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                {locale === 'uz' ? `${story.child_profile.child_name} bilan shirin suhbat va go'zal tarbiya daqiqalari` : `Warm reflections with ${story.child_profile.child_name}`}
              </p>
            </div>

            {/* Today's lesson box */}
            <div className="w-full p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-slate-900 space-y-1">
              <p className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1">
                <span>{`🌟 ${t.todaysLesson}`}</span>
              </p>
              <p className="text-sm font-medium text-slate-800 leading-relaxed">
                {locale === 'uz' ? story.reflection.todays_lesson_uz : story.reflection.todays_lesson_en}
              </p>
            </div>

            {/* Dua box */}
            <div className="w-full p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-slate-900 space-y-1">
              <p className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1">
                <span>{`🤲 ${t.littleDua}`}</span>
              </p>
              <p className="text-sm font-semibold text-emerald-950 italic leading-relaxed">
                {`"${locale === 'uz' ? story.reflection.little_dua_uz : story.reflection.little_dua_en}"`}
              </p>
            </div>

            {/* Discussion questions if any */}
            {story.reflection.discussion_questions_uz && story.reflection.discussion_questions_uz.length > 0 && (
              <div className="w-full p-4 rounded-2xl bg-white border border-slate-300 text-slate-800 space-y-2">
                <p className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  {locale === 'uz' ? "💬 Ota-ona va farzand o'rtasidagi suhbat savollari:" : "💬 Discussion Questions:"}
                </p>
                <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
                  {(locale === 'uz' ? story.reflection.discussion_questions_uz : story.reflection.discussion_questions_en).map((q, qIdx) => (
                    <li key={qIdx}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="w-full pt-3 border-t-2 border-emerald-300 flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span>NurQissa AI — nurqissa.ai</span>
            <span>{locale === 'uz' ? "Mehr va ezgulik ulashishda davom eting! ✨" : "Spread love and wisdom! ✨"}</span>
          </div>
        </div>
      </div>
    </>
  );
}
