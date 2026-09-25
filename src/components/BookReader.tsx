'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, BookOpen, Volume2, Download, 
  Printer, Heart, Share2, Sparkles, Moon, Maximize2, Minimize2, 
  MessageCircle, Target, ArrowLeft, Bookmark, HelpCircle, Trophy,
  Wand2, Loader2, Image as ImageIcon, X, FileText, Check
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

// Cute Smiling Star (matching children's book design)
function CuteSmilingStar({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <polygon
        points="50,6 63,35 95,38 71,62 78,94 50,77 22,94 29,62 5,38 37,35"
        fill="#FBBF24"
        stroke="#F59E0B"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="41" cy="45" r="3.5" fill="#78350F" />
      <circle cx="59" cy="45" r="3.5" fill="#78350F" />
      <circle cx="42" cy="43.5" r="1.2" fill="#FFFFFF" />
      <circle cx="60" cy="43.5" r="1.2" fill="#FFFFFF" />
      <path d="M 43,55 Q 50,63 57,55" stroke="#78350F" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <ellipse cx="36" cy="54" rx="4" ry="2.2" fill="#F87171" opacity="0.85" />
      <ellipse cx="64" cy="54" rx="4" ry="2.2" fill="#F87171" opacity="0.85" />
    </svg>
  );
}

// Laurel Branch for page framing
function LaurelBranch({ flip = false, className = "w-8 h-8" }: { flip?: boolean; className?: string }) {
  return (
    <svg className={`${className} ${flip ? '-scale-x-100' : ''}`} viewBox="0 0 80 80" fill="none">
      <path d="M 15,75 Q 30,45 68,15" stroke="#15803D" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M 22,65 C 14,56 22,50 28,52 C 28,60 25,64 22,65 Z" fill="#22C55E" />
      <path d="M 29,60 C 38,53 36,63 30,66 C 28,63 28,61 29,60 Z" fill="#16A34A" />
      <path d="M 37,48 C 28,39 37,33 43,35 C 43,43 40,47 37,48 Z" fill="#22C55E" />
      <path d="M 46,43 C 55,36 53,46 47,49 C 45,46 45,44 46,43 Z" fill="#16A34A" />
      <path d="M 54,31 C 45,22 54,16 60,18 C 60,26 57,30 54,31 Z" fill="#22C55E" />
      <path d="M 64,26 C 73,19 71,29 65,32 C 63,29 63,27 64,26 Z" fill="#16A34A" />
      <path d="M 66,15 C 62,7 72,6 74,12 C 73,18 68,17 66,15 Z" fill="#22C55E" />
    </svg>
  );
}

// Blooming Flower Cluster for Corners
function FlowerCluster({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <circle cx="56" cy="44" r="16" fill="#F472B6" />
      <circle cx="56" cy="44" r="7" fill="#FDE047" />
      <circle cx="32" cy="66" r="12" fill="#FBBF24" />
      <circle cx="32" cy="66" r="5" fill="#F59E0B" />
      <path d="M 20,40 Q 30,30 42,42 Q 30,50 20,40 Z" fill="#22C55E" />
      <path d="M 66,68 Q 80,60 78,76 Q 66,80 66,68 Z" fill="#16A34A" />
    </svg>
  );
}

// Golden Rosette Medallion with Laurel sprigs for Page Number
function GoldenRosetteMedal({ pageNumber }: { pageNumber: number | string }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 select-none">
      <div className="text-emerald-100 hidden sm:block">
        <LaurelBranch flip className="w-6 h-6 sm:w-8 sm:h-8" />
      </div>
      <div className="relative w-10 h-10 sm:w-13 sm:h-13 flex items-center justify-center">
        {/* Scalloped Outer Rosette Disc */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-500 shadow-md ring-2 ring-amber-400/90 flex items-center justify-center">
          <div className="w-full h-full rounded-full border-2 border-dashed border-amber-700/40"></div>
        </div>
        {/* Inner Cream Disc */}
        <div className="relative w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#FFFDF2] border border-amber-300 flex items-center justify-center shadow-inner">
          <span className="font-serif font-black text-sm sm:text-lg text-emerald-950">
            {pageNumber}
          </span>
        </div>
      </div>
      <div className="text-emerald-100 hidden sm:block">
        <LaurelBranch className="w-6 h-6 sm:w-8 sm:h-8" />
      </div>
    </div>
  );
}

// Helper to format playful dual-tone title
function getDualToneTitle(summary?: string, fallback = '') {
  const text = (summary || fallback || '').trim();
  const words = text.split(' ');
  if (words.length <= 1) {
    return { line1: text, line2: '' };
  }
  const mid = Math.ceil(words.length / 2);
  return {
    line1: words.slice(0, mid).join(' '),
    line2: words.slice(mid).join(' '),
  };
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
  const [isBookPrintModalOpen, setIsBookPrintModalOpen] = useState(false);
  const [printPaperSize, setPrintPaperSize] = useState<'A4' | 'A5'>('A4');
  const [readerMode, setReaderMode] = useState<'single' | 'spread'>('single');

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

  const handleDownloadPdf = (paperSize?: 'A4' | 'A5') => {
    const size = paperSize || printPaperSize;
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-paper-size', size);
    }
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
      ? (story.id === 'aqilli-bola-yusuf' ? '/stories/yusuf/nurqissa_full.mp3' : story.pages[0]?.audio_url)
      : currentPageIndex <= totalPages 
      ? story.pages[currentPageIndex - 1]?.audio_url
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

              {/* Reader View Mode Switcher: 1-Sahifa / Ochiq Kitob (2-sahifa) */}
              <div className="hidden sm:inline-flex rounded-xl p-1 bg-white dark:bg-emerald-950 border border-amber-300 dark:border-emerald-700 text-xs font-bold shadow-sm">
                <button
                  onClick={() => setReaderMode('single')}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                    readerMode === 'single'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-700 dark:text-amber-200 hover:text-slate-950'
                  }`}
                  title="1 sahifali vertikal kitob ko'rinishi"
                >
                  <span>📱 1 Sahifa</span>
                </button>
                <button
                  onClick={() => setReaderMode('spread')}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                    readerMode === 'spread'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-700 dark:text-amber-200 hover:text-slate-950'
                  }`}
                  title="2 sahifali ochiq kitob (Haqiqiy kitob varaqlari)"
                >
                  <span>📖 Ochiq Kitob</span>
                </button>
              </div>

              {/* Kitob Versiya (PDF / Bosma Maket) */}
              <button
                onClick={() => setIsBookPrintModalOpen(true)}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-105 text-slate-950 text-xs font-black shadow-sm transition-all flex items-center gap-1.5 border border-amber-300"
                title="Bosmaga tayyor kitob maketini (A4/A5) ko'rish va PDF yuklab olish"
              >
                <Printer className="w-4 h-4 text-slate-950" />
                <span className="hidden sm:inline">Kitob Maketi (PDF)</span>
                <span className="sm:hidden">PDF Kitob</span>
              </button>

              {/* Puzzle Game button */}
              <Link
                href="/games"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white text-xs font-black shadow-sm transition-all"
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

          {/* Realistic Children's Picturebook Reader Container (Dual-Mode: 1-Page vs 2-Page Spread) */}
          <div className={`book-container my-4 mx-auto w-full relative transition-all duration-300 ${readerMode === 'spread' ? 'max-w-5xl' : 'max-w-2xl'}`}>
            
            {/* Desktop Floating Navigation Arrows */}
            <div className="hidden xl:flex items-center justify-between absolute inset-y-0 -left-20 -right-20 pointer-events-none z-30">
              {currentPageIndex > 0 ? (
                <button
                  onClick={prevPage}
                  className="pointer-events-auto p-3.5 rounded-full bg-white dark:bg-emerald-900 text-slate-800 dark:text-amber-200 shadow-xl border-2 border-amber-300 dark:border-emerald-600 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
                  title={t.prevPage}
                >
                  <ChevronLeft className="w-6 h-6 text-emerald-700 dark:text-amber-300 group-hover:-translate-x-0.5 transition-transform" />
                </button>
              ) : <div />}

              {currentPageIndex < totalPages + 1 ? (
                <button
                  onClick={nextPage}
                  className="pointer-events-auto p-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-xl border-2 border-amber-300 hover:brightness-105 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
                  title={t.nextPage}
                >
                  <ChevronRight className="w-6 h-6 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : <div />}
            </div>

            <div className="relative bg-[#FFFDF5] dark:bg-[#002621] rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl border-2 sm:border-4 border-amber-300/80 dark:border-emerald-700/80 flex flex-col justify-between">
              
              {/* Book Pages with Page Transitions */}
              <AnimatePresence mode="wait">
                
                {/* ========================================================================= */}
                {/* COVER VIEW (Index 0)                                                      */}
                {/* ========================================================================= */}
                {currentPageIndex === 0 && (
                  <motion.div
                    key="cover"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35 }}
                    className={`w-full ${readerMode === 'spread' ? 'grid grid-cols-1 md:grid-cols-12 min-h-[480px] md:min-h-[540px]' : 'flex flex-col'}`}
                  >
                    {/* Cover Visual: Left in spread mode, Top in single mode */}
                    <div className={`relative overflow-hidden bg-slate-950 group ${readerMode === 'spread' ? 'md:col-span-6 lg:col-span-7 min-h-[300px] md:min-h-full border-b md:border-b-0 md:border-r border-amber-200/60 dark:border-emerald-800/60' : 'w-full h-[250px] xs:h-[300px] sm:h-[400px] md:h-[470px]'}`}>
                      {!loadedImages['cover'] && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 animate-pulse flex flex-col items-center justify-center text-amber-300 gap-2 z-10">
                          <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-amber-400" />
                          <span className="text-[11px] sm:text-xs font-bold font-serif">{locale === 'uz' ? "Nurli muqova surati yuklanmoqda..." : "Loading cover artwork..."}</span>
                        </div>
                      )}
                      <img
                        src={story.cover_image_url}
                        alt={title}
                        onLoad={() => setLoadedImages(prev => ({ ...prev, cover: true }))}
                        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${loadedImages['cover'] ? 'opacity-100' : 'opacity-0'}`}
                      />
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-amber-400/95 backdrop-blur-md text-slate-950 font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-md border border-amber-300">
                          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-900" />
                          <span>{locale === 'uz' ? "Shaxsiy Ertak Kitobi" : "Personalized Storybook"}</span>
                        </span>
                      </div>
                    </div>

                    {/* Cover Info Card: Right in spread mode, Bottom in single mode */}
                    <div className={`relative bg-[#FFFDF0] dark:bg-[#042820] flex flex-col justify-between transition-colors duration-300 ${readerMode === 'spread' ? 'md:col-span-6 lg:col-span-5 p-4 sm:p-8' : 'px-2 xs:px-3 sm:px-6 pt-3 sm:pt-4 pb-2'}`}>
                      <div className="relative rounded-[22px] sm:rounded-[32px] border-2 border-dashed border-emerald-500/70 dark:border-emerald-400/60 p-4 xs:p-5 sm:p-7 bg-[#FFFDF5]/85 dark:bg-emerald-950/40 shadow-sm text-center my-auto">
                        
                        {/* Top Left Laurel */}
                        <div className="absolute -top-2.5 -left-1.5 sm:-top-3 sm:-left-2 z-20 pointer-events-none">
                          <LaurelBranch className="w-6 h-6 sm:w-10 sm:h-10 text-emerald-600" />
                        </div>

                        {/* Top Right Smiling Star */}
                        <div className="absolute -top-3 -right-2 sm:-top-4 sm:-right-3 z-20 pointer-events-none animate-bounce" style={{ animationDuration: '3s' }}>
                          <CuteSmilingStar className="w-7 h-7 sm:w-11 sm:h-11 drop-shadow-md" />
                        </div>

                        {/* Confetti Dots */}
                        <div className="absolute top-8 left-2 sm:top-10 sm:left-3 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-400/80 pointer-events-none" />
                        <div className="absolute top-10 right-3 sm:top-12 sm:right-4 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-sky-400/80 pointer-events-none" />
                        <div className="absolute bottom-6 left-2 sm:bottom-8 sm:left-3 text-[10px] sm:text-xs select-none pointer-events-none">💚</div>

                        {/* Bottom Flowers */}
                        <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 z-20 pointer-events-none">
                          <FlowerCluster className="w-7 h-7 sm:w-11 sm:h-11" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 z-20 pointer-events-none -scale-x-100">
                          <FlowerCluster className="w-7 h-7 sm:w-11 sm:h-11" />
                        </div>

                        <p className="text-[10px] sm:text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-1">
                          NurQissa AI Bedtime Series
                        </p>
                        
                        <h2 className="text-lg xs:text-xl sm:text-3xl font-black text-slate-900 dark:text-amber-200 font-display leading-tight mb-2 sm:mb-3 px-1">
                          {title}
                        </h2>

                        <div className="inline-block p-2 xs:p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-amber-50/90 dark:bg-emerald-950/80 border border-amber-300 dark:border-emerald-700/60 mb-2 sm:mb-3 max-w-md mx-auto">
                          <p className="text-[9px] sm:text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                            {locale === 'uz' ? "Maxsus bag'ishlov:" : "Special Dedication:"}
                          </p>
                          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-emerald-100">
                            {story.child_profile.child_name} {locale === 'uz' ? "uchun mehr va duolar bilan" : "with love and prayers"}
                          </p>
                        </div>

                        <p className="text-[11px] xs:text-xs sm:text-sm text-slate-700 dark:text-amber-100/90 italic leading-relaxed max-w-lg mx-auto mb-3 sm:mb-4 px-1">
                          "{prologue}"
                        </p>

                        <button
                          onClick={nextPage}
                          className="w-full max-w-md mx-auto py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 hover:brightness-110 text-slate-950 font-black text-xs xs:text-sm sm:text-base shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>{locale === 'uz' ? "Ertakni o'qishni boshlash" : "Start Reading Story"}</span>
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                      </div>

                      {/* Rosette Medal at bottom */}
                      {readerMode === 'spread' && (
                        <div className="mt-4 pt-3 border-t border-amber-200 dark:border-emerald-800 flex items-center justify-center">
                          <GoldenRosetteMedal pageNumber="⭐" />
                        </div>
                      )}
                    </div>

                    {/* Grassy Meadow Base in single-page mode */}
                    {readerMode === 'single' && (
                      <div className="bg-gradient-to-t from-[#438321] via-[#529929] to-[#5FA832] dark:from-[#032b21] dark:via-[#064233] dark:to-[#095442] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center border-t border-amber-300/40">
                        <GoldenRosetteMedal pageNumber="⭐" />
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ========================================================================= */}
                {/* STORY SPREAD PAGES (Index 1 to totalPages) - DUAL MODE                     */}
                {/* ========================================================================= */}
                {currentPageIndex >= 1 && currentPageIndex <= totalPages && (() => {
                  const page = story.pages[currentPageIndex - 1];
                  const dualTitle = getDualToneTitle(page.scene_summary, title);
                  
                  return (
                    <motion.div
                      key={currentPageIndex}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className={`w-full ${readerMode === 'spread' ? 'grid grid-cols-1 md:grid-cols-12 min-h-[480px] md:min-h-[560px]' : 'flex flex-col'}`}
                    >
                      {/* STORY ILLUSTRATION: Left Page in spread mode, Top in single mode */}
                      <div className={`relative overflow-hidden bg-slate-950 group ${readerMode === 'spread' ? 'md:col-span-6 lg:col-span-7 min-h-[300px] md:min-h-full border-b md:border-b-0 md:border-r border-amber-200/60 dark:border-emerald-800/60' : 'w-full h-[250px] xs:h-[300px] sm:h-[400px] md:h-[460px]'}`}>
                        {!loadedImages[`page_${currentPageIndex}`] && (
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 animate-pulse flex flex-col items-center justify-center text-amber-300 gap-2 z-10">
                            <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-amber-400" />
                            <span className="text-[11px] sm:text-xs font-bold font-serif">{locale === 'uz' ? `${currentPageIndex}-sahifa surati yuklanmoqda...` : `Loading Page ${currentPageIndex}...`}</span>
                          </div>
                        )}
                        <img
                          src={customPageImages[currentPageIndex] || page.image_url}
                          alt={`Page ${currentPageIndex} Scene`}
                          onLoad={() => setLoadedImages(prev => ({ ...prev, [`page_${currentPageIndex}`]: true }))}
                          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${loadedImages[`page_${currentPageIndex}`] ? 'opacity-100' : 'opacity-0'}`}
                        />

                        {/* Subtle book spine seam shadow on the right in spread mode */}
                        {readerMode === 'spread' && (
                          <div className="hidden md:block absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/25 to-transparent pointer-events-none" />
                        )}

                        {/* Spot the Hidden Object Mini-Game */}
                        <HiddenObjectGame pageNumber={currentPageIndex} storyId={story.id} />

                        {/* AI Image Generation Overlay Button */}
                        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-30 opacity-90 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleGenerateAiImage(currentPageIndex)}
                            disabled={isGeneratingImage}
                            className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[9px] xs:text-[10px] sm:text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
                            title={locale === 'uz' ? "Ushbu sahna uchun yangi AI rasm chizish" : "Generate new AI illustration"}
                          >
                            {isGeneratingImage ? (
                              <>
                                <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin text-amber-400" />
                                <span>{locale === 'uz' ? "Chizilmoqda..." : "Generating..."}</span>
                              </>
                            ) : (
                              <>
                                <Wand2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                                <span>AI DALL-E 3</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* STORY TEXT & FRAMED CARD: Right Page in spread mode, Bottom in single mode */}
                      <div className={`relative bg-[#FFFDF0] dark:bg-[#042820] flex flex-col justify-between transition-colors duration-300 ${readerMode === 'spread' ? 'md:col-span-6 lg:col-span-5 p-3 xs:p-4 sm:p-6 md:p-8' : 'px-2 xs:px-3 sm:px-6 pt-3 sm:pt-4 pb-2'}`}>
                        
                        {/* The Framed Container with Dashed Embroidery */}
                        <div className="relative rounded-[22px] sm:rounded-[32px] border-2 border-dashed border-emerald-500/70 dark:border-emerald-400/60 p-4 xs:p-5 sm:p-7 bg-[#FFFDF5]/85 dark:bg-emerald-950/40 shadow-sm my-auto">
                          
                          {/* Top Left: Laurel Sprig */}
                          <div className="absolute -top-2.5 -left-1.5 sm:-top-3 sm:-left-2 z-20 pointer-events-none">
                            <LaurelBranch className="w-6 h-6 sm:w-10 sm:h-10 text-emerald-600" />
                          </div>

                          {/* Top Right: Smiling Star */}
                          <div className="absolute -top-3 -right-2 sm:-top-4 sm:-right-3 z-20 pointer-events-none animate-bounce" style={{ animationDuration: '3s' }}>
                            <CuteSmilingStar className="w-7 h-7 sm:w-11 sm:h-11 drop-shadow-md" />
                          </div>

                          {/* Playful Confetti Dots */}
                          <div className="absolute top-8 left-2 sm:top-10 sm:left-3 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-400/80 pointer-events-none" />
                          <div className="absolute top-16 left-2 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-400/80 pointer-events-none" />
                          <div className="absolute top-10 right-3 sm:top-12 sm:right-4 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-sky-400/80 pointer-events-none" />
                          <div className="absolute bottom-8 left-2 sm:bottom-10 sm:left-3 text-[10px] sm:text-xs select-none pointer-events-none">💚</div>

                          {/* Bottom Left Flowers */}
                          <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 z-20 pointer-events-none">
                            <FlowerCluster className="w-7 h-7 sm:w-11 sm:h-11" />
                          </div>

                          {/* Bottom Right Flowers */}
                          <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 z-20 pointer-events-none -scale-x-100">
                            <FlowerCluster className="w-7 h-7 sm:w-11 sm:h-11" />
                          </div>

                          {/* Dual-Tone Playful Title */}
                          <div className="text-center space-y-0.5 mb-2 sm:mb-4 px-3 sm:px-6">
                            <h2 className="text-lg xs:text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-300 font-display tracking-tight">
                              {dualTitle.line1}
                            </h2>
                            {dualTitle.line2 && (
                              <h3 className="text-lg xs:text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-display tracking-tight">
                                {dualTitle.line2}
                              </h3>
                            )}
                          </div>

                          {/* Story Narrative Text */}
                          <div className="my-1.5 sm:my-4 px-1 sm:px-4">
                            <p className="text-center text-slate-800 dark:text-[#FFFDF5] font-sans font-semibold text-[14px] xs:text-[15px] sm:text-lg md:text-xl leading-relaxed sm:leading-loose tracking-wide">
                              {locale === 'uz' ? page.text_uz : page.text_en}
                            </p>
                          </div>

                        </div>

                        {/* In spread mode: Dedicated footer row */}
                        {readerMode === 'spread' && (
                          <div className="mt-4 pt-3 border-t border-amber-200 dark:border-emerald-800 flex items-center justify-between">
                            <button
                              onClick={prevPage}
                              className="px-3 sm:px-4 py-2 rounded-xl bg-white dark:bg-emerald-950 hover:bg-slate-50 dark:hover:bg-emerald-900 text-emerald-950 dark:text-amber-200 border border-amber-300 dark:border-emerald-700 font-black text-xs shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
                            >
                              <ChevronLeft className="w-4 h-4 text-emerald-700 dark:text-amber-400" />
                              <span className="hidden sm:inline">{t.prevPage}</span>
                            </button>

                            <GoldenRosetteMedal pageNumber={currentPageIndex} />

                            <button
                              onClick={nextPage}
                              className="px-4 sm:px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
                            >
                              <span>{currentPageIndex === totalPages ? t.reflectionTab : t.nextPage}</span>
                              <ChevronRight className="w-4 h-4 text-slate-900" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* In single-page mode: Grassy Meadow Base & Golden Rosette Medallion */}
                      {readerMode === 'single' && (
                        <div className="bg-gradient-to-t from-[#438321] via-[#529929] to-[#5FA832] dark:from-[#032b21] dark:via-[#064233] dark:to-[#095442] px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-1.5 border-t border-amber-300/40">
                          
                          {/* Prev Button */}
                          <button
                            onClick={prevPage}
                            className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/90 hover:bg-white text-emerald-950 font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4 text-emerald-700" />
                            <span className="hidden sm:inline">{t.prevPage}</span>
                          </button>

                          {/* Golden Rosette Center Badge */}
                          <GoldenRosetteMedal pageNumber={currentPageIndex} />

                          {/* Next Button */}
                          <button
                            onClick={nextPage}
                            className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>{currentPageIndex === totalPages ? t.reflectionTab : t.nextPage}</span>
                            <ChevronRight className="w-4 h-4 text-slate-900" />
                          </button>
                        </div>
                      )}

                    </motion.div>
                  );
                })()}

                {/* ========================================================================= */}
                {/* FINAL REFLECTION & BACK COVER (Index = totalPages + 1)                    */}
                {/* ========================================================================= */}
                {currentPageIndex > totalPages && (
                  <motion.div
                    key="reflection-view"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col w-full"
                  >
                    <div className="relative bg-[#FFFDF0] dark:bg-[#042820] p-6 sm:p-10 transition-colors duration-300">
                      <div className="relative rounded-[26px] sm:rounded-[32px] border-2 border-dashed border-emerald-500/70 dark:border-emerald-400/60 p-6 sm:p-8 bg-[#FFFDF5]/85 dark:bg-emerald-950/40 shadow-sm space-y-6">
                        
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
                        <div className="space-y-4 max-w-xl mx-auto w-full">
                          {/* Today's lesson */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 dark:bg-emerald-950/80 border border-amber-300 dark:border-emerald-700/60 space-y-1">
                            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs">
                              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              <span>{t.todaysLesson}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-800 dark:text-emerald-100 leading-relaxed font-semibold">
                              {locale === 'uz' ? story.reflection.todays_lesson_uz : story.reflection.todays_lesson_en}
                            </p>
                          </div>

                          {/* Dua */}
                          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 space-y-1">
                            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-xs">
                              <span>🤲</span>
                              <span>{t.littleDua}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 italic leading-relaxed font-medium">
                              "{locale === 'uz' ? story.reflection.little_dua_uz : story.reflection.little_dua_en}"
                            </p>
                          </div>
                        </div>

                        {/* Actions Bar */}
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-amber-200 dark:border-emerald-800">
                          <button
                            onClick={() => {
                              setActiveQuizStory(story);
                              setIsQuizOpen(true);
                            }}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
                          >
                            <HelpCircle className="w-4 h-4 text-amber-200" />
                            <span>{t.storyQuizTitle} 🌟</span>
                          </button>

                          <button
                            onClick={() => setIsReflectionOpen(true)}
                            className="px-5 py-2.5 rounded-xl bg-[#1E1B4B] dark:bg-emerald-900 hover:bg-[#2A2566] dark:hover:bg-emerald-800 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all border border-transparent dark:border-emerald-700"
                          >
                            <MessageCircle className="w-4 h-4 text-amber-400" />
                            <span>{t.reflectionTab}</span>
                          </button>

                          <button
                            onClick={() => setIsOrderModalOpen(true)}
                            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
                          >
                            <Printer className="w-4 h-4 text-amber-200" />
                            <span>{t.orderHardcover}</span>
                          </button>

                          <button
                            onClick={() => setCurrentPageIndex(0)}
                            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-700 text-slate-700 dark:text-amber-200 hover:bg-slate-50 dark:hover:bg-emerald-900 font-bold text-xs transition-all"
                          >
                            {locale === 'uz' ? "Qaytadan o'qish 🔄" : "Read Again 🔄"}
                          </button>
                        </div>

                      </div>
                    </div>

                    {/* Grassy Meadow Base */}
                    <div className="bg-gradient-to-t from-[#438321] via-[#529929] to-[#5FA832] dark:from-[#032b21] dark:via-[#064233] dark:to-[#095442] px-6 py-3 flex items-center justify-center border-t border-amber-300/40">
                      <GoldenRosetteMedal pageNumber="🌙" />
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

            {/* Quick PDF / Book button */}
            <button
              onClick={() => setIsBookPrintModalOpen(true)}
              className="ml-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-black shrink-0 flex items-center gap-1.5 transition-all shadow-sm"
              title="Bosmaga tayyor kitob maketini (A4/A5) ko'rish va PDF yuklab olish"
            >
              <Printer className="w-3.5 h-3.5 text-slate-950" />
              <span>Kitob Maketi</span>
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

        {/* ========================================================================= */}
        {/* ON-SCREEN BOOK PRINT PREVIEW MODAL (A4 / A5 TYPOGRAPHY FORMAT)            */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {isBookPrintModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="relative w-full max-w-4xl max-h-[92vh] bg-[#FFFDF5] dark:bg-[#002621] rounded-3xl shadow-2xl border-2 sm:border-4 border-amber-300 dark:border-emerald-700 flex flex-col overflow-hidden text-slate-900 dark:text-amber-100"
              >
                {/* Modal Top Control Bar */}
                <div className="p-4 sm:p-5 bg-white/95 dark:bg-emerald-950/95 border-b border-amber-200 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-emerald-900 flex items-center justify-center text-amber-700 dark:text-amber-300 shadow-inner">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-950 dark:text-amber-200 font-display">
                        {locale === 'uz' ? "Bosmaga Tayyor Kitob Maketi (PDF)" : "Print-Ready Storybook Layout (PDF)"}
                      </h2>
                      <p className="text-xs text-amber-800 dark:text-emerald-300 font-medium">
                        {locale === 'uz' ? "A4 / A5 formatdagi to'liq bolalar kitobi maketi" : "A4 / A5 children's book format"}
                      </p>
                    </div>
                  </div>

                  {/* Format Switcher & Actions */}
                  <div className="flex items-center gap-2">
                    <div className="inline-flex rounded-xl p-1 bg-amber-100/80 dark:bg-emerald-900/80 border border-amber-300 dark:border-emerald-700 text-xs font-bold">
                      <button
                        onClick={() => setPrintPaperSize('A4')}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          printPaperSize === 'A4'
                            ? 'bg-amber-500 text-white shadow-sm font-black'
                            : 'text-slate-700 dark:text-amber-200 hover:text-slate-950'
                        }`}
                      >
                        📄 A4 (Katta)
                      </button>
                      <button
                        onClick={() => setPrintPaperSize('A5')}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          printPaperSize === 'A5'
                            ? 'bg-amber-500 text-white shadow-sm font-black'
                            : 'text-slate-700 dark:text-amber-200 hover:text-slate-950'
                        }`}
                      >
                        📖 A5 (Klassik)
                      </button>
                    </div>

                    {/* Print / Save PDF button */}
                    <button
                      onClick={() => handleDownloadPdf(printPaperSize)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Printer className="w-4 h-4 text-slate-950" />
                      <span>{locale === 'uz' ? "PDF Yuklab Olish (Chop Etish)" : "Download PDF / Print"}</span>
                    </button>

                    {/* Close modal */}
                    <button
                      onClick={() => setIsBookPrintModalOpen(false)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-emerald-900 dark:hover:bg-emerald-800 text-slate-700 dark:text-amber-200 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Modal Scrollable Book Preview Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-100 dark:bg-slate-950/60">
                  <div className="max-w-2xl mx-auto space-y-8">
                    
                    {/* Preview Notification Banner */}
                    <div className="p-3.5 rounded-2xl bg-amber-100/90 dark:bg-emerald-950/80 border border-amber-300 dark:border-emerald-700 text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200 font-bold">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{locale === 'uz' ? `Tanlangan format: ${printPaperSize} bolalar kitobi. Quyida barcha sahifalar ketma-ket ko'rsatilgan.` : `Current format: ${printPaperSize}. All pages previewed below.`}</span>
                      </div>
                      <button
                        onClick={() => {
                          setIsBookPrintModalOpen(false);
                          setIsOrderModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition-all"
                      >
                        {t.orderHardcover} 🚚
                      </button>
                    </div>

                    {/* PAGE 1: PREVIEW COVER */}
                    <div className="bg-[#FFFDF5] dark:bg-[#002621] rounded-3xl border-2 sm:border-4 border-amber-300/80 shadow-xl overflow-hidden flex flex-col">
                      <div className="px-4 py-2 bg-amber-100 dark:bg-emerald-950 border-b border-amber-200 dark:border-emerald-800 flex items-center justify-between text-xs font-black text-amber-950 dark:text-amber-200">
                        <span>📖 1-sahifa: Kitob Muqovasi</span>
                        <span>NurQissa AI</span>
                      </div>
                      <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-slate-900">
                        <img src={story.cover_image_url} alt={title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-5 sm:p-6 bg-[#FFFDF0] dark:bg-[#042820]">
                        <div className="relative rounded-2xl border-2 border-dashed border-emerald-500/70 p-5 bg-[#FFFDF5] dark:bg-emerald-950/40 text-center">
                          <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-amber-200 font-display mb-2">{title}</h2>
                          <p className="text-xs text-amber-800 dark:text-amber-300 font-bold mb-2">
                            {story.child_profile.child_name} {locale === 'uz' ? "uchun mehr va duolar bilan" : "with love and prayers"}
                          </p>
                          <p className="text-xs italic text-slate-700 dark:text-amber-100 max-w-md mx-auto">"{prologue}"</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-t from-[#438321] to-[#5FA832] py-2.5 flex items-center justify-center">
                        <GoldenRosetteMedal pageNumber="⭐" />
                      </div>
                    </div>

                    {/* STORY PAGES PREVIEWS */}
                    {story.pages.map((p) => {
                      const dualTitle = getDualToneTitle(p.scene_summary, title);
                      return (
                        <div key={p.page_number} className="bg-[#FFFDF5] dark:bg-[#002621] rounded-3xl border-2 sm:border-4 border-amber-300/80 shadow-xl overflow-hidden flex flex-col">
                          <div className="px-4 py-2 bg-amber-100 dark:bg-emerald-950 border-b border-amber-200 dark:border-emerald-800 flex items-center justify-between text-xs font-black text-amber-950 dark:text-amber-200">
                            <span>📄 Sahifa {p.page_number} / {totalPages}</span>
                            <span className="truncate max-w-[200px]">{p.scene_summary || title}</span>
                          </div>
                          
                          {/* Image */}
                          <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-slate-900">
                            <img
                              src={customPageImages[p.page_number] || p.image_url}
                              alt={`Sahna ${p.page_number}`}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Scalloped Framed Card */}
                          <div className="p-4 sm:p-6 bg-[#FFFDF0] dark:bg-[#042820]">
                            <div className="relative rounded-2xl border-2 border-dashed border-emerald-500/70 p-5 bg-[#FFFDF5] dark:bg-emerald-950/40 text-center">
                              <div className="absolute -top-3 -left-2 pointer-events-none">
                                <LaurelBranch className="w-8 h-8 text-emerald-600" />
                              </div>
                              <div className="absolute -top-3 -right-2 pointer-events-none">
                                <CuteSmilingStar className="w-8 h-8" />
                              </div>
                              <div className="absolute -bottom-2 -left-2 pointer-events-none">
                                <FlowerCluster className="w-8 h-8" />
                              </div>
                              <div className="absolute -bottom-2 -right-2 pointer-events-none -scale-x-100">
                                <FlowerCluster className="w-8 h-8" />
                              </div>

                              <div className="mb-2">
                                <h3 className="text-lg sm:text-xl font-black text-emerald-800 dark:text-emerald-300">{dualTitle.line1}</h3>
                                {dualTitle.line2 && (
                                  <h4 className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400">{dualTitle.line2}</h4>
                                )}
                              </div>

                              <p className="text-sm sm:text-base font-medium leading-relaxed text-slate-900 dark:text-[#FFFDF5] max-w-lg mx-auto">
                                {locale === 'uz' ? p.text_uz : p.text_en}
                              </p>
                            </div>
                          </div>

                          {/* Grassy Meadow Base & Rosette */}
                          <div className="bg-gradient-to-t from-[#438321] to-[#5FA832] py-2 flex items-center justify-center">
                            <GoldenRosetteMedal pageNumber={p.page_number} />
                          </div>
                        </div>
                      );
                    })}

                    {/* FINAL REFLECTION PREVIEW */}
                    <div className="bg-[#FFFDF5] dark:bg-[#002621] rounded-3xl border-2 sm:border-4 border-emerald-400/80 shadow-xl overflow-hidden flex flex-col">
                      <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-950 border-b border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs font-black text-emerald-950 dark:text-emerald-200">
                        <span>🌙 Yakuniy Saboq & Duo</span>
                        <span>NurQissa AI</span>
                      </div>
                      <div className="p-6 bg-[#FFFDF0] dark:bg-[#042820] space-y-4">
                        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-emerald-950/80 border border-amber-300 dark:border-emerald-700 text-center">
                          <p className="text-xs font-bold text-amber-950 dark:text-amber-300 uppercase mb-1">🌟 {t.todaysLesson}</p>
                          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-emerald-100">
                            {locale === 'uz' ? story.reflection.todays_lesson_uz : story.reflection.todays_lesson_en}
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-center">
                          <p className="text-xs font-bold text-emerald-950 dark:text-emerald-300 uppercase mb-1">🤲 {t.littleDua}</p>
                          <p className="text-xs sm:text-sm italic font-bold text-emerald-950 dark:text-emerald-100">
                            "{locale === 'uz' ? story.reflection.little_dua_uz : story.reflection.little_dua_en}"
                          </p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-t from-[#438321] to-[#5FA832] py-2 flex items-center justify-center">
                        <GoldenRosetteMedal pageNumber="🌙" />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-3 sm:p-4 bg-white/95 dark:bg-emerald-950/95 border-t border-amber-200 dark:border-emerald-800 flex items-center justify-between gap-3 shrink-0 text-xs">
                  <span className="text-slate-600 dark:text-emerald-200 font-medium hidden sm:inline">
                    💡 Chop etish dialogida "Save as PDF" (PDF sifatida saqlash) ni tanlang.
                  </span>
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => setIsBookPrintModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 dark:border-emerald-700 font-bold hover:bg-slate-100 dark:hover:bg-emerald-900 transition-all"
                    >
                      {locale === 'uz' ? "Yopish" : "Close"}
                    </button>
                    <button
                      onClick={() => handleDownloadPdf(printPaperSize)}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:brightness-110 text-slate-950 font-black flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Printer className="w-4 h-4 text-slate-950" />
                      <span>{locale === 'uz' ? "Chop Etish / PDF" : "Print / PDF"}</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ========================================================================= */}
      {/* PRINT-ONLY DEDICATED STORYBOOK FOR CLEAN HIGH-RES PDF & TYPOGRAPHY EXPORT */}
      {/* ========================================================================= */}
      <div className="hidden print:block w-full max-w-4xl mx-auto text-slate-900 bg-white" data-print="storybook">
        
        {/* PDF PAGE 1: LUXURY CHILDREN'S BOOK COVER */}
        <div className="pdf-story-page relative p-4 flex flex-col justify-between items-center text-center bg-[#FFFDF5] border-4 border-amber-400/80 rounded-[32px] overflow-hidden">
          {/* Header watermark */}
          <div className="w-full flex items-center justify-between pb-2 border-b-2 border-amber-300 text-[11px] font-black text-emerald-900 uppercase tracking-widest">
            <span>✨ NurQissa AI Bedtime Series</span>
            <span>🌟 Bolalar Shaxsiy Ertak Kitobi</span>
          </div>

          <div className="my-auto w-full flex flex-col items-center max-w-2xl py-2">
            {/* Top Cover Visual */}
            <div className="w-full max-w-xl h-80 overflow-hidden rounded-3xl border-2 border-amber-400 shadow-md mb-4 bg-slate-900">
              <img
                src={story.cover_image_url}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Scalloped Framed Card */}
            <div className="w-full max-w-xl relative rounded-[28px] border-2 border-dashed border-emerald-600/70 p-6 bg-[#FFFDF0] text-center shadow-inner">
              <div className="absolute -top-3 -left-2 pointer-events-none">
                <LaurelBranch className="w-9 h-9 text-emerald-600" />
              </div>
              <div className="absolute -top-4 -right-3 pointer-events-none">
                <CuteSmilingStar className="w-10 h-10" />
              </div>
              <div className="absolute -bottom-3 -left-3 pointer-events-none">
                <FlowerCluster className="w-10 h-10" />
              </div>
              <div className="absolute -bottom-3 -right-3 pointer-events-none -scale-x-100">
                <FlowerCluster className="w-10 h-10" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-200/90 border border-amber-400 text-amber-950 font-black text-xs uppercase tracking-wider mb-2">
                <span>{`👶 ${story.child_profile.child_name} (${story.child_profile.age} ${locale === 'uz' ? "yosh" : "years old"}) ${locale === 'uz' ? "uchun maxsus nashr" : "special edition"}`}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-display mb-3 leading-tight">
                {title}
              </h1>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs font-bold text-amber-950 max-w-md mx-auto mb-2">
                {locale === 'uz' ? "Maxsus bag'ishlov:" : "Special Dedication:"} {story.child_profile.child_name} {locale === 'uz' ? "uchun cheksiz mehr va duolar bilan" : "with love and prayers"}
              </div>

              <p className="text-xs sm:text-sm italic text-slate-700 max-w-md mx-auto leading-relaxed">
                "{prologue}"
              </p>
            </div>
          </div>

          {/* Grassy Meadow Base with Star Rosette */}
          <div className="w-full pt-2 border-t-2 border-amber-300 flex items-center justify-between text-[11px] font-bold text-white bg-gradient-to-t from-[#438321] via-[#529929] to-[#5FA832] px-6 py-2.5 rounded-b-[24px]">
            <span>NurQissa AI • nurqissa.ai</span>
            <GoldenRosetteMedal pageNumber="⭐" />
            <span>{story.pages.length} {locale === 'uz' ? "sahifali ertak" : "pages"}</span>
          </div>
        </div>

        {/* PDF PAGES 2 .. N+1: STORY PAGES */}
        {story.pages.map((page) => {
          const dualTitle = getDualToneTitle(page.scene_summary, title);
          return (
            <div key={page.page_number} className="pdf-story-page relative p-4 flex flex-col justify-between items-center text-center bg-[#FFFDF5] border-4 border-amber-300/80 rounded-[32px] overflow-hidden my-0">
              
              {/* Top Page Header */}
              <div className="w-full flex items-center justify-between pb-2 border-b border-amber-200 text-xs font-black text-emerald-900">
                <span className="uppercase tracking-widest truncate max-w-md">{title}</span>
                <span className="bg-amber-100 text-amber-950 px-3 py-0.5 rounded-full text-xs font-bold font-mono border border-amber-200">
                  {locale === 'uz' ? "Sahifa" : "Page"} {page.page_number} / {totalPages}
                </span>
              </div>

              {/* Center: High-Res Story Illustration & Text */}
              <div className="my-auto w-full flex flex-col items-center py-1">
                {/* Grand Illustration (100% visible, unobstructed) */}
                <div className="w-full max-w-2xl h-80 overflow-hidden rounded-3xl border-2 border-amber-300 shadow-md mb-3 bg-slate-900">
                  <img
                    src={customPageImages[page.page_number] || page.image_url}
                    alt={`Sahna ${page.page_number}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Scalloped Framed Card underneath */}
                <div className="w-full max-w-2xl relative rounded-[28px] border-2 border-dashed border-emerald-600/70 p-6 bg-[#FFFDF0] text-center shadow-inner">
                  {/* Top-Left Laurel */}
                  <div className="absolute -top-3 -left-2 pointer-events-none">
                    <LaurelBranch className="w-9 h-9 text-emerald-600" />
                  </div>
                  {/* Top-Right Smiling Star */}
                  <div className="absolute -top-4 -right-3 pointer-events-none">
                    <CuteSmilingStar className="w-10 h-10" />
                  </div>
                  {/* Confetti dots */}
                  <div className="absolute top-10 left-3 w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                  <div className="absolute top-12 right-4 w-2.5 h-2.5 rounded-full bg-sky-400/80" />
                  <div className="absolute bottom-10 left-3 text-xs">💚</div>
                  {/* Bottom Flowers */}
                  <div className="absolute -bottom-3 -left-3 pointer-events-none">
                    <FlowerCluster className="w-10 h-10" />
                  </div>
                  <div className="absolute -bottom-3 -right-3 pointer-events-none -scale-x-100">
                    <FlowerCluster className="w-10 h-10" />
                  </div>

                  {/* Dual-Tone Title */}
                  <div className="text-center space-y-0.5 mb-3 px-4">
                    <h2 className="text-xl sm:text-2xl font-black text-emerald-800 font-display tracking-tight">
                      {dualTitle.line1}
                    </h2>
                    {dualTitle.line2 && (
                      <h3 className="text-xl sm:text-2xl font-black text-amber-600 font-display tracking-tight">
                        {dualTitle.line2}
                      </h3>
                    )}
                  </div>

                  {/* Narrative Text */}
                  <p className="text-base sm:text-lg leading-relaxed text-slate-900 font-sans font-semibold max-w-xl mx-auto px-2">
                    {locale === 'uz' ? page.text_uz : page.text_en}
                  </p>
                </div>
              </div>

              {/* Grassy Meadow Base with Golden Rosette Medal */}
              <div className="w-full pt-1.5 border-t border-amber-300 flex items-center justify-between text-[11px] font-bold text-white bg-gradient-to-t from-[#438321] via-[#529929] to-[#5FA832] px-6 py-2.5 rounded-b-[24px]">
                <span>{`NurQissa AI • ${story.child_profile.child_name}`}</span>
                <GoldenRosetteMedal pageNumber={page.page_number} />
                <span>{locale === 'uz' ? `Sahifa ${page.page_number}` : `Page ${page.page_number}`}</span>
              </div>
            </div>
          );
        })}

        {/* PDF FINAL PAGE: REFLECTION, DUA & LESSON */}
        <div className="pdf-story-page relative p-4 flex flex-col justify-between items-center text-center bg-[#FFFDF5] border-4 border-emerald-400/80 rounded-[32px] overflow-hidden">
          <div className="w-full flex items-center justify-between pb-2 border-b-2 border-emerald-300 text-xs font-black text-emerald-950 uppercase tracking-widest">
            <span>🌙 Ertak Tamom, Saboq Davom...</span>
            <span>NurQissa AI Hikmatlar Qutisi</span>
          </div>

          <div className="my-auto w-full flex flex-col items-center max-w-2xl py-2 space-y-3">
            <div className="text-center space-y-1">
              <span className="text-3xl">🤲</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                {locale === 'uz' ? "Bugungi Ibratli Saboq va Mitti Duo" : "Today's Moral Wisdom & Little Prayer"}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                {locale === 'uz' ? `${story.child_profile.child_name} bilan shirin suhbat va go'zal tarbiya daqiqalari` : `Warm reflections with ${story.child_profile.child_name}`}
              </p>
            </div>

            {/* Today's lesson box */}
            <div className="w-full p-4 rounded-2xl bg-[#FFFDF0] border-2 border-amber-300 text-slate-900 space-y-1 text-center">
              <p className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center justify-center gap-1">
                <span>{`🌟 ${t.todaysLesson}`}</span>
              </p>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed max-w-lg mx-auto">
                {locale === 'uz' ? story.reflection.todays_lesson_uz : story.reflection.todays_lesson_en}
              </p>
            </div>

            {/* Dua box */}
            <div className="w-full p-4 rounded-2xl bg-emerald-50/90 border-2 border-emerald-300 text-slate-900 space-y-1 text-center">
              <p className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center justify-center gap-1">
                <span>{`🤲 ${t.littleDua}`}</span>
              </p>
              <p className="text-sm font-bold text-emerald-950 italic leading-relaxed max-w-lg mx-auto">
                {`"${locale === 'uz' ? story.reflection.little_dua_uz : story.reflection.little_dua_en}"`}
              </p>
            </div>

            {/* Discussion questions */}
            {story.reflection.discussion_questions_uz && story.reflection.discussion_questions_uz.length > 0 && (
              <div className="w-full p-4 rounded-2xl bg-white border border-slate-300 text-slate-800 space-y-2 text-left">
                <p className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                  {locale === 'uz' ? "💬 Ota-ona va farzand o'rtasidagi suhbat savollari:" : "💬 Discussion Questions:"}
                </p>
                <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
                  {(locale === 'uz' ? story.reflection.discussion_questions_uz : story.reflection.discussion_questions_en).map((q, qIdx) => (
                    <li key={qIdx} className="font-medium">{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Grassy Meadow Base with Crescent Rosette */}
          <div className="w-full pt-1.5 border-t border-emerald-300 flex items-center justify-between text-[11px] font-bold text-white bg-gradient-to-t from-[#438321] via-[#529929] to-[#5FA832] px-6 py-2.5 rounded-b-[24px]">
            <span>NurQissa AI — nurqissa.ai</span>
            <GoldenRosetteMedal pageNumber="🌙" />
            <span>{locale === 'uz' ? "Mehr va ezgulik ulashishda davom eting! ✨" : "Spread love! ✨"}</span>
          </div>
        </div>
      </div>
    </>
  );
}
