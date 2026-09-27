'use client';

import React, { useState } from 'react';
import { 
  X, Sparkles, Check, Crown, Star, Gem, ShieldCheck, 
  CreditCard, ArrowRight, Heart, Gift, Zap, Send, Loader2, 
  Smartphone, Phone, Copy, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { CONTACT_CONFIG } from '@/lib/contact';
import confetti from 'canvas-confetti';

export default function PricingModal() {
  const { 
    isPricingModalOpen, setIsPricingModalOpen, 
    freeStoriesLeft, hasPaidSubscription, 
    addStoryCredits, setHasPaidSubscription,
    currentUser,
    locale 
  } = useAppStore();

  const CARD_NUMBER = "9860 0803 1682 3584";
  const CARD_RAW = "9860080316823584";
  const CARD_HOLDER = "Simora Oripova";

  const [activeTab, setActiveTab] = useState<'card' | 'plans'>('card');
  const [selectedPlan, setSelectedPlan] = useState<'pack3' | 'pack10' | 'vip'>('pack10');
  
  // Card payment states
  const [isCopied, setIsCopied] = useState(false);
  const [hasPaidClicked, setHasPaidClicked] = useState(false);
  const [senderName, setSenderName] = useState(currentUser?.name || '');
  const [senderPhone, setSenderPhone] = useState(currentUser?.phone || '');
  const [isSubmittingPaid, setIsSubmittingPaid] = useState(false);
  const [paidSubmitted, setPaidSubmitted] = useState(false);

  // General checkout states
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isPricingModalOpen) return null;

  const isUz = locale === 'uz';

  const planDetails = {
    pack3: {
      name: isUz ? "«Kichkintoy» To'plami" : "Starter Pack",
      price: "29 000",
      amount: 29000,
      stories: 3,
      desc: isUz ? "3 ta to'liq shaxsiy qissa" : "3 personalized stories",
    },
    pack10: {
      name: isUz ? "«Nurli Oila» To'plami" : "Radiant Family Pack",
      price: "69 000",
      amount: 69000,
      stories: 10,
      desc: isUz ? "10 ta qissa + Audio + PDF" : "10 stories + Audio + PDF",
    },
    vip: {
      name: isUz ? "«VIP Cheksiz Obuna»" : "VIP Unlimited",
      price: "99 000",
      amount: 99000,
      stories: 999,
      desc: isUz ? "Cheksiz ertaklar & tezkor generatsiya" : "Unlimited stories & priority queue",
    },
  };

  const handleCopyCard = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(CARD_RAW);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = CARD_RAW;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error("Copy failed", err);
    }
    setIsCopied(true);
  };

  const handleConfirmPaidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPaid(true);

    const plan = planDetails[selectedPlan];

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'karta_tolov',
          name: senderName.trim() || currentUser?.name || 'Hurmatli Ota-ona',
          contact: senderPhone.trim() || currentUser?.phone || 'Telefon kiritilmadi',
          message: `💳 KARTA TO'LOVI TASDIQLANDI: ${plan.name} (${plan.price} so'm) | Karta: ${CARD_NUMBER} (${CARD_HOLDER}) | Mijoz "To'lov qildim" deb tasdiqladi.`,
        }),
      }).catch(() => {});
    } catch {}

    setTimeout(() => {
      setIsSubmittingPaid(false);
      setPaidSubmitted(true);

      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      });

      if (selectedPlan === 'pack3') {
        addStoryCredits(3);
      } else if (selectedPlan === 'pack10') {
        addStoryCredits(10);
      } else if (selectedPlan === 'vip') {
        setHasPaidSubscription(true);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in pt-[env(safe-area-inset-top,16px)] pb-[env(safe-area-inset-bottom,16px)]">
      <div className="relative w-full max-w-4xl my-auto bg-[#FFFDF5] dark:bg-[#002621] rounded-3xl border-2 border-pine-800/40 dark:border-butter-200/40 shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col">
        
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-pine-900 via-pine-800 to-emerald-900 p-5 sm:p-7 text-white shrink-0">
          <button
            onClick={() => setIsPricingModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-butter-400/20 border border-butter-300/40 text-butter-200 text-xs font-bold mb-2.5">
              <Gift className="w-3.5 h-3.5 text-butter-300" />
              <span>{isUz ? "NurQissa AI — To'lov & Obuna Tizimi" : "NurQissa AI — Subscription & Payment"}</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-display tracking-tight text-butter-200">
              {isUz ? "Ertaklar Olami Obunasi & To'lov" : "Storybook Subscription & Payment"}
            </h2>

            {/* Current Balance Status Bar */}
            <div className="mt-3 inline-flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-black/30 border border-butter-300/30 text-xs">
              <span className="text-white/80">{isUz ? "Hozirgi balansingiz:" : "Current balance:"}</span>
              {hasPaidSubscription ? (
                <span className="font-black text-amber-300 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  VIP Cheksiz Obuna Faol
                </span>
              ) : (
                <span className="font-black text-butter-200 flex items-center gap-1">
                  <span>📖 {freeStoriesLeft} ta qissa</span>
                </span>
              )}
            </div>
          </div>

          {/* Tab Switcher: Karta orqali to'lov (Obuna) VS Tariflar */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/15">
            <button
              onClick={() => setActiveTab('card')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'card'
                  ? 'bg-amber-400 text-pine-950 shadow-md scale-[1.02] border border-amber-200 font-extrabold'
                  : 'bg-white/10 hover:bg-white/20 text-butter-200/90'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{isUz ? "💳 Karta orqali to'lov (Obuna)" : "💳 Card Payment (Subscription)"}</span>
            </button>

            <button
              onClick={() => setActiveTab('plans')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'plans'
                  ? 'bg-amber-400 text-pine-950 shadow-md scale-[1.02] border border-amber-200 font-extrabold'
                  : 'bg-white/10 hover:bg-white/20 text-butter-200/90'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>{isUz ? "📦 Barcha Tariflar & Paketlar" : "📦 All Plans & Packs"}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
          
          {/* ========================================================================= */}
          {/* TAB 1: KARTA ORQALI TO'LOV (OBUNA BO'LIMI) */}
          {/* ========================================================================= */}
          {activeTab === 'card' && (
            <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
              
              {/* Tarif tanlash qatori */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-pine-900 dark:text-butter-200 uppercase tracking-wider">
                  {isUz ? "1. Obuna tarifini tanlang:" : "1. Choose Plan:"}
                </label>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {(['pack3', 'pack10', 'vip'] as const).map((planKey) => {
                    const plan = planDetails[planKey];
                    const isSelected = selectedPlan === planKey;
                    return (
                      <button
                        key={planKey}
                        type="button"
                        onClick={() => setSelectedPlan(planKey)}
                        className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-amber-500 bg-amber-100/70 dark:bg-pine-900 shadow-md scale-[1.02]'
                            : 'border-slate-200 dark:border-pine-800 bg-white dark:bg-pine-950/60 hover:border-amber-300'
                        }`}
                      >
                        {planKey === 'pack10' && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider shadow-xs whitespace-nowrap">
                            Eng ommabop
                          </span>
                        )}
                        <span className="block text-xs font-black text-pine-950 dark:text-butter-100 truncate">
                          {plan.name.replace(' To\'plami', '').replace('«', '').replace('»', '')}
                        </span>
                        <span className="block text-sm sm:text-base font-black text-emerald-700 dark:text-amber-300 mt-1">
                          {plan.price} <span className="text-[10px] font-semibold text-slate-500">so'm</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. REALISTIC BANK KARTA BLOKI */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-pine-900 dark:text-butter-200 uppercase tracking-wider">
                    {isUz ? "2. To'lov uchun rasmiy karta:" : "2. Official Card for Payment:"}
                  </label>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isUz ? "Rasmiy hisob" : "Verified Account"}
                  </span>
                </div>

                {/* VIP KARTA KO'RINIShI */}
                <div className="relative w-full rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-[#023B33] via-[#012A25] to-[#001714] border-2 border-amber-400/80 shadow-2xl text-white overflow-hidden">
                  {/* Orqa fon nur effekti */}
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

                  {/* Karta yuqori qatori: Oltin chip va tizim belgisi */}
                  <div className="flex items-center justify-between mb-5 relative z-10">
                    <div className="flex items-center gap-2">
                      {/* Chip */}
                      <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-amber-400 to-amber-200 border border-amber-500 shadow-inner flex items-center justify-center relative overflow-hidden">
                        <div className="w-full h-[1px] bg-amber-700/60 my-auto" />
                        <div className="absolute inset-x-2 inset-y-1 border border-amber-700/40 rounded-xs" />
                      </div>
                      {/* To'lqin belgisi */}
                      <svg className="w-5 h-5 text-amber-300/80 transform rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 8.5a7 7 0 0 1 14 0" />
                        <path d="M8 11.5a3.5 3.5 0 0 1 8 0" />
                      </svg>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-amber-400/40 backdrop-blur-sm">
                      <span className="text-[11px] font-black tracking-wider text-amber-300">HUMO / UZCARD</span>
                    </div>
                  </div>

                  {/* Karta raqami qatori & COPY TUGMASI */}
                  <div className="my-4 relative z-10">
                    <span className="text-[10px] font-bold text-amber-200/70 uppercase tracking-widest block mb-1.5">
                      {isUz ? "Karta raqami:" : "Card Number:"}
                    </span>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-black/50 border border-amber-400/40 backdrop-blur-md">
                      <span className="font-mono font-black text-lg sm:text-xl md:text-2xl tracking-wider text-amber-200 drop-shadow-sm select-all">
                        {CARD_NUMBER}
                      </span>

                      {/* COPY TUGMASI */}
                      <button
                        type="button"
                        onClick={handleCopyCard}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer shrink-0 ${
                          isCopied
                            ? 'bg-emerald-500 text-white border border-emerald-300 scale-105'
                            : 'bg-amber-400 hover:bg-amber-300 text-pine-950 border border-amber-200 hover:scale-105'
                        }`}
                        title={isUz ? "Karta raqamidan nusxa olish" : "Copy card number"}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4 text-white" />
                            <span>Nusxalandi! ✓</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-pine-950" />
                            <span>Nusxa olish</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Karta egasi ismi: Simora Oripova */}
                  <div className="flex items-end justify-between pt-3 border-t border-amber-400/20 relative z-10">
                    <div>
                      <span className="text-[9px] font-bold text-amber-200/60 uppercase tracking-widest block">
                        {isUz ? "Karta egasi:" : "Card Holder:"}
                      </span>
                      <span className="font-black text-sm sm:text-base md:text-lg tracking-wide text-white uppercase font-display">
                        {CARD_HOLDER}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-bold text-amber-200/60 uppercase tracking-widest block">
                        {isUz ? "To'lov summasi:" : "Amount to pay:"}
                      </span>
                      <span className="text-sm sm:text-base font-black text-amber-300">
                        {planDetails[selectedPlan].price} so'm
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 italic pt-1">
                  {isUz 
                    ? "💡 Karta raqamidan nusxa oling va Click, Payme, Uzum yoki istalgan bank ilovangizdan o'tkazma qiling."
                    : "💡 Copy the card number and transfer via Click, Payme, Uzum or any bank app."}
                </p>
              </div>

              {/* ===================================================================== */}
              {/* COPY BOSILGANDAN SO'NG CHIQADIGAN "TO'LOV QILDIM" TUGMASI */}
              {/* ===================================================================== */}
              {isCopied && !paidSubmitted && (
                <div className="pt-2 animate-fade-in space-y-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 leading-tight">
                      {isUz 
                        ? "Karta raqami nusxalandi! Ilovangizda to'lovni amalga oshirgach, quyidagi «To'lov qildim» tugmasini bosing:"
                        : "Card number copied! After completing payment in your app, click 'I Paid' below:"}
                    </p>
                  </div>

                  {!hasPaidClicked ? (
                    /* TO'LOV QILDIM ASOSIY TUGMASI */
                    <button
                      type="button"
                      onClick={() => setHasPaidClicked(true)}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-700/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 border-2 border-amber-300 cursor-pointer"
                    >
                      <Check className="w-5 h-5 text-amber-200" />
                      <span>{isUz ? "To'lov qildim" : "I Have Paid"}</span>
                      <ArrowRight className="w-5 h-5 text-amber-200" />
                    </button>
                  ) : (
                    /* TO'LOV QILGANDAN KEYINGI TELEFON VA ISM QOLDIRISH FORMASI */
                    <form
                      onSubmit={handleConfirmPaidSubmit}
                      className="p-5 rounded-2xl bg-white dark:bg-pine-950 border-2 border-emerald-500 shadow-xl space-y-4 animate-fade-in"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-pine-800 pb-2.5">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-black text-sm">
                          <ShieldCheck className="w-5 h-5 text-emerald-500" />
                          <span>{isUz ? "To'lovni tasdiqlash" : "Confirm Payment"}</span>
                        </div>
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                          {planDetails[selectedPlan].price} so'm
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {isUz 
                          ? "Simora Oripova kartasiga to'lov qilganingizni tasdiqlash va hisobingizga qissalarni qo'shish uchun ma'lumotlaringizni kiriting:" 
                          : "Enter your contact details to verify your transfer to Simora Oripova and activate your stories:"}
                      </p>

                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-pine-900 dark:text-butter-200 mb-1">
                            {isUz ? "Ismingiz:" : "Your Name:"}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder={isUz ? "Masalan: Rustam" : "e.g. John"}
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-pine-700 bg-white dark:bg-pine-900 text-xs font-bold text-slate-900 dark:text-butter-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-pine-900 dark:text-butter-200 mb-1">
                            {isUz ? "Telefon raqamingiz (chekingiz uchun):" : "Your Phone Number:"}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="+998 90 123 45 67"
                            value={senderPhone}
                            onChange={(e) => setSenderPhone(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-pine-700 bg-white dark:bg-pine-900 text-xs font-bold text-slate-900 dark:text-butter-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingPaid}
                        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingPaid ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{isUz ? "Yuborilmoqda..." : "Submitting..."}</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>{isUz ? "Tasdiqlashni yuborish" : "Submit Confirmation"}</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TO'LOV MUVAFFAQIYATLI TASDIQLANGANDA */}
              {paidSubmitted && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-pine-950 dark:to-emerald-950 border-2 border-emerald-500 shadow-xl text-center space-y-3 animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border-2 border-emerald-500 mx-auto flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <h4 className="text-lg font-black text-emerald-950 dark:text-emerald-200">
                    {isUz ? "To'lovingiz ma'lumotlari qabul qilindi!" : "Payment confirmation received!"}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    {isUz 
                      ? "Rahmat! Simora Oripova hisobiga to'lov tekshirilib, obunangiz faollashtirildi. Ertaklar yaratishni boshlashingiz mumkin!"
                      : "Thank you! Your payment to Simora Oripova has been recorded and subscription activated!"}
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsPricingModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition-all"
                  >
                    {isUz ? "Tushunarli, ertaklarga o'tish" : "Continue to Stories"}
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: BARCHA TARIFLAR & PAKETLAR VISUAL KARTALARI */}
          {/* ========================================================================= */}
          {activeTab === 'plans' && (
            <div className="animate-fade-in space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* 1. Pack 3 Stories */}
                <div 
                  onClick={() => { setSelectedPlan('pack3'); setActiveTab('card'); }}
                  className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPlan === 'pack3' 
                      ? 'border-pine-800 dark:border-butter-300 bg-butter-50/80 dark:bg-pine-900/90 shadow-lg scale-[1.02]' 
                      : 'border-slate-200 dark:border-pine-800/60 bg-white dark:bg-pine-950/60 hover:border-pine-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                        <Star className="w-5 h-5 fill-blue-500/20" />
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{isUz ? "Sinov paketi" : "Starter"}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-butter-100">{isUz ? "«Kichkintoy»" : "Starter Pack"}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{isUz ? "Kichik oilalar va ilk sinov uchun" : "Ideal for testing & few bedtime tales"}</p>

                    <div className="my-4">
                      <span className="text-2xl sm:text-3xl font-black text-pine-900 dark:text-butter-200">29 000</span>
                      <span className="text-xs font-bold text-slate-500 ml-1">so'm</span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                        <span><b>3 ta to'liq shaxsiy qissa</b></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>24 ta OpenAI 3D rasmlar</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>O'zbek & Ingliz tillarida</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedPlan('pack3'); setActiveTab('card'); }}
                    className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 dark:bg-pine-800 hover:bg-slate-800 text-white transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isUz ? "Karta orqali to'lash" : "Pay with Card"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 2. Pack 10 Stories (MOST POPULAR) */}
                <div 
                  onClick={() => { setSelectedPlan('pack10'); setActiveTab('card'); }}
                  className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPlan === 'pack10' 
                      ? 'border-amber-500 bg-amber-50/90 dark:bg-pine-900 shadow-xl scale-[1.04]' 
                      : 'border-amber-300/60 bg-white dark:bg-pine-950/60 hover:border-amber-400'
                  }`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{isUz ? "Eng ommabop — 50% Chegirma" : "Most Popular"}</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                        <Crown className="w-5 h-5 fill-amber-500/20" />
                      </div>
                      <span className="text-xs font-black text-amber-600 dark:text-amber-400">{isUz ? "Tavsiya etiladi" : "Recommended"}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-butter-100">{isUz ? "«Nurli Oila» To'plami" : "Radiant Family Pack"}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{isUz ? "Oylik to'liq ertakxonlik va tarbiya" : "Full month of bedtime moral tales"}</p>

                    <div className="my-4">
                      <span className="text-xs text-slate-400 line-through mr-1.5">120 000</span>
                      <span className="text-2xl sm:text-3xl font-black text-pine-900 dark:text-butter-200">69 000</span>
                      <span className="text-xs font-bold text-slate-500 ml-1">so'm</span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-600 shrink-0 font-bold" />
                        <span><b>10 ta to'liq shaxsiy qissa</b></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>80 ta OpenAI 3D Pixar rasmlar</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-600 shrink-0" />
                        <span><b>Ovozli Ertakchi (Audio TTS)</b></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-600 shrink-0" />
                        <span><b>PDF chop etish va yuklab olish</b></span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedPlan('pack10'); setActiveTab('card'); }}
                    className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isUz ? "Karta orqali to'lash" : "Pay with Card"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3. VIP Unlimited Subscription */}
                <div 
                  onClick={() => { setSelectedPlan('vip'); setActiveTab('card'); }}
                  className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPlan === 'vip' 
                      ? 'border-emerald-600 dark:border-emerald-400 bg-emerald-50/80 dark:bg-pine-900/90 shadow-lg scale-[1.02]' 
                      : 'border-slate-200 dark:border-pine-800/60 bg-white dark:bg-pine-950/60 hover:border-emerald-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                        <Gem className="w-5 h-5 fill-emerald-500/20" />
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">VIP Obuna</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-butter-100">{isUz ? "«VIP Cheksiz Obuna»" : "VIP Unlimited"}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{isUz ? "Cheksiz ertaklar va barcha yangiliklar" : "Unlimited stories every month"}</p>

                    <div className="my-4">
                      <span className="text-2xl sm:text-3xl font-black text-pine-900 dark:text-butter-200">99 000</span>
                      <span className="text-xs font-bold text-slate-500 ml-1">so'm / oy</span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                        <span><b>Cheksiz ertaklar yaratish</b></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Barcha 19 kitobning maxsus qahramonlari</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Tezkor VIP generatsiya navbati</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedPlan('vip'); setActiveTab('card'); }}
                    className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isUz ? "Karta orqali to'lash" : "Pay with Card"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Support info */}
              <div className="pt-4 border-t border-slate-200 dark:border-pine-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{isUz ? "Xavfsiz to'lov & 100% Sifat kafolati" : "Secure Payment & Money Back Guarantee"}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-pine-800 dark:text-butter-200">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <a href={CONTACT_CONFIG.telLink} className="hover:underline">{CONTACT_CONFIG.phone}</a>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
