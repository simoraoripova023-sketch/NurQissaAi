'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, Check, Crown, Star, Gem, ShieldCheck, 
  CreditCard, ArrowRight, Gift, Loader2, 
  Phone, Copy, CheckCircle2, AlertTriangle, QrCode, 
  Smartphone, Wallet, Zap, ExternalLink, PlayCircle, ShieldAlert, CheckCircle, RefreshCw
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { CONTACT_CONFIG } from '@/lib/contact';
import confetti from 'canvas-confetti';

type PaymentProvider = 'uzum' | 'click' | 'paynet' | 'card';

export default function PricingModal() {
  const { 
    isPricingModalOpen, setIsPricingModalOpen, 
    freeStoriesLeft, hasPaidSubscription, 
    addStoryCredits, setHasPaidSubscription,
    currentUser,
    locale 
  } = useAppStore();

  const CARD_NUMBER = process.env.NEXT_PUBLIC_PAYMENT_CARD_NUMBER || "9860 0803 1682 3584";
  const CARD_RAW = CARD_NUMBER.replace(/\s+/g, '');
  const CARD_HOLDER = process.env.NEXT_PUBLIC_PAYMENT_CARD_HOLDER || "Simora Oripova";
  const PAYNET_BUSINESS_URL = "https://app.paynet.uz/qr-online/00020101021140440012qr-online.uz01186r2covoUU7ztMySiv10202115204531153038605802UZ5910AO'PAYNET'6008Tashkent610610002164280002uz0106PAYNET0208Toshkent80520012qr-online.uz03097120207070419marketing@paynet.uz6304984F";

  const [activeTab, setActiveTab] = useState<'checkout' | 'plans'>('checkout');
  const [selectedPlan, setSelectedPlan] = useState<'pack3' | 'pack10' | 'vip'>('pack10');
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('paynet');
  
  // Card & checkout states
  const [isCopied, setIsCopied] = useState(false);
  const [hasPaidClicked, setHasPaidClicked] = useState(false);
  const [senderName, setSenderName] = useState(currentUser?.name || '');
  const [senderPhone, setSenderPhone] = useState(currentUser?.phone || '');
  const [paymentNote, setPaymentNote] = useState('');
  const [isSubmittingPaid, setIsSubmittingPaid] = useState(false);
  const [paidSubmitted, setPaidSubmitted] = useState(false);

  // Anti-fraud Order & Real-Time Verification States
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [isVerifyingStatus, setIsVerifyingStatus] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState<string | null>(null);
  const [isSuccessPaid, setIsSuccessPaid] = useState(false);

  // Click Merchant States
  const [clickLoading, setClickLoading] = useState(false);
  const [clickModalOpen, setClickModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [clickPaymentUrl, setClickPaymentUrl] = useState<string>('');

  const isUz = locale === 'uz';

  const planDetails = {
    pack3: {
      name: isUz ? "«Kichkintoy» To'plami" : "Starter Pack",
      price: "29 000",
      amount: 29000,
      stories: 3,
      cashbackUZS: "1 450",
      desc: isUz ? "3 ta to'liq shaxsiy qissa" : "3 personalized stories",
    },
    pack10: {
      name: isUz ? "«Nurli Oila» To'plami" : "Radiant Family Pack",
      price: "69 000",
      amount: 69000,
      stories: 10,
      cashbackUZS: "3 450",
      desc: isUz ? "10 ta qissa + Audio + PDF" : "10 stories + Audio + PDF",
    },
    vip: {
      name: isUz ? "«VIP Cheksiz Obuna»" : "VIP Unlimited",
      price: "99 000",
      amount: 99000,
      stories: 999,
      cashbackUZS: "4 950",
      desc: isUz ? "Cheksiz ertaklar & tezkor generatsiya" : "Unlimited stories & priority queue",
    },
  };

  const currentPlan = planDetails[selectedPlan];

  // Initialize or update authenticated order on plan change
  useEffect(() => {
    if (!isPricingModalOpen) return;
    let isMounted = true;
    fetch('/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planKey: selectedPlan,
        userName: senderName.trim() || currentUser?.name || 'Mijoz',
        userPhone: senderPhone.trim() || currentUser?.phone || '',
        provider: selectedProvider,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data?.order) {
          setActiveOrder(data.order);
        }
      })
      .catch((err) => console.error('Error creating order:', err));

    return () => { isMounted = false; };
  }, [selectedPlan, isPricingModalOpen, selectedProvider]);

  // Real-time polling: automatically activates when owner approves from Telegram
  useEffect(() => {
    if (!isVerifyingStatus || !activeOrder?.id) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/check-status?orderId=${activeOrder.id}`);
        const data = await res.json();
        if (data?.order?.isPaid) {
          clearInterval(interval);
          setIsVerifyingStatus(false);
          setIsSuccessPaid(true);
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
          if (activeOrder.planKey === 'vip') {
            setHasPaidSubscription(true);
          } else {
            addStoryCredits(activeOrder.storiesGranted || (selectedPlan === 'pack3' ? 3 : 10));
          }
        } else if (data?.order?.isRejected) {
          clearInterval(interval);
          setIsVerifyingStatus(false);
          setVerificationFailed(
            "To'lov summasi to'liq tushmagani yoki tarifga mos kelmagani sababli buyurtma rad etildi. Iltimos adminga murojaat qiling."
          );
        }
      } catch (err) {
        console.error('Check status error:', err);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isVerifyingStatus, activeOrder?.id, activeOrder?.planKey, activeOrder?.storiesGranted, selectedPlan, addStoryCredits, setHasPaidSubscription]);

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
    setTimeout(() => setIsCopied(false), 2500);
  };

  const providerNames: Record<PaymentProvider, string> = {
    paynet: "🟢 Paynet Business (Rasmiy QR)",
    click: "🔵 Click (Ilova / P2P)",
    uzum: "💜 Uzum Bank (5% Keshbek)",
    card: "💳 Bank Kartasi (Simora Oripova)"
  };

  const handleConfirmPaidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder?.id) return;
    setIsSubmittingPaid(true);
    setVerificationFailed(null);

    try {
      const res = await fetch('/api/payment/submit-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: activeOrder.id,
          userName: senderName.trim() || currentUser?.name || 'Mijoz',
          userPhone: senderPhone.trim() || currentUser?.phone || '',
          provider: selectedProvider,
          receiptNote: paymentNote.trim() || `${providerNames[selectedProvider]} orqali to'lov cheki yuborildi`,
        }),
      });
      const data = await res.json();
      if (data.alreadyPaid) {
        setIsSuccessPaid(true);
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        if (activeOrder.planKey === 'vip') {
          setHasPaidSubscription(true);
        } else {
          addStoryCredits(activeOrder.storiesGranted || (selectedPlan === 'pack3' ? 3 : 10));
        }
        return;
      }

      setPaidSubmitted(true);
      setIsVerifyingStatus(true);
    } catch (err) {
      console.error('Submit payment report error:', err);
    } finally {
      setIsSubmittingPaid(false);
    }
  };

  if (!isPricingModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in pt-[env(safe-area-inset-top,16px)] pb-[env(safe-area-inset-bottom,16px)]">
      <div className="relative w-full max-w-4xl my-auto bg-[#FFFDF5] dark:bg-[#002621] rounded-3xl border-2 border-pine-800/40 dark:border-butter-200/40 shadow-2xl overflow-hidden max-h-[94dvh] flex flex-col">
        
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-pine-950 via-pine-900 to-emerald-950 p-4 sm:p-6 text-white shrink-0">
          <button
            onClick={() => setIsPricingModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-butter-400/20 border border-butter-300/40 text-butter-200 text-xs font-bold mb-2">
              <Gift className="w-3.5 h-3.5 text-butter-300" />
              <span>{isUz ? "NurQissa — Click Merchant & To'lov Tizimi" : "NurQissa — Click Merchant & Billing"}</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-display tracking-tight text-butter-200">
              {isUz ? "Ertaklar Olami Obunasi & To'lov" : "Storybook Subscription & Checkout"}
            </h2>

            {/* Current Balance Status Bar */}
            <div className="mt-2.5 inline-flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-black/40 border border-butter-300/30 text-xs">
              <span className="text-white/80">{isUz ? "Hozirgi hisobingiz:" : "Current balance:"}</span>
              {hasPaidSubscription ? (
                <span className="font-black text-amber-300 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  VIP Cheksiz Obuna Faol
                </span>
              ) : (
                <span className="font-black text-butter-200 flex items-center gap-1">
                  <span>📖 {freeStoriesLeft} ta qissa mavjud</span>
                </span>
              )}
            </div>
          </div>

          {/* Tab Switcher: Tezkor To'lov VS Barcha Tariflar */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/15">
            <button
              onClick={() => setActiveTab('checkout')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'checkout'
                  ? 'bg-amber-400 text-pine-950 shadow-md scale-[1.02] border border-amber-200 font-extrabold'
                  : 'bg-white/10 hover:bg-white/20 text-butter-200/90'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-950" />
              <span>{isUz ? "⚡ Yagona To'lov (QR & Ilova)" : "⚡ Universal Payment"}</span>
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
          {/* TAB 1: TEZKOR TO'LOV TIZIMI (CLICK MERCHANT, UZUM, PAYNET, KARTA) */}
          {/* ========================================================================= */}
          {activeTab === 'checkout' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
              
              {/* 1. Tarif tanlash qatori */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-pine-900 dark:text-butter-200 uppercase tracking-wider">
                    {isUz ? "1. Obuna tarifini tanlang:" : "1. Choose Plan:"}
                  </label>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    {currentPlan.desc}
                  </span>
                </div>

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
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black uppercase tracking-wider shadow-xs whitespace-nowrap">
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

              {/* ===================================================================== */}
              {/* 2. YAGONA TO'LOV TIZIMI (MILLIY QR & BARCHA BANK ILovalari) */}
              {/* ===================================================================== */}
              <div className="space-y-3.5 pt-1 animate-fade-in">
                
                {/* Header with supported app badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-black text-pine-900 dark:text-butter-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isUz ? "2. Yagona To'lov Tizimi (Istalgan ilovadan):" : "2. Universal Payment (From Any App):"}</span>
                  </label>
                  
                  {/* Logos: Click, Payme, Uzum, Paynet */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-blue-600/10 text-blue-700 dark:text-blue-300 text-[10px] font-black border border-blue-400/30">
                      Click
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-black border border-emerald-400/30">
                      Payme
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-600/10 text-purple-700 dark:text-purple-300 text-[10px] font-black border border-purple-400/30">
                      Uzum
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-teal-600/10 text-teal-700 dark:text-teal-300 text-[10px] font-black border border-teal-400/30">
                      Paynet
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-600/10 text-amber-700 dark:text-amber-300 text-[10px] font-black border border-amber-400/30">
                      Humo / Uzcard
                    </span>
                  </div>
                </div>

                {/* THE UNIFIED MASTER PAYMENT CARD */}
                <div className="relative rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-[#012E27] via-[#01241F] to-[#001411] border-2 border-emerald-400/80 shadow-2xl text-white overflow-hidden space-y-5">
                  <div className="absolute -top-16 -right-16 w-52 h-52 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

                  {/* QR and Details Layout */}
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-5 sm:gap-7">
                    
                    {/* The Official Milliy QR Code Image */}
                    <div className="relative p-3.5 rounded-2xl bg-white shadow-2xl flex flex-col items-center justify-center shrink-0 border-2 border-emerald-400">
                      <img 
                        src="/images/paynet-qr.png"
                        alt="Rasmiy Milliy QR Code"
                        className="w-36 h-36 sm:w-44 sm:h-44 object-contain rounded-xl"
                      />
                      <span className="text-[10px] font-black text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-md mt-2 border border-emerald-300 font-mono tracking-tight text-center">
                        AO PAYNET • MILLIY QR
                      </span>
                    </div>

                    {/* Explanations & Direct Action Buttons */}
                    <div className="space-y-3 text-center md:text-left flex-1">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold border border-emerald-300/30 mb-1.5">
                          <QrCode className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Markaziy Bankning Rasmiy Milliy QR Standarti</span>
                        </div>
                        <h3 className="text-base sm:text-xl font-black text-white leading-tight">
                          Paynet, Click, Payme yoki Uzum orqali to'lang
                        </h3>
                        <p className="text-xs text-emerald-200/90 leading-relaxed mt-1">
                          Ushbu QR-kodni telefon kamerangiz yoki <b>istalgan bank ilovasi</b> (Paynet, Click, Payme, Uzum) orqali skanerlang — barchasi bir xilda 100% taniydi!
                        </p>
                      </div>

                      {/* Primary Quick Buttons */}
                      <div className="pt-1 flex flex-wrap items-center gap-2.5 justify-center md:justify-start">
                        {/* 1-Click Paynet App/Web for Phone users */}
                        <a
                          href={PAYNET_BUSINESS_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-pine-950 text-xs sm:text-sm font-black inline-flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all text-center"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Ilovada to'lash ({currentPlan.price} so'm)</span>
                        </a>

                        {/* Direct Card Copy Button */}
                        <button
                          type="button"
                          onClick={handleCopyCard}
                          className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-emerald-400/40 text-emerald-100 text-xs font-black inline-flex items-center gap-2 transition-all cursor-pointer"
                        >
                          {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                          <span>{isCopied ? "Karta nusxalandi!" : "Karta raqamini nusxalash"}</span>
                        </button>
                      </div>

                      {/* Card Details snippet */}
                      <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-emerald-200/80 justify-center md:justify-start">
                        <span>💳 <b>Karta:</b> <span className="font-mono text-white select-all">{CARD_NUMBER}</span></span>
                        <span>👤 <b>Egasi:</b> <span className="text-white uppercase">{CARD_HOLDER}</span></span>
                      </div>
                    </div>

                  </div>

                  {/* Anti-Fraud Order Token Details */}
                  {activeOrder && (
                    <div className="pt-3 border-t border-emerald-400/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs relative z-10">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Xavfsiz Buyurtma kodi: <b className="font-mono text-amber-300">#{activeOrder.id}</b></span>
                      </div>
                      <div className="text-emerald-300 font-bold">
                        Biriktirilgan miqdor: <b className="text-white">{currentPlan.price} so'm</b> ({currentPlan.stories} ta qissa)
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* QAT'IY NAZORAT BANNERI */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 dark:border-amber-400/30 flex items-start gap-3 text-left">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                    {isUz ? "Qat'iy Nazorat & Anti-Firibgarlik Qoidasi:" : "Strict Verification & Anti-Fraud Rule:"}
                  </h5>
                  <p className="text-xs text-amber-950 dark:text-amber-100/90 leading-relaxed">
                    {isUz ? (
                      <>
                        To'lov aynan belgilangan <b>{currentPlan.price} so'm</b> bo'lishi shart! Agar ko'rsatilgan summadan <b>kam to'lansa yoki soxta ariza berilsa</b>, tizim va Telegram bot nazorati orqali buyurtma <b>avtomatik RAD ETILADI</b> va hisobga hech qanday ertak qo'shilmaydi.
                      </>
                    ) : (
                      <>
                        The transfer must be exactly <b>{currentPlan.price} UZS</b>. Underpayment is automatically rejected and will not grant credits.
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* XATOLIK BO'LGANDA XABAR */}
              {verificationFailed && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-500 text-rose-900 dark:text-rose-200 text-xs font-bold flex items-center justify-between gap-3 animate-fade-in">
                  <span>⚠️ {verificationFailed}</span>
                  <button
                    type="button"
                    onClick={() => { setVerificationFailed(null); setPaidSubmitted(false); }}
                    className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] shrink-0 cursor-pointer"
                  >
                    Qayta urinish
                  </button>
                </div>
              )}

              {/* KARTA / CLICK / UZUM BILAN TO'LANGANDA CHEK TASDIQLASH */}
              {!paidSubmitted && !isSuccessPaid && (
                <div className="pt-2 animate-fade-in space-y-4">
                  {!hasPaidClicked ? (
                    <button
                      type="button"
                      onClick={() => setHasPaidClicked(true)}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-700/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 border-2 border-amber-300 cursor-pointer"
                    >
                      <Check className="w-5 h-5 text-amber-200" />
                      <span>{isUz ? "To'lovni bajardim — 1-Bosishda Tasdiqlash" : "I Made Payment — Confirm"}</span>
                      <ArrowRight className="w-5 h-5 text-amber-200" />
                    </button>
                  ) : (
                    <form
                      onSubmit={handleConfirmPaidSubmit}
                      className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-pine-950 border-2 border-emerald-500 shadow-xl space-y-4 animate-fade-in"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-pine-800 pb-2.5">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-black text-sm">
                          <ShieldCheck className="w-5 h-5 text-emerald-500" />
                          <span>{isUz ? "To'lov Ma'lumotlarini Yuborish" : "Submit Payment Audit"}</span>
                        </div>
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                          {currentPlan.price} so'm
                        </span>
                      </div>

                      <div className="space-y-3">
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
                            {isUz ? "Telefon raqamingiz (to'lov chekingiz uchun):" : "Your Phone Number:"}
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

                        <div>
                          <label className="block text-[11px] font-bold text-pine-900 dark:text-butter-200 mb-1">
                            {isUz ? "Chek tranzaksiya kodi yoki izoh (ixtiyoriy):" : "Transaction Note / Receipt (Optional):"}
                          </label>
                          <input
                            type="text"
                            placeholder={isUz ? "Masalan: Click tranzaksiya #382910 yoki soat 14:30 da o'tkazildi" : "e.g. Paid at 14:30"}
                            value={paymentNote}
                            onChange={(e) => setPaymentNote(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-pine-700 bg-white dark:bg-pine-900 text-xs font-medium text-slate-900 dark:text-butter-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                            <span>{isUz ? "Botga uzatilmoqda..." : "Forwarding to Bot..."}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{isUz ? "To'lovni Tasdiqlash & Faollashtirish" : "Confirm & Activate"}</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TO'LOV TEKSHIRILMOQDA (REAL-TIME LIVE WAITING) */}
              {paidSubmitted && !isSuccessPaid && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50 dark:from-pine-950 dark:to-emerald-950 border-2 border-emerald-500 shadow-xl text-center space-y-4 animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border-2 border-emerald-500 mx-auto flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <RefreshCw className="w-7 h-7 animate-spin" />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-emerald-950 dark:text-emerald-200">
                      {isUz ? "To'lovingiz tekshirilmoqda..." : "Payment under verification..."}
                    </h4>
                    <p className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                      Buyurtma kodi: #{activeOrder?.id}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    {isUz 
                      ? "Arizangiz Telegram botimizga yuborildi. Administrator kartaga to'lov kelganini tasdiqlashi bilan, ushbu sahifangiz avtomatik yangilanadi va ertaklar balansingizga qo'shiladi (kutib o'tirish shart emas)!"
                      : "Your payment verification has been submitted to Telegram bot. Once verified, this screen will instantly unlock your stories!"}
                  </p>

                  <div className="pt-1 flex items-center justify-center gap-3">
                    <a
                      href={`https://t.me/nurqissaaa_bot?start=pay_${activeOrder?.id || ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md inline-flex items-center gap-1.5 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Chekni Botga yuborish (@nurqissaaa_bot)</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setIsPricingModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-pine-800 dark:hover:bg-pine-700 text-slate-800 dark:text-butter-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      {isUz ? "Yopish" : "Close"}
                    </button>
                  </div>
                </div>
              )}

              {/* TO'LOV MUVAFFAQIYATLI BO'LGANDA (100% SUCCESS) */}
              {isSuccessPaid && (
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white border-2 border-amber-300 shadow-2xl text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-white text-emerald-600 mx-auto flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black font-display text-amber-200">
                      {isUz ? "Tabriklaymiz! To'lov Tasdiqlandi! 🎉" : "Congratulations! Payment Approved! 🎉"}
                    </h3>
                    <p className="text-sm font-bold text-white/90">
                      {activeOrder?.planKey === 'vip' 
                        ? "VIP Cheksiz Obuna hisobingizga muvaffaqiyatli biriktirildi!"
                        : `${activeOrder?.storiesGranted || currentPlan.stories} ta yangi ertak hisobingizga qo'shildi!`}
                    </p>
                  </div>

                  <p className="text-xs text-white/80 max-w-md mx-auto leading-relaxed">
                    {isUz 
                      ? "Endi siz bolangiz uchun ajoyib qahramonlik ertaklarini xohlagancha yaratishingiz va tinglashingiz mumkin."
                      : "You can now create personalized bedtime moral stories with full access."}
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsPricingModalOpen(false)}
                      className="py-3 px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 text-pine-950 text-sm font-black shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      {isUz ? "Ertaklar Yaratishni Boshlash 🚀" : "Start Creating Stories 🚀"}
                    </button>
                  </div>
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
                  onClick={() => { setSelectedPlan('pack3'); setActiveTab('checkout'); }}
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
                    onClick={(e) => { e.stopPropagation(); setSelectedPlan('pack3'); setActiveTab('checkout'); }}
                    className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 dark:bg-pine-800 hover:bg-slate-800 text-white transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isUz ? "To'lashga o'tish" : "Proceed to Pay"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 2. Pack 10 Stories (MOST POPULAR) */}
                <div 
                  onClick={() => { setSelectedPlan('pack10'); setActiveTab('checkout'); }}
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
                    onClick={(e) => { e.stopPropagation(); setSelectedPlan('pack10'); setActiveTab('checkout'); }}
                    className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isUz ? "To'lashga o'tish" : "Proceed to Pay"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3. VIP Unlimited Subscription */}
                <div 
                  onClick={() => { setSelectedPlan('vip'); setActiveTab('checkout'); }}
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
                    onClick={(e) => { e.stopPropagation(); setSelectedPlan('vip'); setActiveTab('checkout'); }}
                    className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isUz ? "To'lashga o'tish" : "Proceed to Pay"}</span>
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

      {/* ========================================================================= */}
      {/* CLICK MERCHANT SANDBOX & TESTING SIMULATOR MODAL */}
      {/* ========================================================================= */}
      {clickModalOpen && currentOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-pine-950 rounded-3xl border-2 border-blue-500 shadow-2xl p-5 sm:p-7 space-y-5 text-slate-900 dark:text-white">
            <button
              onClick={() => setClickModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-pine-900 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Click Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                C
              </div>
              <div>
                <h3 className="text-lg font-black text-blue-950 dark:text-blue-100 flex items-center gap-2">
                  <span>Click Merchant To'lov</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 text-[10px] font-bold">
                    Sandbox Test
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Xizmat: <b>NurQissa (nur-qissa.uz)</b>
                </p>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-pine-900/60 border border-blue-200 dark:border-pine-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Buyurtma ID:</span>
                <span className="font-mono font-bold text-blue-950 dark:text-blue-200">{currentOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Tanlangan tarif:</span>
                <span className="font-bold">{currentOrder.planName}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-1 border-t border-blue-200/60 dark:border-pine-800">
                <span className="text-slate-800 dark:text-butter-200">To'lov summasi:</span>
                <span className="text-blue-700 dark:text-amber-300">{Number(currentOrder.amount).toLocaleString('uz-UZ')} so'm</span>
              </div>
            </div>

            {/* Live Click Payment Instructions */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-pine-900/50 border border-blue-200 dark:border-pine-800 text-left space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5 font-black text-blue-950 dark:text-blue-200">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Xavfsiz rasmiy Click to'lovi</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Tugmani bosganingizda rasmiy <b>my.click.uz</b> to'lov sahifasiga o'tasiz. To'lov muvaffaqiyatli yakunlangach, balansingiz avtomatik ravishda to'ldiriladi va rasmiy kvitansiya taqdim etiladi.
                </p>
              </div>

              {/* Direct Click Redirect Link */}
              <a
                href={clickPaymentUrl}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-blue-700/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>Click ilovasi orqali to'lash ({Number(currentOrder.amount).toLocaleString('uz-UZ')} so'm)</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setClickModalOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline cursor-pointer"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
