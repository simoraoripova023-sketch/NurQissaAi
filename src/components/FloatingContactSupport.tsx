'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Send, Phone, Mail, Clock, MapPin, 
  X, Check, Sparkles, Heart, HelpCircle, ArrowRight,
  AlertTriangle, Lightbulb, MessageSquare, Loader2
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function FloatingContactSupport() {
  const { locale } = useAppStore();
  const isUz = locale === 'uz';

  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'taklif' | 'shikoyat' | 'savol'>('taklif');
  const [userName, setUserName] = useState('');
  const [userContact, setUserContact] = useState('');
  const [userMsg, setUserMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const TELEGRAM_ADMIN = "https://t.me/nurqissaaa_bot";
  const TELEGRAM_BOT = "https://t.me/nurqissaaa_bot";
  const PHONE_NUMBER = "+998 90 123 45 67";
  const EMAIL_ADDRESS = "support@nurqissa.ai";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsg.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: feedbackType,
          name: userName.trim() || (isUz ? 'Foydalanuvchi' : 'User'),
          contact: userContact.trim() || (isUz ? "Ko'rsatilmadi" : 'Not provided'),
          message: userMsg.trim()
        })
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setUserMsg('');
          setUserName('');
          setUserContact('');
          setIsOpen(false);
        }, 2500);
      }
    } catch (err) {
      console.error('Feedback submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 no-print print:hidden">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center gap-2.5 px-4 py-3.5 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 text-white font-black text-xs sm:text-sm shadow-2xl shadow-emerald-700/40 border-2 border-amber-300 hover:shadow-emerald-600/60 transition-all group"
          title={isUz ? "Taklif va shikoyatlar" : "Feedback & Support"}
        >
          {/* Pulsing indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400"></span>
          </span>

          <MessageCircle className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline font-display">
            {isOpen ? (isUz ? "Yopish" : "Close") : (isUz ? "Taklif & Shikoyatlar" : "Feedback & Support")}
          </span>
        </motion.button>
      </div>

      {/* Interactive Modal */}
      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm no-print print:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-lg bg-[#FFFDF5] dark:bg-[#002621] rounded-3xl p-5 sm:p-7 border-2 border-amber-400/80 dark:border-emerald-600/80 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative background glow */}
              <div className="absolute top-0 right-0 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-emerald-900/60 text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-all z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="relative z-10 space-y-1 pb-3 border-b border-amber-200/60 dark:border-emerald-800/60">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isUz ? "Taklif va Shikoyatlar Markazi" : "Feedback & Complaint Center"}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-amber-100 font-display">
                  {isUz ? "Fikr va taklifingizni qoldiring" : "Share Your Feedback"}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {isUz 
                    ? "Platformani rivojlantirish bo'yicha taklifingiz yoki shikoyatingiz bormi? Har bir fikr biz uchun muhim!" 
                    : "Have an idea or an issue? We listen to every suggestion and respond promptly!"}
                </p>
              </div>

              {/* Direct Telegram Bot & Admin Cards */}
              <div className="relative z-10 grid grid-cols-2 gap-2.5 py-3">
                <a
                  href={TELEGRAM_BOT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-300 dark:border-sky-700 hover:border-sky-500 transition-all flex items-center gap-2.5 group shadow-sm"
                >
                  <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Send className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-sky-900 dark:text-sky-200 truncate">
                      {isUz ? "Telegram Bot" : "Telegram Bot"}
                    </div>
                    <div className="text-[11px] text-sky-700 dark:text-sky-400 truncate">
                      @nurqissaaa_bot
                    </div>
                  </div>
                </a>

                <a
                  href={TELEGRAM_ADMIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 hover:border-emerald-500 transition-all flex items-center gap-2.5 group shadow-sm"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-emerald-900 dark:text-emerald-200 truncate">
                      {isUz ? "Admin Aloqasi" : "Admin Support"}
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 truncate">
                      @nurqissaaa_bot
                    </div>
                  </div>
                </a>
              </div>

              {/* Form */}
              <div className="relative z-10 pt-2">
                <form onSubmit={handleSubmit} className="space-y-3">
                  
                  {/* Category Type Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-amber-200 mb-1.5">
                      {isUz ? "Murojaat turi:" : "Feedback Type:"}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setFeedbackType('taklif')}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                          feedbackType === 'taklif'
                            ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-[1.02]'
                            : 'bg-white dark:bg-emerald-950/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-800 hover:bg-amber-50'
                        }`}
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>{isUz ? "Taklif" : "Idea"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFeedbackType('shikoyat')}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                          feedbackType === 'shikoyat'
                            ? 'bg-rose-500 text-white border-rose-600 shadow-md scale-[1.02]'
                            : 'bg-white dark:bg-emerald-950/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-800 hover:bg-rose-50'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{isUz ? "Shikoyat" : "Complaint"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFeedbackType('savol')}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                          feedbackType === 'savol'
                            ? 'bg-teal-600 text-white border-teal-700 shadow-md scale-[1.02]'
                            : 'bg-white dark:bg-emerald-950/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-800 hover:bg-teal-50'
                        }`}
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{isUz ? "Savol" : "Question"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Name and Contact inputs in 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-amber-200 mb-1">
                        {isUz ? "Ismingiz:" : "Your Name:"}
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder={isUz ? "Masalan: Aziza opa" : "E.g., John"}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-emerald-950/80 border border-slate-300 dark:border-emerald-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-amber-200 mb-1">
                        {isUz ? "Telefon yoki Telegram:" : "Phone / Telegram:"}
                      </label>
                      <input
                        type="text"
                        value={userContact}
                        onChange={(e) => setUserContact(e.target.value)}
                        placeholder={isUz ? "+998 90 ... yoki @username" : "+998 90 ..."}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-emerald-950/80 border border-slate-300 dark:border-emerald-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-amber-200 mb-1">
                      {isUz ? "Taklif yoki shikoyatingiz matni:" : "Message details:"}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={userMsg}
                      onChange={(e) => setUserMsg(e.target.value)}
                      placeholder={
                        feedbackType === 'taklif'
                          ? (isUz ? "Saytga qanday yangi qissa yoki funksiya qo'shishimizni xohlaysiz?.." : "What new feature or story would you like to see?...")
                          : feedbackType === 'shikoyat'
                          ? (isUz ? "Qayerda xatolik yoki noqulaylik yuz berdi?.." : "What issue did you encounter?...")
                          : (isUz ? "Savolingizni yozing..." : "Write your question here...")
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-emerald-950/80 border border-slate-300 dark:border-emerald-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !userMsg.trim()}
                    className={`w-full py-3 rounded-2xl font-black text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                      isSuccess
                        ? 'bg-emerald-600 border border-emerald-500 shadow-emerald-500/40'
                        : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:opacity-95 shadow-emerald-700/30'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isUz ? "Yuborilmoqda..." : "Sending..."}</span>
                      </>
                    ) : isSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{isUz ? "Murojaatingiz qabul qilindi! Rahmat!" : "Thank you! Received successfully!"}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{isUz ? "Yuborish" : "Submit Feedback"}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
