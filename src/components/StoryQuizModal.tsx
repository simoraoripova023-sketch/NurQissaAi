'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, HelpCircle, CheckCircle2, XCircle, Sparkles, Trophy, 
  ArrowRight, RotateCcw, Award, Check, BookOpen 
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { SAMPLE_QUIZZES } from '@/lib/missionsData';
import { QuizQuestion } from '@/lib/types';
import confetti from 'canvas-confetti';

interface AnswerRecord {
  selectedOptionId: string;
  isCorrect: boolean;
}

export default function StoryQuizModal() {
  const { 
    locale, 
    isQuizOpen, 
    setIsQuizOpen, 
    activeQuizStory, 
    addNurCoins, 
    addXP 
  } = useAppStore();
  const t = translations[locale];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, AnswerRecord>>({});
  const [isFinished, setIsFinished] = useState(false);

  if (!isQuizOpen || !activeQuizStory) return null;

  const defaultQuestions = SAMPLE_QUIZZES[activeQuizStory.id] || SAMPLE_QUIZZES["aqilli-bola-yusuf"];
  const questions: QuizQuestion[] = (activeQuizStory.quiz && activeQuizStory.quiz.length > 0) 
    ? activeQuizStory.quiz 
    : defaultQuestions;
  const currentQ = questions[currentQuestionIndex];

  // Calculate correct answers precisely
  const totalQuestions = questions.length;
  const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  const handleSelectOption = (optionId: string) => {
    if (isChecked) return; // Prevent multiple clicks during transition
    
    setSelectedOptionId(optionId);
    setIsChecked(true);

    const selected = currentQ.options.find((o) => o.id === optionId);
    const isAnsCorrect = !!selected?.isCorrect;

    const updatedAnswers = {
      ...userAnswers,
      [currentQuestionIndex]: {
        selectedOptionId: optionId,
        isCorrect: isAnsCorrect
      }
    };
    setUserAnswers(updatedAnswers);

    if (isAnsCorrect) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    }

    // Automatically transition to next question after 1.4 seconds
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOptionId(null);
        setIsChecked(false);
      } else {
        // Finished quiz!
        const finalCorrectCount = Object.values(updatedAnswers).filter(a => a.isCorrect).length;
        const earnedCoins = finalCorrectCount * 25;
        const earnedXP = finalCorrectCount * 50;

        if (earnedCoins > 0) {
          addNurCoins(earnedCoins);
          addXP(earnedXP);
        }

        if (finalCorrectCount === totalQuestions) {
          confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
        } else {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        }

        setIsFinished(true);
      }
    }, 1400);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsChecked(false);
    setUserAnswers({});
    setIsFinished(false);
  };

  const handleClose = () => {
    setIsQuizOpen(false);
    setTimeout(() => {
      handleRestartQuiz();
    }, 300);
  };

  const selectedOpt = currentQ?.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="no-print print:hidden fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-[#FFFDF9] dark:bg-[#00221e] w-full max-w-xl rounded-3xl border border-amber-300 dark:border-emerald-700 shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="bg-[#1E1B4B] dark:bg-[#001714] text-amber-100 p-5 sm:p-6 flex items-center justify-between border-b border-amber-300/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-amber-300 font-display">
                {t.storyQuizTitle}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-1">
                {activeQuizStory.child_profile.child_name} • {locale === 'uz' ? activeQuizStory.title_uz : activeQuizStory.title_en}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7">
          {isFinished ? (
            /* FINAL RESULTS REVIEW SCREEN */
            <div className="space-y-6">
              
              {/* Top Result Banner */}
              <div className="text-center space-y-3 py-2">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-300 to-emerald-400 p-1 mx-auto shadow-lg shadow-amber-500/20">
                  <div className="w-full h-full bg-[#1E1B4B] rounded-[22px] flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-amber-300 animate-bounce" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-2xl font-black text-[#1E1B4B] dark:text-amber-200 font-display">
                    {scorePercent === 100 
                      ? (locale === 'uz' ? "🏆 A'lo Natija! Mukammal!" : "🏆 Perfect Score! Brilliant!")
                      : scorePercent >= 60
                      ? (locale === 'uz' ? "🌟 Juda Yaxshi Natija!" : "🌟 Great Job!")
                      : (locale === 'uz' ? "💪 Yaxshi Harakat!" : "💪 Good Effort!")}
                  </h4>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {locale === 'uz'
                      ? `Siz ${totalQuestions} ta savoldan ${correctCount} tasiga to'g'ri javob berdingiz (${scorePercent}%).`
                      : `You answered ${correctCount} out of ${totalQuestions} questions correctly (${scorePercent}%).`}
                  </p>
                </div>

                {/* Score & Rewards Pill */}
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-amber-50 dark:bg-emerald-950 border border-amber-300 dark:border-emerald-700 text-amber-950 dark:text-amber-200 font-bold text-sm shadow-sm">
                  <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>+{correctCount * 25} {t.nurCoins}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span>+{correctCount * 50} {t.xpPoints}</span>
                  </span>
                </div>
              </div>

              {/* Question-by-Question Review Breakdown */}
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {locale === 'uz' ? "Savollar tahlili:" : "Questions Breakdown:"}
                </p>
                {questions.map((q, idx) => {
                  const ans = userAnswers[idx];
                  const userOpt = q.options.find(o => o.id === ans?.selectedOptionId);
                  const correctOpt = q.options.find(o => o.isCorrect);

                  return (
                    <div 
                      key={q.id}
                      className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                        ans?.isCorrect 
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                          : 'bg-rose-50/80 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold">
                          {idx + 1}. {locale === 'uz' ? q.question_uz : q.question_en}
                        </span>
                        {ans?.isCorrect ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-bold shrink-0 text-[10px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-300" />
                            <span>{locale === 'uz' ? "To'g'ri" : "Correct"}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-800 text-rose-900 dark:text-rose-100 font-bold shrink-0 text-[10px]">
                            <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-300" />
                            <span>{locale === 'uz' ? "Xato" : "Wrong"}</span>
                          </span>
                        )}
                      </div>

                      {!ans?.isCorrect && (
                        <div className="text-[11px] pt-1 text-slate-700 dark:text-slate-300">
                          <span className="text-rose-700 dark:text-rose-400 font-semibold">
                            {locale === 'uz' ? "Sizning javobingiz: " : "Your answer: "}
                            {userOpt ? (locale === 'uz' ? userOpt.text_uz : userOpt.text_en) : "-"}
                          </span>
                          <br />
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                            {locale === 'uz' ? "To'g'ri javob: " : "Correct answer: "}
                            {correctOpt ? (locale === 'uz' ? correctOpt.text_uz : correctOpt.text_en) : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleRestartQuiz}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-amber-300 dark:border-emerald-700 hover:bg-amber-100/60 dark:hover:bg-emerald-900 text-slate-800 dark:text-emerald-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{locale === 'uz' ? "Qaytadan topshirish" : "Try Again"}</span>
                </button>

                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-600 hover:brightness-110 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{locale === 'uz' ? "Yakunlash va saqlash ✨" : "Finish & Save ✨"}</span>
                </button>
              </div>

            </div>
          ) : (
            /* ACTIVE QUESTION VIEW */
            <div className="space-y-5">
              
              {/* Stepper bar & counter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <span>{t.quizQuestion} {currentQuestionIndex + 1} / {totalQuestions}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-emerald-950 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-emerald-800">
                    +25 {t.nurCoins}
                  </span>
                </div>

                <div className="h-2 w-full bg-amber-100 dark:bg-emerald-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question text */}
              <h4 className="text-base sm:text-lg font-bold text-[#1E1B4B] dark:text-amber-100 font-display leading-snug">
                {locale === 'uz' ? currentQ.question_uz : currentQ.question_en}
              </h4>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const showResult = isChecked;
                  const isCorrect = opt.isCorrect;

                  let cardStyle = "border-slate-200 dark:border-emerald-800/80 hover:border-amber-300 dark:hover:border-emerald-600 bg-white dark:bg-[#002b26] text-slate-800 dark:text-emerald-100";
                  
                  if (isSelected && !showResult) {
                    cardStyle = "border-amber-500 dark:border-amber-400 bg-amber-50 dark:bg-emerald-900/60 text-amber-950 dark:text-amber-100 font-bold shadow-sm ring-2 ring-amber-300 dark:ring-amber-500/40";
                  } else if (showResult) {
                    if (isCorrect) {
                      cardStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-100 font-bold ring-2 ring-emerald-300 dark:ring-emerald-500";
                    } else if (isSelected && !isCorrect) {
                      cardStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/80 text-rose-950 dark:text-rose-100 font-bold ring-2 ring-rose-300";
                    } else {
                      cardStyle = "opacity-50 border-slate-200 dark:border-emerald-900 bg-white dark:bg-[#002b26] text-slate-600 dark:text-emerald-200";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${cardStyle}`}
                    >
                      <span className="leading-relaxed font-medium">
                        {locale === 'uz' ? opt.text_uz : opt.text_en}
                      </span>
                      {showResult && isCorrect && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100 text-xs font-bold shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                          <span>{locale === 'uz' ? "To'g'ri" : "Correct"}</span>
                        </span>
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-800 text-rose-800 dark:text-rose-100 text-xs font-bold shrink-0">
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-300" />
                          <span>{locale === 'uz' ? "Xato" : "Wrong"}</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation note when answer is checked */}
              {isChecked && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-xs leading-relaxed ${
                    selectedOpt?.isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100'
                      : 'bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-700 text-amber-950 dark:text-amber-100'
                  }`}
                >
                  <p className="font-bold mb-1">
                    {selectedOpt?.isCorrect 
                      ? "🎉 " + (locale === 'uz' ? "Ofarin! To'g'ri javob!" : "Well done! Correct answer!") 
                      : "💡 " + (locale === 'uz' ? "Eslab qoling:" : "Remember:")}
                  </p>
                  <p>{locale === 'uz' ? currentQ.explanation_uz : currentQ.explanation_en}</p>
                </motion.div>
              )}

              {/* Auto-transition status footer */}
              {isChecked && (
                <div className="pt-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 dark:text-emerald-300 border-t border-amber-100 dark:border-emerald-800/60 animate-pulse">
                  <span>{currentQuestionIndex === totalQuestions - 1 ? (locale === 'uz' ? "Natijalar hisoblanmoqda... ✨" : "Calculating results... ✨") : (locale === 'uz' ? "Keyingi savolga o'tilmoqda... ⏳" : "Next question loading... ⏳")}</span>
                </div>
              )}

            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
