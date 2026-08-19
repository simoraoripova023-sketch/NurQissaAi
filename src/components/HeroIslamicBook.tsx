'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, BookOpen, Volume2, Play, Pause, 
  ChevronRight, ChevronLeft, Heart, Star, Moon, Image as ImageIcon
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { SAMPLE_STORIES } from '@/lib/sampleStories';
import confetti from 'canvas-confetti';

interface BookLeaf {
  type: 'image' | 'text' | 'dua';
  title: string;
  image_url?: string;
  caption?: string;
  text?: string;
  subtext?: string;
  arabic_dua?: string;
  dua?: string;
  lesson?: string;
}

// Dedicated Dynamic Moon Phase SVG Orb component
function MoonPhaseOrb({ progress }: { progress: number }) {
  // progress is 0.0 to 1.0
  const isFull = progress >= 0.92;
  const isCrescent = progress <= 0.2;

  // Compute SVG inner shadow mask for dynamic waxing moon phases
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      {/* Full Moon Halo on Final Pages */}
      {isFull && (
        <div className="absolute inset-0 rounded-full bg-amber-300/60 blur-md animate-ping pointer-events-none" />
      )}
      
      {/* Outer Moon Glow */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
        isFull 
          ? 'bg-gradient-to-tr from-amber-200 via-yellow-300 to-amber-100 shadow-[0_0_16px_rgba(253,224,71,0.9)] ring-2 ring-amber-300' 
          : 'bg-[#03231F] border border-amber-300/80 shadow-[0_0_10px_rgba(251,191,36,0.6)]'
      }`}>
        <svg viewBox="0 0 32 32" className="w-6 h-6 transform -rotate-12">
          {/* Dark moon background */}
          <circle cx="16" cy="16" r="13" fill="#011815" />
          
          {/* Golden Illuminated Moon Phase */}
          {progress <= 0.25 ? (
            /* 1. Thin Waxing Crescent (Yangi Hilol) */
            <path
              d="M16 3 A 13 13 0 0 1 16 29 A 8 13 0 0 0 16 3 Z"
              fill="url(#goldGrad)"
            />
          ) : progress <= 0.5 ? (
            /* 2. Quarter Moon (Chorak Oy) */
            <path
              d="M16 3 A 13 13 0 0 1 16 29 A 3 13 0 0 0 16 3 Z"
              fill="url(#goldGrad)"
            />
          ) : progress <= 0.8 ? (
            /* 3. Waxing Gibbous (To'lishayotgan Oy) */
            <path
              d="M16 3 A 13 13 0 0 1 16 29 A 7 13 0 0 1 16 3 Z"
              fill="url(#goldGrad)"
            />
          ) : (
            /* 4. Radiant Full Moon (To'lin Oy / Badr) */
            <circle cx="16" cy="16" r="13" fill="url(#goldGrad)" />
          )}

          {/* Gradients */}
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="50%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export default function HeroIslamicBook() {
  const { locale } = useAppStore();
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0); // Default to Yusuf & Angels story
  const [currentLeafIndex, setCurrentLeafIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [activeTab, setActiveTab] = useState<'read' | 'audio'>('read');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(20);

  const orbitTrackRef = useRef<HTMLDivElement>(null);
  const activeStory = SAMPLE_STORIES[selectedStoryIndex] || SAMPLE_STORIES[0];

  // Build sequential single-page leaves: alternating 1 Page Pure Image -> 1 Page Pure Text
  const leaves: BookLeaf[] = React.useMemo(() => {
    const list: BookLeaf[] = [];
    const pages = activeStory.pages;

    pages.forEach((p, idx) => {
      // 1. Pure Full-Page Illustration Leaf
      list.push({
        type: 'image',
        title: `${activeStory.title_uz} — Sahifa ${idx * 2 + 1}`,
        image_url: p.image_url,
        caption: p.scene_summary,
      });

      // 2. Pure Full-Page Text Leaf
      list.push({
        type: 'text',
        title: `${activeStory.title_uz} — Sahifa ${idx * 2 + 2}`,
        text: locale === 'uz' ? p.text_uz : p.text_en,
        caption: p.scene_summary,
        subtext: locale === 'uz' ? "✨ Ibratli oqshom qissasi" : "✨ Bedtime values story",
      });
    });

    // Final Bedtime Dua Leaf
    list.push({
      type: 'dua',
      title: locale === 'uz' ? "Oqshom Duosi & Hikmat" : "Bedtime Dua & Reflection",
      arabic_dua: activeStory.reflection.arabic_dua,
      dua: locale === 'uz' ? activeStory.reflection.little_dua_uz : activeStory.reflection.little_dua_en,
      lesson: locale === 'uz' ? activeStory.reflection.todays_lesson_uz : activeStory.reflection.todays_lesson_en,
    });

    return list;
  }, [activeStory, locale]);

  const currentLeaf = leaves[currentLeafIndex] || leaves[0];

  const handleSelectStory = (index: number) => {
    setSelectedStoryIndex(index);
    setCurrentLeafIndex(0);
    setDirection(1);
    setIsPlayingAudio(false);
    confetti({
      particleCount: 20,
      spread: 45,
      origin: { y: 0.2, x: 0.75 },
      colors: ['#FFEFB3', '#013E37', '#F59E0B'],
    });
  };

  const goToNextPage = () => {
    setDirection(1);
    setCurrentLeafIndex((prev) => (prev < leaves.length - 1 ? prev + 1 : 0));
  };

  const goToPrevPage = () => {
    setDirection(-1);
    setCurrentLeafIndex((prev) => (prev > 0 ? prev - 1 : leaves.length - 1));
  };

  const goToLeaf = (idx: number) => {
    if (idx === currentLeafIndex) return;
    setDirection(idx > currentLeafIndex ? 1 : -1);
    setCurrentLeafIndex(idx);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const handleAudioPlayToggle = () => {
    const nextPlay = !isPlayingAudio;
    setIsPlayingAudio(nextPlay);
    if (nextPlay) {
      confetti({
        particleCount: 15,
        spread: 35,
        origin: { y: 0.65, x: 0.75 },
        colors: ['#FFEFB3', '#F59E0B', '#34D399'],
      });
    }
  };

  // Ultra-Smooth, Natural Book Page Curl 3D Animation
  const pageVariants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 55 : -55,
      opacity: 0,
      transformOrigin: dir > 0 ? 'right center' : 'left center',
      scale: 0.96,
      filter: 'brightness(0.9)',
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      transformOrigin: 'center center',
      scale: 1,
      filter: 'brightness(1)',
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1], // Natural, calming book-turn easing curve
      },
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -55 : 55,
      opacity: 0,
      transformOrigin: dir > 0 ? 'left center' : 'right center',
      scale: 0.96,
      filter: 'brightness(0.85)',
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  // Calculate moon slider position along the celestial orbit (0 to 1.0)
  const moonRatio = currentLeafIndex / Math.max(leaves.length - 1, 1);
  const moonProgressPercent = moonRatio * 100;

  // Moon phase name string
  const moonPhaseName = React.useMemo(() => {
    if (moonRatio <= 0.15) return locale === 'uz' ? "🌙 Yangi Hilol" : "🌙 New Crescent";
    if (moonRatio <= 0.4) return locale === 'uz' ? "🌓 Yosh Hilol" : "🌓 Waxing Crescent";
    if (moonRatio <= 0.65) return locale === 'uz' ? "🌔 To'lishayotgan Oy" : "🌔 Half Moon";
    if (moonRatio <= 0.88) return locale === 'uz' ? "🌖 Ravshan Oy" : "🌖 Waxing Gibbous";
    return locale === 'uz' ? "🌕 Badr (To'lin Oy)" : "🌕 Full Moon (Badr)";
  }, [moonRatio, locale]);

  return (
    <div className="relative w-full max-w-lg select-none mx-auto">
      
      {/* Background Starlight Aura */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-amber-400/20 via-emerald-500/20 to-teal-400/20 rounded-[40px] blur-2xl pointer-events-none -z-10 animate-pulse" />

      {/* Story Selection Tabs (Yusuf, Fotima, Zubayr) */}
      <div className="flex items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-butter-200/90 dark:bg-pine-900/90 border-2 border-pine-800 shadow-sm w-full overflow-x-auto no-scrollbar">
          {SAMPLE_STORIES.map((story, idx) => {
            const isSelected = selectedStoryIndex === idx;
            const emoji = story.child_profile.gender === 'boy' ? (idx === 0 ? '👦' : '🌟') : '👧';
            return (
              <button
                key={story.id}
                onClick={() => handleSelectStory(idx)}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-black transition-all ${
                  isSelected
                    ? 'bg-pine-800 text-butter-200 dark:bg-butter-200 dark:text-pine-950 shadow-md border border-butter-300'
                    : 'text-pine-900 dark:text-butter-200 hover:bg-butter-300/60'
                }`}
              >
                <span>{emoji}</span>
                <span className="truncate">{story.child_profile.child_name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Masterpiece 3D Hardcover Book Shell */}
      <div className="relative rounded-[32px] p-3 sm:p-4 bg-gradient-to-br from-[#02332D] via-[#012520] to-[#001815] border-4 border-amber-300/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
        
        {/* Arabesque Gold Corner Filigree Ornaments */}
        <div className="absolute top-2 left-2 text-amber-300/80 text-xs pointer-events-none font-mono">✦ ──</div>
        <div className="absolute top-2 right-2 text-amber-300/80 text-xs pointer-events-none font-mono">── ✦</div>
        <div className="absolute bottom-2 left-2 text-amber-300/80 text-xs pointer-events-none font-mono">✦ ──</div>
        <div className="absolute bottom-2 right-2 text-amber-300/80 text-xs pointer-events-none font-mono">── ✦</div>

        {/* Golden Silk Bookmark Ribbon */}
        <div className="absolute -top-3 right-8 z-30 flex flex-col items-center pointer-events-none">
          <div className="w-4 h-9 bg-gradient-to-b from-amber-500 via-amber-400 to-amber-300 rounded-b shadow-md border-x border-b border-pine-900 flex items-center justify-center">
            <Star className="w-2.5 h-2.5 text-pine-950 fill-pine-950" />
          </div>
        </div>

        {/* Top Feature Switcher Tabs (3D Varaqlash / Ovozli) */}
        <div className="grid grid-cols-2 gap-2 mb-3 p-1 rounded-2xl bg-black/40 border border-amber-300/30 text-xs font-black text-butter-200">
          <button
            onClick={() => setActiveTab('read')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
              activeTab === 'read'
                ? 'bg-amber-400 text-pine-950 shadow-md scale-[1.02] border border-amber-200 font-extrabold'
                : 'hover:bg-white/10 text-butter-200/80'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{locale === 'uz' ? "📖 3D Kitob Varaqlash" : "📖 3D Flip Book"}</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
              activeTab === 'audio'
                ? 'bg-amber-400 text-pine-950 shadow-md scale-[1.02] border border-amber-200 font-extrabold'
                : 'hover:bg-white/10 text-butter-200/80'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{locale === 'uz' ? "🎙️ Ovozli Ertakchi" : "🎙️ Voice Audio"}</span>
          </button>
        </div>

        {/* 3D BOOK LEAF CONTAINER (Single Full-Page with Page Curl) */}
        <div 
          style={{ perspective: 1400 }}
          className="relative rounded-2xl overflow-hidden border-2 border-amber-300/40 bg-[#001D19] shadow-inner"
        >
          
          <AnimatePresence mode="wait" custom={direction}>
            {activeTab === 'read' && (
              <motion.div
                key={`leaf-${selectedStoryIndex}-${currentLeafIndex}`}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ transformStyle: 'preserve-3d' }}
                className="relative w-full h-[360px] sm:h-[390px] overflow-hidden"
              >
                
                {/* 1. TYPE = PURE FULL-PAGE IMAGE (Faqatgina to'liq surat!) */}
                {currentLeaf.type === 'image' && (
                  <div className="relative w-full h-full bg-[#001D19] flex flex-col justify-between p-4">
                    {/* The Full Artwork */}
                    <img
                      src={currentLeaf.image_url}
                      alt={currentLeaf.caption || "Story illustration"}
                      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                    />

                    {/* Top Leaf Indicator Pill */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-300/40 text-[10px] font-black text-amber-200 shadow-md flex items-center gap-1.5">
                        <ImageIcon className="w-3 h-3 text-amber-300" />
                        <span>{locale === 'uz' ? "Suratli Sahifa" : "Illustration Page"}</span>
                      </div>

                      <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-300/40 text-[10px] font-mono font-black text-amber-200">
                        {currentLeafIndex + 1} / {leaves.length}
                      </div>
                    </div>

                    {/* Bottom Caption Pill */}
                    <div className="relative z-10 self-start px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-amber-300/50 text-xs font-black text-amber-200 shadow-lg">
                      ✨ {currentLeaf.caption}
                    </div>
                  </div>
                )}

                {/* 2. TYPE = PURE FULL-PAGE TEXT (Faqatgina to'liq matn!) */}
                {currentLeaf.type === 'text' && (
                  <div className="w-full h-full bg-[#FFFDF5] dark:bg-[#012A25] p-6 sm:p-7 flex flex-col justify-between relative shadow-inner">
                    
                    {/* Top Bismillah Header */}
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-pine-800/15 dark:border-amber-300/20">
                        <span className="text-amber-600 dark:text-amber-300 font-serif text-base font-bold">﷽</span>
                        <span className="text-[11px] font-black uppercase tracking-wider text-pine-700 dark:text-amber-200">
                          {activeStory.title_uz}
                        </span>
                        <span className="text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full bg-butter-200 dark:bg-pine-800 text-pine-900 dark:text-butter-200 border border-pine-800/20">
                          {currentLeafIndex + 1} / {leaves.length}
                        </span>
                      </div>

                      {/* Scene Title Tag */}
                      <div className="mb-3">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50 inline-block">
                          📖 {currentLeaf.caption}
                        </span>
                      </div>

                      {/* Large, comfortable story text */}
                      <p className="text-sm sm:text-base text-pine-950 dark:text-butter-100 leading-relaxed font-medium">
                        {currentLeaf.text}
                      </p>
                    </div>

                    {/* Bottom Footnote */}
                    <div className="pt-3 border-t border-pine-800/10 dark:border-amber-300/20 flex items-center justify-between text-xs font-bold text-pine-600 dark:text-butter-300">
                      <span>{currentLeaf.subtext}</span>
                      <span className="text-amber-600 dark:text-amber-300 font-serif">◈ ◈ ◈</span>
                    </div>

                  </div>
                )}

                {/* 3. TYPE = BEDTIME DUA & REFLECTION */}
                {currentLeaf.type === 'dua' && (
                  <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-b from-[#012E29] to-[#001D19] text-white">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-amber-300/20 pb-2">
                        <div className="flex items-center gap-2 text-amber-300">
                          <Heart className="w-4 h-4 fill-amber-300" />
                          <span className="text-xs font-black uppercase tracking-wider">
                            {locale === 'uz' ? "Oqshom Duosi & Hikmat" : "Bedtime Dua"}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-200">
                          {currentLeafIndex + 1} / {leaves.length}
                        </span>
                      </div>

                      {/* Arabic Dua */}
                      <div className="p-3.5 rounded-xl bg-black/40 border border-amber-300/40 text-center">
                        <p className="text-base text-amber-200 font-serif leading-relaxed" dir="rtl">
                          {currentLeaf.arabic_dua}
                        </p>
                      </div>

                      {/* Uzbek Dua */}
                      <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-400/30">
                        <p className="text-[10px] font-black text-emerald-300 uppercase tracking-wide mb-1">
                          {locale === 'uz' ? "🤲 Bolajon Oqshom Duosi:" : "🤲 Bedtime Sleep Dua:"}
                        </p>
                        <p className="text-xs sm:text-sm text-butter-100 leading-relaxed font-medium">
                          {currentLeaf.dua}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 text-center text-xs font-bold text-amber-300/90">
                      ✨ {currentLeaf.lesson}
                    </div>
                  </div>
                )}

              </motion.div>
            )}

            {activeTab === 'audio' && (
              /* TAB 2: BEDTIME VOICE AUDIO PLAYER */
              <motion.div
                key="audio-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full p-6 flex flex-col justify-between bg-gradient-to-b from-[#012E29] to-[#001815] text-white h-[360px] sm:h-[390px]"
              >
                <div className="space-y-2 text-center pt-2">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-400/20 border-2 border-amber-300 flex items-center justify-center shadow-lg">
                    <Volume2 className="w-7 h-7 text-amber-300 animate-pulse" />
                  </div>
                  <h4 className="text-base font-black text-amber-200 font-display">
                    {locale === 'uz' ? `${activeStory.child_profile.child_name} uchun Ovozli Ertakchi` : `Bedtime Voice Narration for ${activeStory.child_profile.child_name}`}
                  </h4>
                  <p className="text-xs text-butter-200/80 max-w-xs mx-auto">
                    {locale === 'uz' ? "Mayin, tinchlantiruvchi oqshom ovozi bilan audio ertak" : "Calm and soothing voice for peaceful bedtime sleep"}
                  </p>
                </div>

                {/* Equalizer Visualizer Waves */}
                <div className="flex items-center justify-center gap-1.5 h-12 py-1">
                  {[16, 28, 42, 22, 35, 18, 32, 24, 38, 20, 30].map((height, i) => (
                    <motion.div
                      key={i}
                      animate={isPlayingAudio ? { 
                        height: [10, height, 12],
                        opacity: [0.6, 1, 0.6]
                      } : { height: 10, opacity: 0.4 }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.8 + (i % 4) * 0.2, 
                        ease: "easeInOut" 
                      }}
                      className="w-1.5 rounded-full bg-gradient-to-t from-amber-400 to-emerald-300"
                    />
                  ))}
                </div>

                {/* Player Controls */}
                <div className="space-y-3 pb-2">
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden border border-amber-300/30">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-mono text-amber-200">01:15</span>
                    <button
                      onClick={handleAudioPlayToggle}
                      className="flex items-center gap-2 px-6 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-pine-950 font-black text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      {isPlayingAudio ? (
                        <>
                          <Pause className="w-4 h-4 fill-pine-950" />
                          <span>{locale === 'uz' ? "Pauza" : "Pause"}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-pine-950" />
                          <span>{locale === 'uz' ? "Tinglash" : "Play Story"}</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] font-mono text-amber-200">03:20</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ========================================================================= */}
          {/* 🌙 NURLI HILOL (BOSHIDA YANGI OY -> OXIRIDA TO'LIN OY BO'LISHI) 🌕 */}
          {/* ========================================================================= */}
          <div className="px-4 py-3 bg-gradient-to-r from-pine-950 via-[#012520] to-pine-950 border-t border-amber-300/40">
            
            {/* Celestial Orbit Track Header */}
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-200/90 mb-2 px-1">
              <span className="flex items-center gap-1.5">
                <span className="font-display tracking-wide text-amber-300 font-extrabold">{moonPhaseName}</span>
              </span>
              
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-[10px] font-mono font-black text-amber-300">
                <span>{currentLeafIndex + 1}</span>
                <span className="text-amber-200/50">/</span>
                <span>{leaves.length}</span>
              </div>
            </div>

            {/* The Starlight Orbit Bar */}
            <div className="flex items-center gap-2">
              
              {/* Prev Crescent Button */}
              <button
                onClick={goToPrevPage}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-amber-400 hover:text-pine-950 text-amber-200 border border-amber-300/40 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-90 shrink-0"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Ultra-Clean Orbit Track where Only the Moon Glides */}
              <div 
                ref={orbitTrackRef}
                className="relative flex-1 h-8 rounded-full bg-black/50 border border-amber-300/30 shadow-inner flex items-center px-2 cursor-pointer overflow-visible"
                onClick={(e) => {
                  const rect = orbitTrackRef.current?.getBoundingClientRect();
                  if (rect) {
                    const clickX = e.clientX - rect.left - 12;
                    const usableWidth = rect.width - 24;
                    const ratio = Math.max(0, Math.min(1, clickX / usableWidth));
                    const targetIndex = Math.round(ratio * (leaves.length - 1));
                    goToLeaf(targetIndex);
                  }
                }}
              >
                {/* THE DYNAMIC WAXING MOON (Boshida Yangi Hilol 🌙 -> Oxirida To'lin Oy 🌕) */}
                <motion.div
                  animate={{
                    left: `calc(${moonProgressPercent}% * 0.88 + 2px)`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 220,
                    damping: 24,
                  }}
                  className="absolute z-20 flex items-center justify-center cursor-grab active:cursor-grabbing transform active:scale-110"
                >
                  <MoonPhaseOrb progress={moonRatio} />
                </motion.div>
              </div>

              {/* Next Crescent Button */}
              <button
                onClick={goToNextPage}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-amber-400 hover:text-pine-950 text-amber-200 border border-amber-300/40 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-90 shrink-0"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

          </div>

          {/* Read Complete Story Button */}
          <div className="p-2.5 bg-black/60 border-t border-amber-300/30">
            <Link
              href={`/story/${activeStory.id}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-pine-950 text-xs sm:text-sm font-black transition-all shadow-lg hover:scale-[1.01] active:scale-98 border border-amber-200"
            >
              <BookOpen className="w-4 h-4" />
              <span>
                {locale === 'uz' 
                  ? "To'liq ertakni o'qish (8 sahifa + Ibratli Suhbat)" 
                  : "Read Complete Storybook (8 pages + Reflection)"}
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
