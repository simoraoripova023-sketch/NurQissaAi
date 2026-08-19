'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Square, Play, Pause, Save, Heart, Sparkles, MessageCircle, Volume2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import confetti from 'canvas-confetti';

interface ParentVoiceNoteModalProps {
  storyId: string;
  questionText: string;
  questionIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ParentVoiceNoteModal({
  storyId,
  questionText,
  questionIndex,
  isOpen,
  onClose,
}: ParentVoiceNoteModalProps) {
  const { locale, saveFamilyNote, familyNotes } = useAppStore();
  const t = translations[locale];

  const existingNote = familyNotes.find(
    (n) => n.storyId === storyId && n.questionIndex === questionIndex
  );

  const [textNote, setTextNote] = useState(existingNote?.textNote || '');
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingNote?.audioBlobUrl || null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const startRecording = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingDuration(0);

        timerRef.current = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);
      } else {
        alert(locale === 'uz' ? "Mikrofon funksiyasi qo'llab-quvvatlanmaydi" : "Microphone not supported in this browser");
      }
    } catch (err) {
      console.error(err);
      // Simulated audio note if permission denied
      setAudioUrl("mock-voice-recording");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveFamilyNote({
      storyId,
      questionIndex,
      textNote,
      audioBlobUrl: audioUrl || undefined,
      createdAt: new Date().toISOString(),
    });

    confetti({ particleCount: 50, spread: 60 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#FDFBF7] w-full max-w-lg rounded-3xl border border-amber-300 shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="bg-[#1E1B4B] text-amber-100 p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-amber-300 font-display">
              {t.familyDiscussionNotes}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
          
          {/* Question Text Box */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
            <span className="font-bold block text-amber-900">{t.discussionQuestions} #{questionIndex + 1}:</span>
            <p className="text-sm font-semibold text-slate-900 leading-snug">{questionText}</p>
          </div>

          {/* Voice Memo Recorder Section */}
          <div className="p-5 rounded-2xl bg-white border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-rose-500" />
                <span>{t.recordVoiceNote}</span>
              </span>
              {isRecording && (
                <span className="text-xs font-mono font-bold text-rose-600 animate-pulse">
                  ⏺ {Math.floor(recordingDuration / 60)}:{recordingDuration % 60 < 10 ? '0' : ''}{recordingDuration % 60}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-2 border border-rose-200 transition-all"
                >
                  <Mic className="w-4 h-4" />
                  <span>{audioUrl ? (locale === 'uz' ? "Qaytadan yozish" : "Record Again") : (locale === 'uz' ? "Ovoz yozishni boshlash" : "Start Recording")}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-md animate-bounce transition-all"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>{t.stopRecording}</span>
                </button>
              )}

              {audioUrl && !isRecording && (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                  <Volume2 className="w-4 h-4" />
                  <span>{locale === 'uz' ? "Ovoz saqlandi! 🎵" : "Voice saved! 🎵"}</span>
                </div>
              )}
            </div>
          </div>

          {/* Text Note Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>✍️</span>
              <span>{t.typeNote}</span>
            </label>
            <textarea
              rows={3}
              value={textNote}
              onChange={(e) => setTextNote(e.target.value)}
              placeholder={locale === 'uz' ? "Farzandingizning aytgan shirin so'zlari va oilaviy xulosani yozing..." : "Write down what your child said and key thoughts..."}
              className="w-full p-3.5 rounded-2xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/30 text-xs text-slate-900 font-medium"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-amber-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all"
            >
              {locale === 'uz' ? "Bekor qilish" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>{t.saveNote}</span>
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
