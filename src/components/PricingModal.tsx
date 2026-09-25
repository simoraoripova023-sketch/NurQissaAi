'use client';

import React, { useState } from 'react';
import { 
  X, Sparkles, Check, Crown, Star, Gem, ShieldCheck, 
  CreditCard, ArrowRight, Heart, Gift, Zap, Send, Loader2, QrCode, Smartphone, Phone
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

  const [selectedPlan, setSelectedPlan] = useState<'pack3' | 'pack10' | 'vip'>('pack10');
  const [paymentProvider, setPaymentProvider] = useState<'click' | 'payme' | 'paynet' | 'uzum'>('click');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '');
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

  const handleStartCheckout = (plan: 'pack3' | 'pack10' | 'vip') => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);

    try {
      const plan = planDetails[selectedPlan];
      // Send payment confirmation notification to Admin Telegram
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'buyurtma',
          name: currentUser?.name || 'Hurmatli Ota-ona',
          contact: phoneNumber || currentUser?.phone || 'Telefon kiritilmagan',
          message: `💳 YANGI TO'LOV: ${plan.name} (${plan.price} so'm) | To'lov tizimi: ${paymentProvider.toUpperCase()} | Qissalar: ${plan.stories === 999 ? 'VIP Cheksiz' : plan.stories + ' ta'}`,
        }),
      }).catch(() => {});
    } catch {}

    setTimeout(() => {
      setIsProcessing(false);
      setIsCheckoutOpen(false);

      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.5 },
      });

      if (selectedPlan === 'pack3') {
        addStoryCredits(3);
        setSuccessMessage(isUz ? "🎉 3 ta yangi qissa balansingizga qo'shildi!" : "🎉 3 stories added to your balance!");
      } else if (selectedPlan === 'pack10') {
        addStoryCredits(10);
        setSuccessMessage(isUz ? "👑 10 ta qissa + Audio + PDF to'plami faollashtirildi!" : "👑 10 stories + Audio + PDF pack activated!");
      } else if (selectedPlan === 'vip') {
        setHasPaidSubscription(true);
        setSuccessMessage(isUz ? "💎 VIP Cheksiz Obuna muvaffaqiyatli yoqildi!" : "💎 VIP Unlimited Subscription activated!");
      }

      setTimeout(() => {
        setSuccessMessage(null);
        setIsPricingModalOpen(false);
      }, 1600);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl my-8 bg-[#FFFDF5] dark:bg-[#002621] rounded-3xl border-2 border-pine-800/40 dark:border-butter-200/40 shadow-2xl overflow-hidden">
        
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-pine-900 via-pine-800 to-emerald-900 p-6 sm:p-8 text-white">
          <button
            onClick={() => setIsPricingModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-butter-400/20 border border-butter-300/40 text-butter-200 text-xs font-bold mb-3">
              <Gift className="w-3.5 h-3.5 text-butter-300" />
              <span>{isUz ? "2 ta bepul sinov qissasi taqdim etiladi" : "2 Free Trial Stories Included"}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-butter-200">
              {isUz ? "Nurli Qissalar — Obuna & Qissa Paketlari" : "NurQissa AI — Plans & Story Packs"}
            </h2>
            
            <p className="mt-1.5 text-sm sm:text-base text-emerald-100/90">
              {isUz 
                ? "Har bir qissa OpenAI DALL-E 3 va Gemini orqali farzandingizga atab individual chiziladi. O'zingizga mos qulay tarifni tanlang!" 
                : "Every story is custom generated with OpenAI DALL-E 3 & Gemini tailored for your child. Choose your plan!"}
            </p>

            {/* Current Balance Status Bar */}
            <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-black/30 border border-butter-300/30">
              <span className="text-xs text-white/80">{isUz ? "Hozirgi balansingiz:" : "Current balance:"}</span>
              {hasPaidSubscription ? (
                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                  <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
                  VIP Cheksiz Obuna Faol
                </span>
              ) : (
                <span className="text-xs font-black text-butter-200 flex items-center gap-1">
                  <span>📖 {freeStoriesLeft} ta qissa qolgan</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 bg-emerald-500 text-white text-center font-bold text-base animate-bounce">
            {successMessage}
          </div>
        )}

        {/* Pricing Cards Grid OR Interactive Checkout Drawer */}
        <div className="p-6 sm:p-8">
          {isCheckoutOpen ? (
            /* ========================================================= */
            /* CHECKOUT DRAWER: Click, Paynet, Payme, Uzum Payment View */
            /* ========================================================= */
            <div className="space-y-6 max-w-xl mx-auto animate-fade-in">
              {/* Chosen Plan Summary Card */}
              <div className="p-5 rounded-2xl bg-butter-50 dark:bg-pine-900 border-2 border-pine-800/30 dark:border-butter-300/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {isUz ? "Tanlangan tarif:" : "Selected Plan:"}
                  </span>
                  <h4 className="text-lg font-black text-pine-900 dark:text-butter-200">
                    {planDetails[selectedPlan].name}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {planDetails[selectedPlan].desc}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-pine-900 dark:text-butter-200">
                    {planDetails[selectedPlan].price}
                  </span>
                  <span className="text-xs font-bold text-slate-500 block">so'm</span>
                </div>
              </div>

              {/* Payment Provider Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-pine-900 dark:text-butter-200">
                  {isUz ? "To'lov tizimini tanlang:" : "Select Payment System:"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Click */}
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('click')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                      paymentProvider === 'click'
                        ? 'border-[#0073FF] bg-[#0073FF]/10 shadow-md scale-[1.03]'
                        : 'border-slate-200 dark:border-pine-800 bg-white dark:bg-pine-950/60 hover:border-slate-400'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#0073FF] text-white flex items-center justify-center font-black text-xs shadow-sm">
                      CL
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-butter-100">Click Up</span>
                  </button>

                  {/* Paynet */}
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('paynet')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                      paymentProvider === 'paynet'
                        ? 'border-[#E30613] bg-[#E30613]/10 shadow-md scale-[1.03]'
                        : 'border-slate-200 dark:border-pine-800 bg-white dark:bg-pine-950/60 hover:border-slate-400'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#E30613] text-white flex items-center justify-center font-black text-xs shadow-sm">
                      PN
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-butter-100">Paynet</span>
                  </button>

                  {/* Payme */}
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('payme')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                      paymentProvider === 'payme'
                        ? 'border-[#00CCCC] bg-[#00CCCC]/10 shadow-md scale-[1.03]'
                        : 'border-slate-200 dark:border-pine-800 bg-white dark:bg-pine-950/60 hover:border-slate-400'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#00CCCC] text-white flex items-center justify-center font-black text-xs shadow-sm">
                      PM
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-butter-100">Payme</span>
                  </button>

                  {/* Uzum Bank */}
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('uzum')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                      paymentProvider === 'uzum'
                        ? 'border-[#7000FF] bg-[#7000FF]/10 shadow-md scale-[1.03]'
                        : 'border-slate-200 dark:border-pine-800 bg-white dark:bg-pine-950/60 hover:border-slate-400'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#7000FF] text-white flex items-center justify-center font-black text-xs shadow-sm">
                      UZ
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-butter-100">Uzum Bank</span>
                  </button>
                </div>
              </div>

              {/* Phone number confirmation */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-pine-900 dark:text-butter-200">
                  {isUz ? "Hisob telefon raqamingiz (To'lov cheki yuboriladi):" : "Account Phone Number (for receipt):"}
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-pine-700 dark:text-butter-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-pine-950 border-2 border-pine-800/30 dark:border-butter-300/30 text-xs font-bold font-mono text-slate-900 dark:text-butter-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-5 py-3 rounded-2xl border border-slate-300 dark:border-pine-700 hover:bg-slate-50 dark:hover:bg-pine-900 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
                >
                  {isUz ? "Orqaga" : "Back"}
                </button>

                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 text-white font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isUz ? "To'lov amalga oshirilmoqda..." : "Processing payment..."}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-200" />
                      <span>
                        {paymentProvider.toUpperCase()} {isUz ? "orqali to'lash va faollashtirish" : "Pay & Activate"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* PLAN SELECTION CARDS VIEW */
            /* ========================================================= */
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* 1. Pack 3 Stories */}
                <div 
                  onClick={() => handleStartCheckout('pack3')}
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
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
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
                      <li className="flex items-center gap-2 text-slate-400">
                        <X className="w-4 h-4 shrink-0" />
                        <span>Ovozli ertakchi (TTS) yo'q</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleStartCheckout('pack3'); }}
                    className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 dark:bg-pine-800 hover:bg-slate-800 text-white transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>{isUz ? "3 ta qissa olish" : "Get 3 Stories"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 2. Pack 10 Stories (MOST POPULAR) */}
                <div 
                  onClick={() => handleStartCheckout('pack10')}
                  className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPlan === 'pack10' 
                      ? 'border-amber-500 bg-amber-50/90 dark:bg-pine-900 shadow-xl scale-[1.04]' 
                      : 'border-amber-300/60 bg-white dark:bg-pine-950/60 hover:border-amber-400'
                  }`}
                >
                  {/* Badge */}
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
                    onClick={(e) => { e.stopPropagation(); handleStartCheckout('pack10'); }}
                    className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>{isUz ? "10 ta qissa to'plamini olish" : "Get 10 Stories Pack"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3. VIP Unlimited Subscription */}
                <div 
                  onClick={() => handleStartCheckout('vip')}
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
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Ovozli audio + PDF cheksiz</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleStartCheckout('vip'); }}
                    className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>{isUz ? "VIP Obunani yoqish" : "Activate VIP"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Payment Method Providers & Guarantees */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-pine-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{isUz ? "Qo'llab-quvvatlanuvchi to'lovlar:" : "Accepted Payments:"}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-[#0073FF]/15 text-[#0073FF] border border-[#0073FF]/30">Click</span>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-[#E30613]/15 text-[#E30613] border border-[#E30613]/30">Paynet</span>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-[#00CCCC]/15 text-[#00CCCC] border border-[#00CCCC]/30">Payme</span>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-[#7000FF]/15 text-[#7000FF] border border-[#7000FF]/30">Uzum</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{isUz ? "Xavfsiz to'lov & 100% Sifat kafolati" : "Secure Payment & Money Back Guarantee"}</span>
                </div>
              </div>

              {/* Support Links (Phone & Telegram) */}
              <div className="pt-3 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-pine-800 mt-4 space-y-2">
                <p>{isUz ? "Savollaringiz bormi yoki yordam kerakmi?" : "Have questions or need help?"}</p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <a
                    href={CONTACT_CONFIG.telLink}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-emerald-700/30 hover:bg-emerald-700/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{CONTACT_CONFIG.phone}</span>
                  </a>
                  <a
                    href={CONTACT_CONFIG.telegramBot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-sky-600/30 hover:bg-sky-600/50 border border-sky-400/40 text-sky-200 text-xs font-bold transition-all shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Telegram: {CONTACT_CONFIG.telegramUsername}</span>
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
