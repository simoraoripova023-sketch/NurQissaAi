'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Heart, MessageCircle, Target, Sparkles, BookOpen, Check, Mic, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { StoryReflection, StoryBook } from '@/lib/types';
import ParentVoiceNoteModal from './ParentVoiceNoteModal';
import StoryQuizModal from './StoryQuizModal';
import confetti from 'canvas-confetti';

interface ReflectionModalProps {
  reflection: StoryReflection;
  story: StoryBook;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReflectionModal({ reflection, story, isOpen, onClose }: ReflectionModalProps) {
  const { 
    locale, 
    setIsQuizOpen, 
    setActiveQuizStory, 
    familyNotes, 
    addNurCoins, 
    addXP 
  } = useAppStore();
  const t = translations[locale];

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const [isTaskDone, setIsTaskDone] = useState(false);

  if (!isOpen) return null;

  const lesson = locale === 'uz' ? reflection.todays_lesson_uz : reflection.todays_lesson_en;
  const dua = locale === 'uz' ? reflection.little_dua_uz : reflection.little_dua_en;
  const questions = locale === 'uz' ? reflection.discussion_questions_uz : reflection.discussion_questions_en;
  const task = locale === 'uz' ? reflection.good_deed_task_uz : reflection.good_deed_task_en;

  const handleStartQuiz = () => {
    setActiveQuizStory(story);
    setIsQuizOpen(true);
  };

  const handleToggleTask = () => {
    if (!isTaskDone) {
      setIsTaskDone(true);
      addNurCoins(30);
      addXP(50);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    } else {
      setIsTaskDone(false);
    }
  };

  return (
    <>
      <div className="no-print print:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#FDFBF7] w-full max-w-2xl rounded-3xl border border-amber-300/80 shadow-2xl overflow-hidden my-8"
        >
          {/* Modal Header */}
          <div className="bg-[#1E1B4B] text-amber-100 p-6 flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <Moon className="w-48 h-48 text-amber-400" />
            </div>

            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌙</span>
                <h3 className="text-xl font-bold text-amber-300 font-display">
                  {t.reflectionTab}
                </h3>
              </div>
              <p className="text-xs text-slate-300">
                {locale === 'uz' ? "Har oqshomgi ibratli xulosa, duo va oilaviy suhbat" : "Bedtime moral takeaway, gentle prayer, and family talk"}
              </p>
            </div>

            <button
              onClick={onClose}
              className="relative z-10 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Quick Quiz Banner CTA */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 text-slate-950 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center text-amber-700 shadow-sm">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold">{t.storyQuizTitle}</h4>
                  <p className="text-[11px] font-medium text-slate-900">{t.storyQuizSub}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleStartQuiz}
                className="px-4 py-2 rounded-xl bg-[#1E1B4B] text-amber-300 font-bold text-xs hover:bg-slate-900 transition-all shadow-sm shrink-0"
              >
                {locale === 'uz' ? "Boshlash ➔" : "Start ➔"}
              </button>
            </div>

            {/* 1. Today's Lesson */}
            <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{t.todaysLesson}</span>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                {lesson}
              </p>
            </div>

            {/* 2. Today's Little Prayer / Dua */}
            <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-200/80 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <span>🤲</span>
                <span>{t.littleDua}</span>
              </div>

              {/* Arabic script if provided */}
              {reflection.arabic_dua && (
                <p className="text-right font-serif text-lg text-emerald-950 leading-loose py-1 px-3 bg-white/60 rounded-xl border border-emerald-100" dir="rtl">
                  {reflection.arabic_dua}
                </p>
              )}

              <p className="text-sm text-emerald-900 italic leading-relaxed">
                "{dua}"
              </p>
            </div>

            {/* 3. 3 Parent-Child Discussion Questions with Voice Memo / Note Option */}
            <div className="bg-indigo-50/80 rounded-2xl p-5 border border-indigo-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
                  <MessageCircle className="w-4 h-4 text-indigo-600" />
                  <span>{t.discussionQuestions}</span>
                </div>
                <span className="text-[11px] text-indigo-700 font-semibold">
                  {locale === 'uz' ? "Ovozli / Yozma xotira qoldiring 🎙️" : "Record voice memo 🎙️"}
                </span>
              </div>

              <ul className="space-y-3">
                {questions.map((q, idx) => {
                  const hasSavedNote = familyNotes.some(
                    (n) => n.storyId === story.id && n.questionIndex === idx
                  );

                  return (
                    <li key={idx} className="p-3.5 rounded-2xl bg-white/80 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-slate-800">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-snug font-medium">{q}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedQuestionIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                          hasSavedNote
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-900'
                        }`}
                      >
                        {hasSavedNote ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{locale === 'uz' ? "Xotira saqlangan" : "Memory Saved"}</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{locale === 'uz' ? "Ovoz yozish / Yozish" : "Record Note"}</span>
                          </>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 4. Tomorrow's Good Deed Task */}
            <div className="bg-rose-50/80 rounded-2xl p-5 border border-rose-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-950 font-bold text-sm">
                  <Target className="w-4 h-4 text-rose-600" />
                  <span>{t.goodDeedTask}</span>
                </div>
                <Link
                  href="/missions"
                  className="text-[11px] font-bold text-rose-700 hover:underline"
                >
                  {locale === 'uz' ? "Barcha vazifalar kundaligi ➔" : "View All Missions ➔"}
                </Link>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/90 border border-rose-200">
                <button
                  type="button"
                  onClick={handleToggleTask}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isTaskDone
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'border-2 border-slate-300 hover:border-rose-400 bg-slate-50'
                  }`}
                >
                  {isTaskDone && <Check className="w-4 h-4 stroke-[3]" />}
                </button>
                <div className="space-y-1">
                  <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isTaskDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {task}
                  </p>
                  {isTaskDone && (
                    <span className="text-[11px] font-bold text-emerald-700">
                      🎉 {locale === 'uz' ? "Vazifa qabul qilindi! +30 Nur Tangalari" : "Task registered! +30 Nur Coins"}
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-6 bg-white border-t border-amber-100 flex items-center justify-between">
            <Link
              href="/missions"
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>🎯 {t.missions}</span>
            </Link>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              {locale === 'uz' ? "Tushunarli, orom oling! ✨" : "Got it, sweet dreams! ✨"}
            </button>
          </div>

        </motion.div>
      </div>

      {/* Voice / Text Note Modal for Discussion Questions */}
      {selectedQuestionIndex !== null && (
        <ParentVoiceNoteModal
          storyId={story.id}
          questionIndex={selectedQuestionIndex}
          questionText={questions[selectedQuestionIndex]}
          isOpen={true}
          onClose={() => setSelectedQuestionIndex(null)}
        />
      )}

      {/* Story Quiz Modal */}
      <StoryQuizModal />
    </>
  );
}
