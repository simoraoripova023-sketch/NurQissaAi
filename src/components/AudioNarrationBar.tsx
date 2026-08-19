'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';
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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize audio element and synth
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
      }
    }
  }, []);

  // Sync audio source when audioUrl changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        if (isPlayingAudio) {
          audioRef.current.play().catch(() => setIsPlayingAudio(false));
        }
      }
    } else if (synthRef.current && isPlayingAudio && !audioUrl) {
      speakText(currentText);
    }
  }, [audioUrl, currentPage]);

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackRate;
    const voices = synthRef.current.getVoices();
    const langPrefix = locale === 'uz' ? 'tr' : 'en';
    const selectedVoice = voices.find(v => v.lang.startsWith(langPrefix)) || voices[0];
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handlePlayPause = () => {
    if (audioUrl && audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current.playbackRate = playbackRate;
        audioRef.current.play().then(() => {
          setIsPlayingAudio(true);
        }).catch((err) => {
          console.error("Audio playback error:", err);
          setIsPlayingAudio(false);
        });
      }
    } else {
      if (isPlayingAudio) {
        if (synthRef.current) synthRef.current.cancel();
        setIsPlayingAudio(false);
      } else {
        speakText(currentText);
      }
    }
  };

  const cycleSpeed = () => {
    const nextRate = playbackRate === 1 ? 1.2 : playbackRate === 1.2 ? 0.8 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  // Clean up
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      setIsPlayingAudio(false);
    };
  }, []);

  return (
    <div className="bg-[#1E1B4B] text-white px-4 sm:px-6 py-3.5 rounded-2xl shadow-xl border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
      {/* Hidden Audio Element for High Quality Studio Audio */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="auto"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onEnded={() => setIsPlayingAudio(false)}
        onError={() => setIsPlayingAudio(false)}
      />

      {/* Left info & animated waveform */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
          <Volume2 className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {audioUrl 
                ? (locale === 'uz' ? "🎙️ Jonli Dublyaj & AI Ovoz" : "🎙️ Studio Voice Narration")
                : (locale === 'uz' ? "Ovozli Ertakchi (TTS)" : "Bedtime Voice Narration")}
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
          onClick={cycleSpeed}
          className="px-2.5 py-1 rounded-lg bg-indigo-900/80 hover:bg-indigo-800 text-[11px] font-bold text-amber-300 border border-indigo-700 transition-colors"
          title="Tezlik / Speed"
        >
          {playbackRate}x
        </button>

        {/* Play / Pause button */}
        <button
          onClick={handlePlayPause}
          className="w-11 h-11 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all shrink-0"
          aria-label={isPlayingAudio ? "Pause" : "Play"}
        >
          {isPlayingAudio ? (
            <Pause className="w-5 h-5 fill-slate-950" />
          ) : (
            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
          )}
        </button>
      </div>

    </div>
  );
}
