'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Trophy, Award, Sparkles, Star, Flame, CheckCircle2, ShieldCheck, 
  Printer, Share2, Crown, ArrowLeft, Check, Edit3, Heart
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import confetti from 'canvas-confetti';

type CertificateTheme = 'boy' | 'girl' | 'classic';

export default function WeeklyRewardsCertificate() {
  const { 
    locale, 
    nurCoins, 
    addNurCoins, 
    dailyStreak, 
    dailyMissions, 
    childProfile, 
    currentUser,
    updateChildProfile 
  } = useAppStore();

  const isUz = locale === 'uz';
  const certificateRef = useRef<HTMLDivElement>(null);

  // Active theme / gender mode: 'boy' | 'girl' | 'classic'
  const initialTheme: CertificateTheme = childProfile.gender === 'girl' ? 'girl' : 'boy';
  const [selectedTheme, setSelectedTheme] = useState<CertificateTheme>(initialTheme);

  // Child name state with inline editing support
  const defaultBoyName = isUz ? "Alijon Boyqo'ziyev" : "Ali Boyqoziyev";
  const defaultGirlName = isUz ? "Fotimaxon Olimova" : "Fatima Olimova";
  
  const initialName = childProfile.child_name || currentUser?.childName || (selectedTheme === 'girl' ? defaultGirlName : defaultBoyName);
  const [childName, setChildName] = useState(initialName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(initialName);

  // Weekly Chest Claim state
  const [hasClaimedChest, setHasClaimedChest] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Mission stats
  const completedMissions = dailyMissions.filter(m => m.isCompleted && m.isParentApproved).length;

  // Handle Theme Change
  const handleThemeChange = (theme: CertificateTheme) => {
    setSelectedTheme(theme);
    if (!childProfile.child_name) {
      if (theme === 'girl') {
        setChildName(defaultGirlName);
        setTempName(defaultGirlName);
      } else if (theme === 'boy') {
        setChildName(defaultBoyName);
        setTempName(defaultBoyName);
      }
    }
  };

  // Handle Weekly Chest Claim
  const handleClaimChest = () => {
    if (hasClaimedChest) return;
    setHasClaimedChest(true);
    addNurCoins(150);

    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.55 },
      colors: ['#FFD700', '#FFA500', '#10B981', '#6366F1', '#EC4899'],
    });
  };

  // Handle Name Save
  const handleSaveName = () => {
    if (tempName.trim()) {
      setChildName(tempName.trim());
      updateChildProfile({ child_name: tempName.trim() });
    }
    setIsEditingName(false);
  };

  // Handle Print Certificate (Single clean page)
  const handlePrint = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    window.print();
  };

  // Handle Share / Copy Link
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Current Date formatted in Uzbek/English
  const currentDateFormatted = new Date().toLocaleDateString(isUz ? 'uz-UZ' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-8">
      
      {/* Top Header & Navigation Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print print:hidden">
        <Link
          href="/missions"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/90 dark:bg-pine-900/90 border border-slate-200 dark:border-pine-800 text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-butter-100 dark:hover:bg-pine-800 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isUz ? "Kunlik Vazifalar Sahifasiga Qaytish" : "Back to Missions"}</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-pine-900 text-slate-800 dark:text-butter-200 text-xs font-bold border border-slate-300 dark:border-pine-700 hover:bg-slate-200 transition-all shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? (isUz ? "Havola Nusxalandi! ✓" : "Link Copied! ✓") : (isUz ? "Ulashish" : "Share")}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 text-white text-xs font-black shadow-lg hover:scale-105 transition-all"
          >
            <Printer className="w-4 h-4 text-amber-100" />
            <span>{isUz ? "Tashakkurnomani Chop Etish / PDF" : "Print / Download Certificate"}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* THEME & GENDER SELECTOR (O'g'il bolalar / Qizlar / Klassik) */}
      {/* ========================================================================= */}
      <div className="no-print print:hidden bg-white dark:bg-pine-950 p-5 rounded-3xl border-2 border-amber-300/70 dark:border-pine-800 shadow-md space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-pine-800">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
              🎨 {isUz ? "Tashakkurnoma Dizayni & Qog'ozi:" : "Certificate Paper & Template:"}
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {isUz ? "O'g'il bolalar va qizlar uchun maxsus rasmli go'zal qog'oz uslubini tanlang:" : "Choose custom illustrated certificate paper for boys or girls:"}
            </p>
          </div>

          {/* Preset Buttons for Boy / Girl / Classic */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => handleThemeChange('boy')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 border-2 ${
                selectedTheme === 'boy'
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200 shadow-md ring-2 ring-sky-400'
                  : 'border-slate-200 dark:border-pine-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <span className="text-base">👦 👑</span>
              <span>{isUz ? "O'g'il bolalar (Moviy Toj)" : "Boys (Blue Crown)"}</span>
            </button>

            <button
              onClick={() => handleThemeChange('girl')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 border-2 ${
                selectedTheme === 'girl'
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/60 text-pink-900 dark:text-pink-200 shadow-md ring-2 ring-pink-400'
                  : 'border-slate-200 dark:border-pine-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <span className="text-base">👧 🌸</span>
              <span>{isUz ? "Qizlar (Pushti Gulzor)" : "Girls (Pink Floral)"}</span>
            </button>

            <button
              onClick={() => handleThemeChange('classic')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 border-2 ${
                selectedTheme === 'classic'
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 shadow-md ring-2 ring-amber-400'
                  : 'border-slate-200 dark:border-pine-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <span className="text-base">🕌 🌟</span>
              <span>{isUz ? "Klassik Islomiy Oltin" : "Classic Islamic Gold"}</span>
            </button>
          </div>
        </div>

        {/* Child Name Edit Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-butter-100">
              {isUz ? "Tashakkurnomaga yoziladigan ism:" : "Name written on certificate:"}{' '}
              <span className="font-black text-amber-700 dark:text-amber-300 text-base">{childName}</span>
            </span>
          </div>

          {isEditingName ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="flex-1 sm:w-64 px-3.5 py-1.5 rounded-xl border-2 border-amber-400 text-xs font-bold text-slate-800 dark:text-slate-100 dark:bg-pine-950 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                placeholder={isUz ? "Farzand ismini kiriting..." : "Enter child's full name..."}
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm"
              >
                {isUz ? "Saqlash" : "Save"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Quick Suggestion buttons */}
              <div className="flex items-center gap-1.5">
                {(selectedTheme === 'girl' 
                  ? [isUz ? "Fotimaxon" : "Fatima", isUz ? "Maryamxon" : "Maryam", isUz ? "Zahroxon" : "Zahra"]
                  : [isUz ? "Alijon" : "Ali", isUz ? "Muhammadjon" : "Muhammad", isUz ? "Zubayr" : "Zubayr"]
                ).map((name) => (
                  <button
                    key={name}
                    onClick={() => {
                      setChildName(name);
                      setTempName(name);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-pine-900 hover:bg-amber-100 dark:hover:bg-pine-800 text-[11px] font-bold text-slate-700 dark:text-butter-200 border border-slate-200 dark:border-pine-700 transition-colors"
                  >
                    + {name}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setTempName(childName);
                  setIsEditingName(true);
                }}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-white dark:bg-pine-800 border border-amber-300 dark:border-pine-700 text-amber-800 dark:text-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors shadow-sm ml-auto sm:ml-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isUz ? "O'zgartirish" : "Edit Name"}</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. CERTIFICATE RENDER AREA WITH HARMONIOUS PROPORTIONS & TYPOGRAPHY */}
      {/* ========================================================================= */}
      <div className="flex justify-center px-2">
        
        {/* ===================================================        {/* ======================================================================= */}
        {/* OPTION A: BOYS ROYAL SKY-BLUE CERTIFICATE (O'g'il bolalar) */}
        {/* ======================================================================= */}
        {selectedTheme === 'boy' && (
          <div 
            ref={certificateRef}
            id="tashakkurnoma-print-area"
            className="w-full max-w-[600px] aspect-[896/1200] rounded-3xl relative overflow-hidden shadow-2xl border-4 border-amber-400/80 text-slate-900 select-none print:shadow-none print:border-none print:m-0 print:max-w-full print:aspect-[896/1200] print:w-full print:h-full text-center"
          >
            {/* Background Illustration Image */}
            <img 
              src="/certificates/boy_certificate.jpg" 
              alt="Boy Certificate Background" 
              className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0"
            />

            {/* Content Container Overlay */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between px-[10%] pt-[8%] pb-[6%]">
              
              {/* 1. TOP SECTION: Bismillah, Poetic Hamd & Gratitude */}
              <div className="space-y-1.5 pt-1">
                {/* Bismillah Calligraphy */}
                <p className="text-sm sm:text-base md:text-lg font-serif text-[#78350f] font-bold italic tracking-wide" style={{ fontFamily: 'Amiri, serif' }}>
                  بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </p>

                {/* Symmetrical Poetic Hamd & Dua (Foydalanuvchi matni asosida) */}
                <div className="text-[10px] sm:text-[11.5px] md:text-[12.5px] font-serif italic text-amber-950/90 leading-snug space-y-0.5 max-w-[90%] mx-auto font-medium">
                  {isUz ? (
                    <>
                      <p className="font-bold text-[#78350f]">Alhamdulillah, Robbil a&apos;lamin.</p>
                      <p>Bizga iymon ne&apos;matini, ilm o&apos;rganishda va fazilatlar bilan bezalishda davomiy bo&apos;lish istagini berdi.</p>
                      <p className="font-semibold text-sky-950">Alloh bizni o&apos;zining solih bandalari va go&apos;zal axloqli bolalari qilib saqlasin!</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-[#78350f]">Alhamdulillah, Rabbil &apos;Alamin.</p>
                      <p>Who blessed us with faith and continuous eagerness to learn virtues.</p>
                      <p className="font-semibold text-sky-950">May Allah keep our children among His righteous servants!</p>
                    </>
                  )}
                </div>

                {/* Ribbon Title */}
                <div className="pt-0.5">
                  <div className="inline-block px-5 py-0.5 rounded-full bg-gradient-to-r from-sky-900 via-sky-950 to-sky-900 text-amber-300 border border-amber-400 shadow-xs">
                    <h2 className="text-[11px] sm:text-[13px] md:text-[14px] font-black font-display tracking-[0.14em] uppercase leading-tight">
                      {isUz ? "FAKHRIY TASHAKKURNOMA" : "CERTIFICATE OF EXCELLENCE"}
                    </h2>
                  </div>
                  <p className="text-[7.5px] sm:text-[8.5px] font-extrabold uppercase tracking-[0.18em] text-[#0369a1] mt-0.5">
                    {isUz ? "HAFTALIK ODOBLI VA IBRATLI FARZAND MUKOFOTI" : "WEEKLY EXEMPLARY MORALS AWARD"}
                  </p>
                </div>
              </div>

              {/* 2. MIDDLE SECTION: Cloud Ribbon with Name & Sincere Appreciation */}
              <div className="space-y-2 my-auto px-1">
                
                {/* Bulutcha va Toj ichidagi Ism */}
                <div className="space-y-0.5">
                  <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-[#0369a1] block">
                    {isUz ? "Taqdim Etiladi:" : "Proudly Presented To:"}
                  </span>

                  <div className="inline-block relative">
                    <div className="px-7 sm:px-9 py-1.5 sm:py-2 rounded-2xl bg-white/95 backdrop-blur-sm border-2 border-sky-300/80 shadow-md">
                      <span className="text-xs sm:text-sm block leading-none mb-0.5">☁️ 👑 ☁️</span>
                      <h3 className="text-lg sm:text-2xl md:text-[26px] font-black font-display text-[#091e38] tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {childName}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Qalb so'zi va E'tirof matni */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-white/85 backdrop-blur-xs border border-amber-300/60 shadow-xs text-center max-w-[94%] mx-auto">
                  <p className="text-[10px] sm:text-[11.5px] md:text-[12.5px] text-slate-800 leading-snug sm:leading-relaxed font-serif italic font-medium">
                    {isUz ? (
                      <>
                        &ldquo;Bir hafta mobaynida namoyon etgan go‘zal xulqingiz, sunnat amallariga bo‘lgan ixlosingiz va ota-onangizga qilgan xushmuomalangiz uchun sizdan <strong>Alloh rozi bo‘lsin</strong>! Ushbu sharafli Tashakkurnoma sizga faxr bilan taqdim etiladi.&rdquo;
                      </>
                    ) : (
                      <>
                        &ldquo;May Allah be pleased with you for demonstrating exemplary sunnah character, devotion, and loving respect to parents throughout the week!&rdquo;
                      </>
                    )}
                  </p>
                </div>

                {/* 4 Pillars of Excellence */}
                <div className="grid grid-cols-4 gap-1 sm:gap-1.5 max-w-[92%] mx-auto">
                  <div className="p-1 sm:p-1.5 rounded-lg bg-white/90 border border-sky-200 text-center flex flex-col items-center justify-center gap-0.5 shadow-2xs">
                    <span className="text-xs">👑</span>
                    <span className="text-[7px] sm:text-[8px] font-bold text-sky-950 truncate max-w-full">
                      {isUz ? "Haftalik Toj" : "Weekly Crown"}
                    </span>
                  </div>

                  <div className="p-1 sm:p-1.5 rounded-lg bg-white/90 border border-sky-200 text-center flex flex-col items-center justify-center gap-0.5 shadow-2xs">
                    <span className="text-xs">🕌</span>
                    <span className="text-[7px] sm:text-[8px] font-bold text-sky-950 truncate max-w-full">
                      {isUz ? "Sunnat Ibrati" : "Sunnah"}
                    </span>
                  </div>

                  <div className="p-1 sm:p-1.5 rounded-lg bg-white/90 border border-sky-200 text-center flex flex-col items-center justify-center gap-0.5 shadow-2xs">
                    <span className="text-xs">🌟</span>
                    <span className="text-[7px] sm:text-[8px] font-bold text-sky-950 truncate max-w-full">
                      {isUz ? "100% Odob" : "100% Morals"}
                    </span>
                  </div>

                  <div className="p-1 sm:p-1.5 rounded-lg bg-white/90 border border-sky-200 text-center flex flex-col items-center justify-center gap-0.5 shadow-2xs">
                    <span className="text-xs">🤲</span>
                    <span className="text-[7px] sm:text-[8px] font-bold text-sky-950 truncate max-w-full">
                      {isUz ? "Ota-ona Rozi" : "Approved"}
                    </span>
                  </div>
                </div>

              </div>

              {/* 3. BOTTOM SECTION: Touching Duo in Arabic + Uzbek & Verification Bar */}
              <div className="space-y-1.5 pt-1 border-t border-amber-300/60">
                
                {/* Special Quranic / Sunnah Duo Box (Namunadagi kabi go'zal duo) */}
                <div className="bg-white/80 backdrop-blur-xs py-1.5 px-3 rounded-xl max-w-[92%] mx-auto border border-amber-200 shadow-2xs space-y-0.5">
                  <p className="text-[11px] sm:text-[12.5px] font-serif text-[#78350f] font-bold italic" style={{ fontFamily: 'Amiri, serif' }}>
                    اللَّهُمَّ أَنبِتْهُ نَبَاتًا حَسَنًا وَاجْعَلْهُ قُرَّةَ عَيْنٍ لَنَا وَبَارِكْ لَنَا فِيهِ
                  </p>
                  <p className="text-[9.5px] sm:text-[11px] font-serif italic text-amber-950 font-semibold leading-tight">
                    {isUz ? (
                      <>
                        «Yo Alloh! Uni go‘zal fazilatlar ila ulg‘aytirgin,<br/>
                        Ko‘zlarimiz quvonchi qilib, o‘zini ikki dunyoda barakali etgin!»
                      </>
                    ) : (
                      <>
                        «O Allah, make him grow in pure character and faith,<br/>
                        Let him be the delight of our eyes and bless his life!»
                      </>
                    )}
                  </p>
                </div>

                {/* Footer bar with Date, Official Seal, and Parent Signature */}
                <div className="flex items-center justify-between gap-1 pt-0.5">
                  <div className="bg-white/90 p-1 sm:p-1.5 px-2 rounded-lg border border-sky-200 text-left shadow-2xs min-w-[85px] sm:min-w-[105px]">
                    <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-slate-500 font-bold block leading-none mb-0.5">
                      {isUz ? "Berilgan Sana:" : "Issue Date:"}
                    </span>
                    <span className="text-[8.5px] sm:text-[10px] font-black text-sky-950 block leading-tight">
                      {currentDateFormatted}
                    </span>
                  </div>

                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-0.5 shadow-sm flex items-center justify-center text-center shrink-0">
                    <div className="w-full h-full rounded-full bg-sky-950 text-white flex flex-col items-center justify-center p-0.5 border border-amber-300">
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300 fill-amber-300" />
                      <span className="text-[5.5px] sm:text-[6px] font-black uppercase text-amber-300 leading-tight">NURQISSA</span>
                      <span className="text-[4.5px] sm:text-[5px] font-bold text-slate-200 leading-none">MUHR</span>
                    </div>
                  </div>

                  <div className="bg-white/90 p-1 sm:p-1.5 px-2 rounded-lg border border-sky-200 text-right shadow-2xs min-w-[85px] sm:min-w-[105px]">
                    <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-slate-500 font-bold block leading-none mb-0.5">
                      {isUz ? "Ota-ona Duosi & Imzosi:" : "Parent Blessing & Signature:"}
                    </span>
                    <div className="h-3 sm:h-3.5 border-b border-dashed border-sky-800 w-16 sm:w-20 ml-auto" />
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* OPTION B: GIRLS PINK FLORAL CERTIFICATE (Qizlar) */}
        {/* ======================================================================= */}
        {selectedTheme === 'girl' && (
          <div 
            ref={certificateRef}
            id="tashakkurnoma-print-area"
            className="w-full max-w-[600px] aspect-[896/1200] rounded-3xl relative overflow-hidden shadow-2xl border-4 border-rose-300/90 text-slate-900 select-none print:shadow-none print:border-none print:m-0 print:max-w-full print:aspect-[896/1200] print:w-full print:h-full text-center"
          >
            {/* Background Illustration Image */}
            <img 
              src="/certificates/girl_certificate.jpg" 
              alt="Girl Certificate Background" 
              className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0"
            />

            {/* Content Container Overlay */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between px-[10%] pt-[8%] pb-[6%]">
              
              {/* 1. TOP SECTION: Bismillah, Poetic Hamd & Gratitude */}
              <div className="space-y-1.5 pt-1">
                {/* Bismillah Calligraphy */}
                <p className="text-sm sm:text-base md:text-lg font-serif text-[#831843] font-bold italic tracking-wide" style={{ fontFamily: 'Amiri, serif' }}>
                  بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </p>

                {/* Symmetrical Poetic Hamd & Dua (Foydalanuvchi matni asosida) */}
                <div className="text-[10px] sm:text-[11.5px] md:text-[12.5px] font-serif italic text-rose-950 leading-snug space-y-0.5 max-w-[90%] mx-auto font-medium">
                  {isUz ? (
                    <>
                      <p className="font-bold text-[#831843]">Alhamdulillah, Robbil a&apos;lamin.</p>
                      <p>Bizga iymon ne&apos;matini, ilm o&apos;rganishda va fazilatlar bilan bezalishda davomiy bo&apos;lish istagini berdi.</p>
                      <p className="font-semibold text-pink-950">Alloh bizni o&apos;zining soliha bandalari va go&apos;zal axloqli qizlari qilib saqlasin!</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-[#831843]">Alhamdulillah, Rabbil &apos;Alamin.</p>
                      <p>Who blessed us with faith and continuous eagerness to learn virtues.</p>
                      <p className="font-semibold text-pink-950">May Allah keep our daughters among His righteous, noble servants!</p>
                    </>
                  )}
                </div>

                {/* Ribbon Title */}
                <div className="pt-0.5">
                  <div className="inline-block px-5 py-0.5 rounded-full bg-gradient-to-r from-pink-900 via-rose-950 to-pink-900 text-amber-200 border border-pink-300 shadow-xs">
                    <h2 className="text-[11px] sm:text-[13px] md:text-[14px] font-black font-display tracking-[0.14em] uppercase leading-tight">
                      {isUz ? "FAKHRIY TASHAKKURNOMA" : "CERTIFICATE OF EXCELLENCE"}
                    </h2>
                  </div>
                  <p className="text-[7.5px] sm:text-[8.5px] font-extrabold uppercase tracking-[0.18em] text-[#be185d] mt-0.5">
                    {isUz ? "HAFTALIK ODOBLI VA MEHRIBON QIZALOQ MUKOFOTI" : "WEEKLY EXEMPLARY MORALS AWARD"}
                  </p>
                </div>
              </div>

              {/* 2. MIDDLE SECTION: Cloud Ribbon with Name & Sincere Appreciation */}
              <div className="space-y-2 my-auto px-1">
                
                {/* Bulutcha va Lenta ichidagi Ism (Namunadagi kabi) */}
                <div className="space-y-0.5">
                  <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-pink-900 block">
                    {isUz ? "Taqdim Etiladi:" : "Proudly Presented To:"}
                  </span>

                  <div className="inline-block relative">
                    <div className="px-7 sm:px-9 py-1.5 sm:py-2 rounded-2xl bg-white/95 backdrop-blur-sm border-2 border-pink-300/90 shadow-md">
                      <span className="text-xs sm:text-sm block leading-none mb-0.5">☁️ 🎀 ☁️</span>
                      <h3 className="text-lg sm:text-2xl md:text-[26px] font-black font-display text-[#500724] tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {childName}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Qalb so'zi va E'tirof matni */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-white/85 backdrop-blur-xs border border-pink-200/90 shadow-xs text-center max-w-[94%] mx-auto">
                  <p className="text-[10px] sm:text-[11.5px] md:text-[12.5px] text-slate-800 leading-snug sm:leading-relaxed font-serif italic font-medium">
                    {isUz ? (
                      <>
                        &ldquo;Bir hafta mobaynida namoyon etgan latofatli odobingiz, shirin so‘zlaringiz, sunnat amallariga bo‘lgan ixlosingiz va ota-onangizga mehrli munosabatingiz uchun sizdan <strong>Alloh rozi bo‘lsin</strong>! Ushbu sharafli mukofot sizga faxr bilan topshiriladi.&rdquo;
                      </>
                    ) : (
                      <>
                        &ldquo;May Allah be pleased with you for your delightful manners, loving devotion to parents, and sunnah etiquette throughout the week!&rdquo;
                      </>
                    )}
                  </p>
                </div>

                {/* 4 Pillars of Excellence */}
                <div className="grid grid-cols-4 gap-1 sm:gap-1.5 max-w-[92%] mx-auto">
                  <div className="p-1 sm:p-1.5 rounded-lg bg-white/90 border border-pink-200 text-center flex flex-col items-center justify-center gap-0.5 shadow-2xs">
                    <span className="text-xs">💖</span>
                    <span className="text-[7px] sm:text-[8px] font-bold text-pink-950 truncate max-w-full">
                      {isUz ? "Mehribon Qalb" : "Kind Heart"}
                    </span>
                  </div>

                  <div className="p-1 sm:p-1.5 rounded-lg bg-white/90 border border-pink-200 text-center flex flex-col items-center justify-center gap-0.5 shadow-2xs">
                    <span className="text-xs">🌸</span>
                    <span className="text-[7px] sm:text-[8px] font-bold text-pink-950 truncate max-w-full">
                      {isUz ? "Go'zal Odob" : "Pure Morals"}
                    </span>
                  </div>

                  <div className="p-1 sm:p-1.5 rounded-lg bg-white/90 border border-pink-200 text-center flex flex-col items-center justify-center gap-0.5 shadow-2xs">
                    <span className="text-xs">🕌</span>
                    <span className="text-[7px] sm:text-[8px] font-bold text-pink-950 truncate max-w-full">
                      {isUz ? "Sunnat Ibrati" : "Sunnah"}
                    </span>
                  </div>

                  <div className="p-1 sm:p-1.5 rounded-lg bg-white/90 border border-pink-200 text-center flex flex-col items-center justify-center gap-0.5 shadow-2xs">
                    <span className="text-xs">🌟</span>
                    <span className="text-[7px] sm:text-[8px] font-bold text-pink-950 truncate max-w-full">
                      {isUz ? "100% Tasdiq" : "Approved"}
                    </span>
                  </div>
                </div>

              </div>

              {/* 3. BOTTOM SECTION: Touching Duo in Arabic + Uzbek & Verification Bar */}
              <div className="space-y-1.5 pt-1 border-t border-pink-300/60">
                
                {/* Special Quranic / Sunnah Duo Box (Namunadagi kabi go'zal duo) */}
                <div className="bg-white/80 backdrop-blur-xs py-1.5 px-3 rounded-xl max-w-[92%] mx-auto border border-pink-200 shadow-2xs space-y-0.5">
                  <p className="text-[11px] sm:text-[12.5px] font-serif text-[#831843] font-bold italic" style={{ fontFamily: 'Amiri, serif' }}>
                    اللَّهُمَّ أَنبِتْهَا نَبَاتًا حَسَنًا وَاجْعَلْهَا قُرَّةَ عَيْنٍ لَنَا وَبَارِكْ لَنَا فِيهَا
                  </p>
                  <p className="text-[9.5px] sm:text-[11px] font-serif italic text-pink-950 font-semibold leading-tight">
                    {isUz ? (
                      <>
                        «Yo Alloh! Uni go‘zal fazilatlar ila ulg‘aytirgin,<br/>
                        Ko‘zlarimiz quvonchi qilib, o‘zini ikki dunyoda barakali etgin!»
                      </>
                    ) : (
                      <>
                        «O Allah, make her grow in pure character and faith,<br/>
                        Let her be the delight of our eyes and bless her always!»
                      </>
                    )}
                  </p>
                </div>

                {/* Footer bar with Date, Official Seal, and Parent Signature */}
                <div className="flex items-center justify-between gap-1 pt-0.5">
                  <div className="bg-white/90 p-1 sm:p-1.5 px-2 rounded-lg border border-pink-200 text-left shadow-2xs min-w-[85px] sm:min-w-[105px]">
                    <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-slate-500 font-bold block leading-none mb-0.5">
                      {isUz ? "Berilgan Sana:" : "Issue Date:"}
                    </span>
                    <span className="text-[8.5px] sm:text-[10px] font-black text-pink-950 block leading-tight">
                      {currentDateFormatted}
                    </span>
                  </div>

                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-rose-500 via-pink-300 to-amber-300 p-0.5 shadow-sm flex items-center justify-center text-center shrink-0">
                    <div className="w-full h-full rounded-full bg-pink-950 text-white flex flex-col items-center justify-center p-0.5 border border-amber-300">
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300 fill-amber-300" />
                      <span className="text-[5.5px] sm:text-[6px] font-black uppercase text-amber-300 leading-tight">NURQISSA</span>
                      <span className="text-[4.5px] sm:text-[5px] font-bold text-rose-100 leading-none">MUHR</span>
                    </div>
                  </div>

                  <div className="bg-white/90 p-1 sm:p-1.5 px-2 rounded-lg border border-pink-200 text-right shadow-2xs min-w-[85px] sm:min-w-[105px]">
                    <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-slate-500 font-bold block leading-none mb-0.5">
                      {isUz ? "Ota-ona Duosi & Imzosi:" : "Parent Blessing & Signature:"}
                    </span>
                    <div className="h-3 sm:h-3.5 border-b border-dashed border-pink-800 w-16 sm:w-20 ml-auto" />
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* OPTION C: CLASSIC ISLAMIC GOLD GEOMETRIC CERTIFICATE (Klassik Oltin) */}
        {/* ======================================================================= */}
        {selectedTheme === 'classic' && (
          <div 
            ref={certificateRef}
            id="tashakkurnoma-print-area"
            className="w-full max-w-[600px] aspect-[896/1200] rounded-3xl bg-[#FCF9EE] dark:bg-[#002621] text-slate-900 dark:text-butter-100 p-6 sm:p-8 border-[8px] border-double border-amber-500/80 shadow-2xl relative overflow-hidden flex flex-col justify-between print:border-8 print:border-amber-600 print:bg-white print:text-black print:p-6 print:shadow-none print:m-0 text-center"
          >
            {/* Geometric Ornamental Corner Accents */}
            <div className="absolute top-2 left-2 w-10 h-10 border-t-2 border-l-2 border-amber-500 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-2 right-2 w-10 h-10 border-t-2 border-r-2 border-amber-500 rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-10 h-10 border-b-2 border-l-2 border-amber-500 rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-10 h-10 border-b-2 border-r-2 border-amber-500 rounded-br-lg pointer-events-none" />

            {/* 1. TOP SECTION */}
            <div className="relative z-10 space-y-1.5 pt-1">
              <p className="text-sm sm:text-base font-serif text-amber-800 dark:text-amber-300 font-bold italic" style={{ fontFamily: 'Amiri, serif' }}>
                بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>

              {/* Poetic Islamic Hamd */}
              <div className="text-[10px] sm:text-[11.5px] md:text-[12.5px] font-serif italic text-amber-900 dark:text-amber-200 leading-snug space-y-0.5 max-w-[90%] mx-auto font-medium">
                {isUz ? (
                  <>
                    <p className="font-bold text-amber-800 dark:text-amber-300">Alhamdulillah, Robbil a&apos;lamin.</p>
                    <p>Bizga iymon ne&apos;matini, ilm o&apos;rganishda va fazilatlar bilan bezalishda davomiy bo&apos;lish istagini berdi.</p>
                    <p className="font-semibold text-emerald-900 dark:text-amber-200">Alloh bizni o&apos;zining solih bandalari va go&apos;zal axloqli bolalari qilib saqlasin!</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-amber-800 dark:text-amber-300">Alhamdulillah, Rabbil &apos;Alamin.</p>
                    <p>Who blessed us with faith and continuous eagerness to learn virtues.</p>
                    <p className="font-semibold text-emerald-900 dark:text-amber-200">May Allah keep our children among His righteous servants!</p>
                  </>
                )}
              </div>

              <div className="inline-block px-5 py-0.5 rounded-full bg-pine-900 text-amber-200 border border-amber-400 mt-0.5">
                <h2 className="text-[11px] sm:text-[13px] font-black font-display tracking-widest uppercase">
                  {isUz ? "FAKHRIY TASHAKKURNOMA" : "CERTIFICATE OF APPRECIATION"}
                </h2>
              </div>
            </div>

            {/* 2. MIDDLE RECIPIENT */}
            <div className="relative z-10 space-y-2 my-auto px-2">
              <span className="text-[8px] sm:text-[9px] text-slate-600 dark:text-slate-300 italic font-medium block">
                {isUz ? "Ushbu faxriy mukofotnoma taqdim etiladi:" : "This honor of excellence is presented to:"}
              </span>
              
              <div className="inline-block relative">
                <div className="px-7 sm:px-9 py-1.5 rounded-2xl bg-amber-100/90 dark:bg-pine-900/90 border-2 border-amber-400 shadow-sm">
                  <span className="text-xs block leading-none mb-0.5">🌙 🌟 🌙</span>
                  <h3 className="text-lg sm:text-2xl md:text-[26px] font-black font-display text-emerald-800 dark:text-amber-300" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {childName}
                  </h3>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-amber-50/80 dark:bg-pine-900/50 border border-amber-300/60 max-w-md mx-auto">
                <p className="text-[10.5px] sm:text-[12px] leading-relaxed text-slate-800 dark:text-slate-100 font-serif italic">
                  {isUz ? (
                    <>
                      &ldquo;Bir hafta mobaynida ko‘rsatgan go‘zal xulqingiz, ota-onangizga mehr-oqibatingiz va sunnat amallariga bo‘lgan ixlosingiz uchun sizdan <strong>Alloh rozi bo‘lsin</strong>! Sizga cheksiz minnatdorchilik bildiramiz.&rdquo;
                    </>
                  ) : (
                    <>
                      &ldquo;For demonstrating exemplary moral character, warm filial love, and wholehearted dedication to daily sunnah habits throughout the week.&rdquo;
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* 3. BOTTOM DETAILS */}
            <div className="relative z-10 space-y-1.5 pt-1 border-t border-amber-400/40">
              
              <div className="bg-amber-100/60 dark:bg-pine-900/60 py-1.5 px-3 rounded-xl max-w-[92%] mx-auto border border-amber-300/50 space-y-0.5">
                <p className="text-[11px] sm:text-[12.5px] font-serif text-emerald-900 dark:text-amber-300 font-bold italic" style={{ fontFamily: 'Amiri, serif' }}>
                  اللَّهُمَّ أَنبِتْهُ نَبَاتًا حَسَنًا وَاجْعَلْهُ قُرَّةَ عَيْنٍ لَنَا وَبَارِكْ لَنَا فِيهِ
                </p>
                <p className="text-[9.5px] sm:text-[11px] font-serif italic text-emerald-950 dark:text-amber-200 font-semibold leading-tight">
                  {isUz ? (
                    <>
                      «Yo Alloh! Uni go‘zal fazilatlar ila ulg‘aytirgin,<br/>
                      Ko‘zlarimiz quvonchi qilib, o‘zini ikki dunyoda barakali etgin!»
                    </>
                  ) : (
                    <>
                      «O Allah, make them grow in pure character and faith,<br/>
                      Let them be the delight of our eyes and bless them always!»
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between gap-1 pt-0.5">
                <div className="text-left">
                  <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block leading-none mb-0.5">
                    {isUz ? "Sana:" : "Date:"}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black text-slate-900 dark:text-butter-200">
                    {currentDateFormatted}
                  </span>
                </div>

                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-0.5 shadow-sm flex items-center justify-center shrink-0">
                  <div className="w-full h-full rounded-full bg-pine-950 text-butter-200 flex flex-col items-center justify-center p-0.5 border border-amber-300">
                    <Star className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                    <span className="text-[5.5px] sm:text-[6px] font-black uppercase text-amber-300 leading-tight">NURQISSA AI</span>
                    <span className="text-[4.5px] sm:text-[5px] font-bold leading-none">RASMIY MUHR</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block leading-none mb-0.5">
                    {isUz ? "Ota-ona Duosi & Imzosi:" : "Parent Blessing & Signature:"}
                  </span>
                  <div className="h-3 sm:h-3.5 border-b border-dashed border-amber-600 w-16 sm:w-20 ml-auto" />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Print Help Notice */}
      <div className="no-print print:hidden text-center text-xs text-slate-500 dark:text-slate-400 pb-10">
        💡 {isUz 
          ? "Ushbu Tashakkurnomani «Chop Etish / PDF» tugmasi orqali rangli printerda chiqarib olishingiz yoki telefoningizga saqlab olishingiz mumkin!" 
          : "You can print this certificate on a color printer or save it as PDF to your device using the Print button!"}
      </div>

    </div>
  );
}
