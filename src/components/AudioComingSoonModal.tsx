'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, Sparkles, Heart, Mic, Headphones, 
  X, CheckCircle2, Music, Clock
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function AudioComingSoonModal() {
  const { locale, isAudioComingSoonOpen, setIsAudioComingSoonOpen } = useAppStore();

  if (!isAudioComingSoonOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAudioComingSoonOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-gradient-to-b from-[#1E1B4B] via-[#17143D] to-[#0F0D2E] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-400/40 overflow-hidden"
        >
          {/* Decorative ambient lights */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Close button */}
          <button
            onClick={() => setIsAudioComingSoonOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer z-10"
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Badge */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/30 text-slate-950">
                <Mic className="w-10 h-10 animate-bounce" style={{ animationDuration: '2s' }} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-2 border-[#1E1B4B] flex items-center justify-center text-white shadow">
                <Headphones className="w-4 h-4" />
              </div>
            </div>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{locale === 'uz' ? "Tez Kunda Taqdim Etiladi" : "Coming Very Soon"}</span>
            </div>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              {locale === 'uz' ? "🎙️ Jonli Studiya Ovozli Ertaklar" : "🎙️ Studio Voice Storytelling"}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              {locale === 'uz'
                ? "Aziz ota-onalar va bolajonlar! Farzandingiz ertaklarni tinglab mehr va xotirjamlik his qilishi uchun, har bir qissa professional dublyaj ustalari va mehribon onalar tomonidan jonli yozilmoqda."
                : "Dear parents and little ones! To give your child the warmest storytelling experience, every bedtime tale is being recorded by professional voice actors and gentle maternal voices."}
            </p>

            {/* What to expect list */}
            <div className="w-full bg-white/5 rounded-2xl p-4 border border-white/10 text-left space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-200">
                    {locale === 'uz' ? "🌸 Jonli Mehribon Ona Ovozi" : "🌸 Gentle Motherly Voice"}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {locale === 'uz' ? "Uyqu oldidan xotirjamlik va samimiyat ulashuvchi mayin ohang" : "Soothing bedtime narration filled with love"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-200">
                    {locale === 'uz' ? "🎙️ Professional Dublyaj Suxandoni" : "🎙️ Professional Voice Actor"}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {locale === 'uz' ? "Dona-dona, chiroyli va ibratli hikoya uslubi" : "Crystal clear, expressive theatrical storytelling"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-200">
                    {locale === 'uz' ? "🌙 Mayin va Sehrli Fon Sadolari" : "🌙 Ambient Bedtime Melodies"}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {locale === 'uz' ? "Farzandingiz tasavvurini boyituvchi sokin tovushlar" : "Calming background atmosphere for sweet dreams"}
                  </p>
                </div>
              </div>
            </div>

            {/* Readiness progress */}
            <div className="w-full space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  {locale === 'uz' ? "Ovoz yozish jarayoni:" : "Studio recording:"}
                </span>
                <span className="text-emerald-400 font-bold">90% {locale === 'uz' ? "Tayyor" : "Ready"}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 w-[90%]"></div>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={() => setIsAudioComingSoonOpen(false)}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{locale === 'uz' ? "Tushundim, intizorlik bilan kutamiz! ✨" : "Got it, excited to hear it! ✨"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
