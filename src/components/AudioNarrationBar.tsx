'use client';

import React from 'react';
import { Mic, Headphones, Sparkles, Volume2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface AudioNarrationBarProps {
  currentText?: string;
  nextText?: string;
  audioUrl?: string;
  nextAudioUrl?: string;
  currentPage?: number;
  totalPages?: number;
}

export default function AudioNarrationBar({
  currentPage = 1,
  totalPages = 8
}: AudioNarrationBarProps) {
  const { locale, setIsAudioComingSoonOpen } = useAppStore();

  return (
    <div 
      onClick={() => setIsAudioComingSoonOpen(true)}
      className="bg-gradient-to-r from-[#1E1B4B] via-[#2A1B54] to-[#1E1B4B] text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl shadow-xl border border-amber-400/40 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer hover:border-amber-400/80 hover:shadow-amber-500/10 transition-all duration-300 group select-none"
    >
      {/* Left Icon & Info */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shrink-0 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
          <Mic className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-extrabold text-amber-300 font-display truncate">
              {locale === 'uz' ? "🎙️ Jonli Studiya Ovozli Ertaklar" : "🎙️ Studio Voice Storytelling"}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider shrink-0">
              {locale === 'uz' ? "Tez Kunda" : "Coming Soon"}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-300 truncate">
            {locale === 'uz' 
              ? "Mehrli ona va suxandon aktyorlar ovozida jonli ijro tayyorlanmoqda..." 
              : "Live studio narration by gentle mothers & voice actors coming soon..."}
          </p>
        </div>
      </div>

      {/* Right Action button */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsAudioComingSoonOpen(true);
          }}
          className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/30 flex items-center gap-1.5 transition-all group-hover:scale-105 cursor-pointer"
        >
          <Headphones className="w-3.5 h-3.5 text-slate-950" />
          <span>{locale === 'uz' ? "Batafsil" : "Preview"}</span>
        </button>
      </div>
    </div>
  );
}
