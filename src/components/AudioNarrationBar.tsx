'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, 
  Headphones, Loader2, Mic, Music, AlertCircle
} from 'lucide-react';
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
  currentText = '',
  nextText = '',
  audioUrl,
  currentPage = 1,
  totalPages = 8
}: AudioNarrationBarProps) {
  const { locale, setIsAudioComingSoonOpen, isPlayingAudio, setIsPlayingAudio } = useAppStore();
  const isUz = locale === 'uz';

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [dynamicAudioSrc, setDynamicAudioSrc] = useState<string | null>(null);
  const [activeVoice, setActiveVoice] = useState<'mother' | 'narrator'>('mother');

  // Determine active source: explicit audioUrl from storybook or dynamically synthesized audio
  const effectiveAudioSrc = audioUrl || dynamicAudioSrc;

  // Handle page change: stop current audio or switch source smoothly
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsPlayingAudio(false);
      setCurrentTime(0);
    }
    setDynamicAudioSrc(null);
  }, [currentPage, audioUrl, setIsPlayingAudio]);

  // Audio time update listener
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setIsPlayingAudio(false);
      setCurrentTime(0);
    };
    const onError = () => {
      setIsPlaying(false);
      setIsPlayingAudio(false);
      setIsLoadingAudio(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [setIsPlayingAudio]);

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    // If currently playing, pause
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsPlayingAudio(false);
      return;
    }

    // If we have an existing audio source, play it directly
    if (effectiveAudioSrc) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setIsPlayingAudio(true);
      } catch (err) {
        console.warn('Playback error:', err);
      }
      return;
    }

    // Otherwise, generate audio on-the-fly using Edge TTS API for the current page text
    if (!currentText.trim()) return;

    setIsLoadingAudio(true);
    try {
      const res = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentText,
          voiceId: activeVoice,
          locale: locale || 'uz',
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        setDynamicAudioSrc(objectUrl);

        if (audioRef.current) {
          audioRef.current.src = objectUrl;
          await audioRef.current.play();
          setIsPlaying(true);
          setIsPlayingAudio(true);
        }
      } else {
        // Fallback: Web Speech API if server TTS not reachable
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(currentText);
          utterance.lang = isUz ? 'uz-UZ' : 'en-US';
          window.speechSynthesis.speak(utterance);
          setIsPlaying(true);
          utterance.onend = () => setIsPlaying(false);
        }
      }
    } catch (err) {
      console.warn('Audio generation notice:', err);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsPlayingAudio(true);
        }).catch(() => {});
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMuted = !isMuted;
      audioRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gradient-to-r from-[#1E1B4B] via-[#2A1B54] to-[#1E1B4B] text-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl border border-amber-400/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-all duration-300 select-none">
      
      {/* Hidden HTML5 Audio Element */}
      <audio 
        ref={audioRef} 
        src={effectiveAudioSrc || undefined} 
        preload="metadata" 
      />

      {/* Left: Play Control & Info */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        
        {/* Big Glow Play / Pause Button */}
        <button
          type="button"
          onClick={togglePlayPause}
          disabled={isLoadingAudio}
          className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 hover:from-amber-400 hover:to-amber-300 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer focus:outline-none"
          title={isPlaying ? (isUz ? "To'xtatish" : "Pause") : (isUz ? "Ertakni ovozda tinglash" : "Play Narration")}
        >
          {isLoadingAudio ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5 text-slate-950 fill-slate-950" />
          ) : (
            <Play className="w-5 h-5 text-slate-950 fill-slate-950 ml-0.5" />
          )}

          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          )}
        </button>

        {/* Text Details & Timeline */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs sm:text-sm font-extrabold text-amber-300 font-display truncate">
                {isPlaying 
                  ? (isUz ? "🎙️ Ertak jaranglamoqda..." : "🎙️ Playing Bedtime Narration...")
                  : (isUz ? "🎙️ Qiroat bilan tinglash" : "🎙️ Listen to Story Narration")}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black tracking-wider shrink-0">
                {currentPage}-sahifa
              </span>
            </div>

            {duration > 0 && (
              <span className="text-[11px] font-mono text-amber-200/80 font-bold shrink-0">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            )}
          </div>

          {/* Scrubber / Progress Bar */}
          <div 
            onClick={(e) => {
              if (audioRef.current && duration > 0) {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newPct = clickX / rect.width;
                audioRef.current.currentTime = newPct * duration;
                setCurrentTime(newPct * duration);
              }
            }}
            className="w-full h-2 rounded-full bg-white/10 overflow-hidden cursor-pointer hover:h-2.5 transition-all relative"
          >
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>

      {/* Right Controls: Restart, Mute & Studio Info */}
      <div className="flex items-center justify-end gap-2 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-white/10">
        
        {/* Restart Button */}
        <button
          type="button"
          onClick={handleRestart}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 transition-colors"
          title={isUz ? "Boshidan qo'yish" : "Restart"}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Mute Button */}
        <button
          type="button"
          onClick={toggleMute}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 transition-colors"
          title={isMuted ? (isUz ? "Ovozni yoqish" : "Unmute") : (isUz ? "Ovozsiz qilish" : "Mute")}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Live Studio Actor Teaser Modal Trigger */}
        <button
          type="button"
          onClick={() => setIsAudioComingSoonOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-extrabold flex items-center gap-1.5 transition-all hover:scale-105 shrink-0"
          title={isUz ? "Professional studiya aktyorlari ovozi haqida" : "About studio voice actors"}
        >
          <Headphones className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">{isUz ? "Studiya" : "Studio"}</span>
        </button>

      </div>

    </div>
  );
}
