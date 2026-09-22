'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Sparkles, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface AudioNarrationBarProps {
  currentText: string;
  audioUrl?: string;
  currentPage: number;
  totalPages: number;
}

export default function AudioNarrationBar({ currentText, audioUrl, currentPage, totalPages }: AudioNarrationBarProps) {
  const { locale, isPlayingAudio, setIsPlayingAudio } = useAppStore();
  const [playbackRate, setPlaybackRate] = useState(1);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize SpeechSynthesis and load available voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const updateVoices = () => {
        if (synthRef.current) {
          const voices = synthRef.current.getVoices();
          if (voices.length > 0) {
            setAvailableVoices(voices);
          }
        }
      };

      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }, []);

  // Sync audio element source when audioUrl or currentPage changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        if (isPlayingAudio) {
          audioRef.current.play().catch(() => {
            speakText(currentText);
          });
        }
      } else if (isPlayingAudio) {
        speakText(currentText);
      }
    } else if (isPlayingAudio && !audioUrl) {
      speakText(currentText);
    }
  }, [audioUrl, currentPage]);

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume(); // Unblock Chrome speech pause lock

      if (!text || !text.trim()) return;

      const cleanText = text.replace(/[*_#«»"]/g, ' ').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = playbackRate;

      const voices = availableVoices.length > 0 
        ? availableVoices 
        : (window.speechSynthesis.getVoices() || []);

      if (locale === 'uz') {
        utterance.lang = 'uz-UZ';
        // Match Uzbek, Turkish or gentle female/male voice
        const uzVoice = voices.find(v => v.lang.startsWith('uz') || v.lang.startsWith('tr')) 
          || voices.find(v => v.name.toLowerCase().includes('uzbek') || v.name.toLowerCase().includes('turkish'))
          || voices[0];
        if (uzVoice) utterance.voice = uzVoice;
      } else {
        utterance.lang = 'en-US';
        const enVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
        if (enVoice) utterance.voice = enVoice;
      }

      utterance.onstart = () => {
        setIsLoadingAudio(false);
        setIsPlayingAudio(true);
      };

      utterance.onend = () => {
        setIsPlayingAudio(false);
      };

      utterance.onerror = (e) => {
        console.warn("TTS notice:", e);
        setIsPlayingAudio(false);
        setIsLoadingAudio(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    } catch (err) {
      console.error("speakText error:", err);
      setIsPlayingAudio(false);
      setIsLoadingAudio(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlayingAudio) {
      // Pause active audio or synthesis
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      setIsLoadingAudio(false);
      return;
    }

    // If pre-recorded Studio MP3 is available
    if (audioUrl && audioRef.current) {
      setIsLoadingAudio(true);
      audioRef.current.playbackRate = playbackRate;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsLoadingAudio(false);
            setIsPlayingAudio(true);
          })
          .catch((err) => {
            console.warn("Studio audio failed, falling back to TTS:", err);
            setIsLoadingAudio(false);
            speakText(currentText);
          });
      }
    } else {
      // Use Live AI Speech Synthesis (TTS)
      speakText(currentText);
    }
  };

  const cycleSpeed = () => {
    const nextRate = playbackRate === 1 ? 1.2 : playbackRate === 1.2 ? 0.8 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
    if (isPlayingAudio) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && !audioUrl) {
        window.speechSynthesis.cancel();
        speakText(currentText);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
    };
  }, []);

  return (
    <div className="bg-[#1E1B4B] text-white px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-2xl shadow-xl border border-amber-400/30 flex items-center justify-between gap-2 sm:gap-4">
      {/* Hidden Audio Element for High Quality Studio Audio */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="auto"
        onEnded={() => setIsPlayingAudio(false)}
        onError={() => {
          if (isPlayingAudio) {
            speakText(currentText);
          }
        }}
      />

      {/* Left info & animated waveform */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold text-amber-300 truncate">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">
              {audioUrl 
                ? (locale === 'uz' ? "🎙️ Dublyaj" : "🎙️ Voice Audio")
                : (locale === 'uz' ? "AI Ovoz" : "Bedtime AI")}
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            {locale === 'uz' ? `${currentPage}-sahifa o'qilmoqda` : `Reading page ${currentPage}`}
          </p>
        </div>
      </div>

      {/* Animated Sound Wave Visualizer when playing */}
      {isPlayingAudio && (
        <div className="hidden md:flex items-center gap-1 h-6 px-4">
          {[40, 70, 90, 60, 100, 50, 80, 60, 90, 40].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-amber-400 rounded-full animate-pulse"
              style={{
                height: `${h}%`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: '0.8s',
              }}
            />
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
        {/* Speed toggle */}
        <button
          type="button"
          onClick={cycleSpeed}
          className="px-2.5 py-1 rounded-lg bg-indigo-900/80 hover:bg-indigo-800 text-[11px] font-bold text-amber-300 border border-indigo-700 transition-colors cursor-pointer"
          title="Tezlik / Speed"
        >
          {playbackRate}x
        </button>

        {/* Play / Pause button */}
        <button
          type="button"
          onClick={handlePlayPause}
          disabled={isLoadingAudio}
          className="w-11 h-11 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer disabled:opacity-50"
          aria-label={isPlayingAudio ? "Pause" : "Play"}
        >
          {isLoadingAudio ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
          ) : isPlayingAudio ? (
            <Pause className="w-5 h-5 fill-slate-950" />
          ) : (
            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
          )}
        </button>
      </div>

    </div>
  );
}
