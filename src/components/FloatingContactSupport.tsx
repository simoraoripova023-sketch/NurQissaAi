'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Send, X, Check, Sparkles, HelpCircle, 
  AlertTriangle, Lightbulb, Bot, User, ArrowRight, Loader2,
  RefreshCw, BookOpen, HeartHandshake, ShieldCheck
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
  const [activeTab, setActiveTab] = useState<'ai_chat' | 'feedback'>('ai_chat');

  // AI Chat States
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      content: isUz 
        ? "Assalomu alaykum! Men **NurQissa 24/7 AI Yordamchisi**man. 🌟\n\nPlatformadan foydalanish, farzandingizga shaxsiy ertak yaratish, Islomiy odoblar yoki qattiq muqovali kitob buyurtma qilish bo'yicha savollaringiz bo'lsa, bemalol so'rang!"
        : "Hello! I am **NurQissa 24/7 AI Support Assistant**. 🌟\n\nFeel free to ask me anything about creating personalized stories, Islamic values, or ordering hardcover books!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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
    "🎨 Bo'yash sahifalari bormi?"
  ] : [
    "📖 How to create a story?",
    "📦 Hardcover book order",
    "🌳 What is Manners Tree?",
    "🎨 Are there coloring pages?"
  ];

  useEffect(() => {
    if (activeTab === 'ai_chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab, isOpen]);

  const handleSendChatMessage = async (textToSend?: string) => {
    const text = (textToSend || chatInput).trim();
    if (!text || isChatLoading) return;

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
            ? "Tarmoq bilan aloqa uzildi. Iltimos, qayta urinib ko'ring yoki Telegram botimizga yozing."
            : "Network issue. Please retry or contact us on Telegram.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsChatLoading(false);
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
          title={isUz ? "24/7 AI Yordamchi & Takliflar" : "24/7 AI Support & Feedback"}
        >
          {/* Pulsing indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400"></span>
          </span>

          <Bot className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline font-display">
            {isOpen ? (isUz ? "Yopish" : "Close") : (isUz ? "AI Yordamchi & Aloqa" : "AI Support & Feedback")}
          </span>
        </motion.button>
      </div>

      {/* Interactive Modal */}
      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-2 sm:p-6 bg-black/60 backdrop-blur-sm no-print print:hidden"
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
              <div className="relative z-10 space-y-1 pb-3 border-b border-amber-200/60 dark:border-emerald-800/60 flex-shrink-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isUz ? "NurQissa Markazi" : "NurQissa Center"}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-amber-100 font-display">
                  {isUz ? "Qo'llab-quvvatlash va Takliflar" : "Support & Suggestions"}
                </h3>
              </div>

              {/* Top Action Cards: AI Chat vs Telegram Bot */}
              <div className="relative z-10 grid grid-cols-2 gap-2.5 py-3 flex-shrink-0">
                {/* 24/7 AI Chat Tab Toggle Button */}
                <button
                  onClick={() => setActiveTab('ai_chat')}
                  className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex items-center gap-2.5 text-left shadow-sm ${
                    activeTab === 'ai_chat'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-emerald-500/20 ring-2 ring-amber-300'
                      : 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 hover:border-emerald-500'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform ${
                    activeTab === 'ai_chat' ? 'bg-white/20 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className={`font-black text-xs truncate ${
                      activeTab === 'ai_chat' ? 'text-white' : 'text-emerald-900 dark:text-emerald-200'
                    }`}>
                      {isUz ? "24/7 AI Yordamchi" : "24/7 AI Assistant"}
                    </div>
                    <div className={`text-[10px] truncate ${
                      activeTab === 'ai_chat' ? 'text-emerald-100' : 'text-emerald-700 dark:text-emerald-400'
                    }`}>
                      {isUz ? "Jonli aqlli suhbat" : "Instant answers"}
                    </div>
                  </div>
                </button>

                {/* Direct Telegram Bot Link */}
                <a
                  href={TELEGRAM_BOT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 sm:p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-300 dark:border-sky-700 hover:border-sky-500 transition-all flex items-center gap-2.5 group shadow-sm text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Send className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-sky-900 dark:text-sky-200 truncate">
                      {isUz ? "Telegram Bot" : "Telegram Bot"}
                    </div>
                    <div className="text-[10px] text-sky-700 dark:text-sky-400 truncate">
                      @nurqissaaa_bot
                    </div>
                  </div>
                </a>
              </div>

              {/* Sub-tabs: AI Chat vs Taklif & Shikoyat */}
              <div className="relative z-10 flex border-b border-amber-200/50 dark:border-emerald-800/50 pb-2 mb-2 gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('ai_chat')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'ai_chat'
                      ? 'bg-amber-400 dark:bg-emerald-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-emerald-950'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>{isUz ? "AI Yordamchi bilan suhbat" : "AI Support Chat"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('feedback')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'feedback'
                      ? 'bg-amber-400 dark:bg-emerald-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-emerald-950'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{isUz ? "Fikr & Taklif yuborish" : "Leave Feedback"}</span>
                </button>
              </div>

              {/* Tab 1: AI Chat View */}
              {activeTab === 'ai_chat' && (
                <div className="relative z-10 flex-1 flex flex-col min-h-0">
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[220px] max-h-[300px]">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm mt-1">
                            <Bot className="w-4 h-4" />
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
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-emerald-950/80 rounded-2xl border border-amber-200/60 dark:border-emerald-800">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                          <span>{isUz ? "AI javob tayyorlamoqda..." : "AI is thinking..."}</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Quick question suggestions */}
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
                      placeholder={isUz ? "Savolingizni yozing..." : "Ask your question..."}
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

              {/* Tab 2: Feedback Form View */}
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
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
