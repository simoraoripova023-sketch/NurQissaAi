'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Send, X, Check, Sparkles, HelpCircle, 
  AlertTriangle, Lightbulb, Bot, User, ArrowRight, Loader2,
  Phone, Mail, Crown, HeartHandshake, ShieldCheck, MessageSquare
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  time: string;
}

export default function FloatingContactSupport() {
  const { locale } = useAppStore();
  const isUz = locale === 'uz';

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'nur_assistant' | 'founder' | 'feedback'>('nur_assistant');

  // Nur Yordamchi Chat States
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      content: isUz 
        ? "Assalomu alaykum! Men **Nur Yordamchi**man. 🌟\n\nPlatformadan foydalanish, farzandingizga shaxsiy ertak yaratish, Islomiy odoblar yoki qattiq muqovali kitob buyurtma qilish bo'yicha savollaringiz bo'lsa, bemalol so'rang!\n\nAgar loyiha asoschisi bilan to'g'ridan-to'g'ri shaxsan bog'lanmoqchi bo'lsangiz, yuqoridagi **\"👑 Asoschi bilan aloqa\"** bo'limiga o'tishingiz mumkin."
        : "Hello! I am **Nur Assistant**. 🌟\n\nFeel free to ask me anything about creating personalized stories, Islamic values, or ordering hardcover books! If you wish to reach out directly to the founder, please select the **\"👑 Contact Founder\"** tab.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Founder Contact Form States
  const [founderName, setFounderName] = useState('');
  const [founderContact, setFounderContact] = useState('');
  const [founderMsg, setFounderMsg] = useState('');
  const [isFounderSubmitting, setIsFounderSubmitting] = useState(false);
  const [isFounderSuccess, setIsFounderSuccess] = useState(false);

  // Feedback Form States
  const [feedbackType, setFeedbackType] = useState<'taklif' | 'shikoyat' | 'savol'>('taklif');
  const [userName, setUserName] = useState('');
  const [userContact, setUserContact] = useState('');
  const [userMsg, setUserMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const TELEGRAM_BOT = "https://t.me/nurqissaaa_bot";

  const quickQuestions = isUz ? [
    "📖 Shaxsiy ertak qanday yaratiladi?",
    "📦 Qattiq muqovali kitob buyurtmasi",
    "🌳 Odob daraxti nima?",
    "👑 Asoschi bilan bog'lanish"
  ] : [
    "📖 How to create a story?",
    "📦 Hardcover book order",
    "🌳 What is Manners Tree?",
    "👑 Contact Founder"
  ];

  useEffect(() => {
    if (activeTab === 'nur_assistant') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab, isOpen]);

  const handleSendChatMessage = async (textToSend?: string) => {
    const text = (textToSend || chatInput).trim();
    if (!text || isChatLoading) return;

    if (text.includes("Asoschi") || text.includes("Founder") || text.includes("bog'lanish")) {
      setActiveTab('founder');
      return;
    }

    const userMessage: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const history = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          userMessage: text
        })
      });

      const data = await res.json();
      const reply = data.reply || (isUz 
        ? "Kechirasiz, javob olishda xatolik yuz berdi. Iltimos @nurqissaaa_bot orqali bog'laning."
        : "Sorry, an error occurred. Please contact @nurqissaaa_bot."
      );

      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Support Chat Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          role: 'assistant',
          content: isUz 
            ? "Tarmoq bilan aloqa uzildi. Iltimos, qayta urinib ko'ring yoki Telegram orqali yozing."
            : "Network issue. Please retry or contact us on Telegram.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleFounderDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!founderMsg.trim()) return;

    setIsFounderSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'asoschi',
          name: founderName.trim() || (isUz ? 'Hurmatli mijoz' : 'Valued Customer'),
          contact: founderContact.trim() || (isUz ? "Ko'rsatilmadi" : 'Not provided'),
          message: founderMsg.trim()
        })
      });

      if (res.ok) {
        setIsFounderSuccess(true);
        setTimeout(() => {
          setIsFounderSuccess(false);
          setFounderMsg('');
          setFounderName('');
          setFounderContact('');
          setIsOpen(false);
        }, 2500);
      }
    } catch (err) {
      console.error('Founder direct submit error:', err);
    } finally {
      setIsFounderSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
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
          title={isUz ? "Nur Yordamchi & Asoschi bilan aloqa" : "Nur Assistant & Contact Founder"}
        >
          {/* Pulsing indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400"></span>
          </span>

          <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline font-display font-black">
            {isOpen ? (isUz ? "Yopish" : "Close") : (isUz ? "Nur Yordamchi & Aloqa" : "Nur Assistant & Contact")}
          </span>
        </motion.button>
      </div>

      {/* Interactive Modal */}
      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-2 sm:p-6 bg-black/65 backdrop-blur-sm no-print print:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-lg bg-[#FFFDF5] dark:bg-[#002621] rounded-3xl p-4 sm:p-6 border-2 border-amber-400/80 dark:border-emerald-600/80 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
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
              <div className="relative z-10 space-y-1 pb-2.5 border-b border-amber-200/60 dark:border-emerald-800/60 flex-shrink-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isUz ? "NurQissa Markazi" : "NurQissa Hub"}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-amber-100 font-display">
                  {isUz ? "Nur Yordamchi va Asoschi Aloqasi" : "Nur Assistant & Founder Contact"}
                </h3>
              </div>

              {/* Navigation Tabs (3 distinct options) */}
              <div className="relative z-10 grid grid-cols-3 gap-1.5 py-2.5 flex-shrink-0 border-b border-amber-200/50 dark:border-emerald-800/50">
                {/* 1. Nur Yordamchi Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('nur_assistant')}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 rounded-2xl text-center font-black text-[11px] sm:text-xs transition-all border ${
                    activeTab === 'nur_assistant'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md shadow-emerald-700/20 ring-2 ring-amber-300'
                      : 'bg-white dark:bg-emerald-950/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-emerald-800 hover:bg-amber-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                  <span className="truncate">{isUz ? "Nur Yordamchi" : "Nur Assistant"}</span>
                </button>

                {/* 2. Asoschi bilan aloqa Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('founder')}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 rounded-2xl text-center font-black text-[11px] sm:text-xs transition-all border ${
                    activeTab === 'founder'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 shadow-md shadow-amber-600/20 ring-2 ring-amber-300'
                      : 'bg-white dark:bg-emerald-950/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-emerald-800 hover:bg-amber-50'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                  <span className="truncate">{isUz ? "Asoschi Aloqasi" : "Founder Contact"}</span>
                </button>

                {/* 3. Taklif & Fikrlar Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('feedback')}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 rounded-2xl text-center font-black text-[11px] sm:text-xs transition-all border ${
                    activeTab === 'feedback'
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-700 text-white border-teal-400 shadow-md shadow-teal-700/20 ring-2 ring-amber-300'
                      : 'bg-white dark:bg-emerald-950/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-emerald-800 hover:bg-amber-50'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                  <span className="truncate">{isUz ? "Taklif/Fikr" : "Feedback"}</span>
                </button>
              </div>

              {/* TAB 1: Nur Yordamchi (24/7 AI Chat) */}
              {activeTab === 'nur_assistant' && (
                <div className="relative z-10 flex-1 flex flex-col min-h-0 pt-1">
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[220px] max-h-[300px]">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm mt-1">
                            <Sparkles className="w-4 h-4 text-amber-200" />
                          </div>
                        )}

                        <div
                          className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-md'
                              : 'bg-white dark:bg-emerald-950/80 border border-amber-200/80 dark:border-emerald-800 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm'
                          }`}
                        >
                          <div className="whitespace-pre-line">{msg.content}</div>
                          <div className={`text-[9px] mt-1 text-right ${msg.role === 'user' ? 'text-emerald-200' : 'text-slate-400 dark:text-slate-400'}`}>
                            {msg.time}
                          </div>
                        </div>

                        {msg.role === 'user' && (
                          <div className="w-7 h-7 rounded-xl bg-amber-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm mt-1">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}

                    {isChatLoading && (
                      <div className="flex gap-2.5 items-center text-xs text-emerald-700 dark:text-emerald-300">
                        <div className="w-7 h-7 rounded-xl bg-emerald-600 flex items-center justify-center text-white flex-shrink-0 animate-pulse">
                          <Sparkles className="w-4 h-4 text-amber-200" />
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-emerald-950/80 rounded-2xl border border-amber-200/60 dark:border-emerald-800">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                          <span>{isUz ? "Nur Yordamchi yozmoqda..." : "Nur Assistant is thinking..."}</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Quick Suggestions */}
                  <div className="py-2 flex gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
                    {quickQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendChatMessage(q)}
                        disabled={isChatLoading}
                        className="px-2.5 py-1 rounded-full bg-amber-100/80 dark:bg-emerald-900/60 hover:bg-amber-200 text-slate-800 dark:text-slate-200 text-[11px] font-semibold whitespace-nowrap transition-colors flex-shrink-0 border border-amber-300/60 dark:border-emerald-700/60"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Chat Input Field */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendChatMessage();
                    }}
                    className="flex items-center gap-2 pt-1 flex-shrink-0"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={isUz ? "Nur Yordamchiga savol bering..." : "Ask Nur Assistant..."}
                      disabled={isChatLoading}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-emerald-950/80 border border-slate-300 dark:border-emerald-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <button
                      type="submit"
                      disabled={isChatLoading || !chatInput.trim()}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all flex items-center justify-center"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: Asoschi bilan to'g'ridan-to'g'ri aloqa (Founder Direct Contact) */}
              {activeTab === 'founder' && (
                <div className="relative z-10 flex-1 overflow-y-auto pt-1 space-y-3">
                  {/* Founder Intro Card */}
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-emerald-950/70 dark:to-teal-950/70 border border-amber-300 dark:border-amber-600/50 shadow-sm flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                      <Crown className="w-5 h-5 text-amber-100" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-amber-100">
                        {isUz ? "Loyiha Asoschisi va Rahbariyat Aloqasi" : "Direct Founder & Management Access"}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
                        {isUz 
                          ? "Maxsus hamkorlik, shaxsiy kitoblar, homiylik yoki to'g'ridan-to'g'ri maslahat uchun quyidagi vositalardan foydalaning."
                          : "Reach out directly to the founder for special partnerships, custom books or inquiries."}
                      </p>
                    </div>
                  </div>

                  {/* Direct Telegram Channel Button */}
                  <a
                    href={TELEGRAM_BOT}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white transition-all flex items-center justify-between shadow-md group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
                        <Send className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-xs">
                          {isUz ? "Telegram orqali to'g'ridan-to'g'ri yozish" : "Direct Telegram Message"}
                        </div>
                        <div className="text-[11px] text-sky-100">@nurqissaaa_bot</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>

                  {/* Direct Founder Message Form */}
                  <div className="pt-1">
                    <div className="text-xs font-bold text-slate-700 dark:text-amber-200 mb-2 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isUz ? "Asoschiga shaxsiy xabar qoldiring:" : "Leave a Direct Message to Founder:"}</span>
                    </div>

                    <form onSubmit={handleFounderDirectSubmit} className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          value={founderName}
                          onChange={(e) => setFounderName(e.target.value)}
                          placeholder={isUz ? "Ismingiz *" : "Your Name *"}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-emerald-950/80 border border-slate-300 dark:border-emerald-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        <input
                          type="text"
                          required
                          value={founderContact}
                          onChange={(e) => setFounderContact(e.target.value)}
                          placeholder={isUz ? "Telefon yoki Telegram *" : "Phone or Telegram *"}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-emerald-950/80 border border-slate-300 dark:border-emerald-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>

                      <textarea
                        required
                        rows={3}
                        value={founderMsg}
                        onChange={(e) => setFounderMsg(e.target.value)}
                        placeholder={isUz ? "Asoschiga yetkazmoqchi bo'lgan shaxsiy taklif yoki savolingizni yozing..." : "Write your personal message to the founder..."}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-emerald-950/80 border border-slate-300 dark:border-emerald-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                      />

                      <button
                        type="submit"
                        disabled={isFounderSubmitting || !founderMsg.trim()}
                        className={`w-full py-2.5 rounded-2xl font-black text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                          isFounderSuccess
                            ? 'bg-emerald-600 border border-emerald-500 shadow-emerald-500/40'
                            : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 shadow-amber-600/30'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isFounderSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{isUz ? "Asoschiga yuborilmoqda..." : "Sending directly to founder..."}</span>
                          </>
                        ) : isFounderSuccess ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>{isUz ? "Xabaringiz asoschiga yetkazildi! Rahmat!" : "Message delivered to founder!"}</span>
                          </>
                        ) : (
                          <>
                            <Crown className="w-4 h-4 text-amber-200" />
                            <span>{isUz ? "Asoschiga Shaxsiy Xabar Yuborish" : "Send Directly to Founder"}</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 3: Taklif va Shikoyat yuborish */}
              {activeTab === 'feedback' && (
                <div className="relative z-10 flex-1 overflow-y-auto pt-1">
                  <form onSubmit={handleFeedbackSubmit} className="space-y-3">
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
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-emerald-950/80 border border-slate-300 dark:border-emerald-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !userMsg.trim()}
                      className={`w-full py-2.5 rounded-2xl font-black text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
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
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
