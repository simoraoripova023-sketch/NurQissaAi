'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Camera, Upload, User, Heart, Star, Compass, 
  ArrowRight, ArrowLeft, Check, Palette, Smile, Sun, Moon, 
  ShieldCheck, Loader2, BookOpen, Wand2, RefreshCw, Sparkle
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { MoralVirtue, StorySetting, Gender, ReadingTimeContext } from '@/lib/types';
import confetti from 'canvas-confetti';

import { ILLUSTRATION_STYLES, PIXAR_AVATARS } from '@/lib/illustrationHelper';

export default function StoryWizard() {
  const router = useRouter();
  const { locale, childProfile, updateChildProfile, addStoryToLibrary, setActiveStory } = useAppStore();
  const t = translations[locale];

  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 2;

  const generationSteps = [
    { text: locale === 'uz' ? "Qahramon qiyofasi tahlil qilinmoqda..." : "Analyzing hero portrait...", icon: Camera },
    { text: locale === 'uz' ? "19 ta islomiy qissa asosida syujet tuzilmoqda..." : "Structuring authentic narrative...", icon: Wand2 },
    { text: locale === 'uz' ? "Tanlangan hajmda sahifalar yozilmoqda..." : "Writing story pages...", icon: BookOpen },
    { text: locale === 'uz' ? "3D rasmlar va oqshom duosi shakllantirilmoqda..." : "Rendering illustrations & reflection...", icon: Sparkles },
    { text: locale === 'uz' ? "Kitob tayyor! Maroqli mutolaa tilaymiz!" : "Storybook ready! Enjoy reading!", icon: Check },
  ];

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        updateChildProfile({
          child_photo_url: result,
          character_appearance_description: `${childProfile.child_name || "Bola"} rasmi asosida yaratilgan qahramon`
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit and run generation pipeline
  const handleGenerateStory = async () => {
    if (!childProfile.child_name.trim()) {
      alert(locale === 'uz' ? "Iltimos, bolaning ismini kiriting" : "Please enter the child's name");
      setStep(1);
      return;
    }

    // If no custom photo uploaded, select authentic matching 3D avatar
    if (!childProfile.child_photo_url) {
      const defaultAvatar = PIXAR_AVATARS.find(a => a.gender === childProfile.gender) || PIXAR_AVATARS[0];
      updateChildProfile({ child_photo_url: defaultAvatar.url });
    }

    const { freeStoriesLeft, hasPaidSubscription, setIsPricingModalOpen } = useAppStore.getState();
    if (!hasPaidSubscription && freeStoriesLeft <= 0) {
      setIsPricingModalOpen(true);
      return;
    }

    setIsGenerating(true);
    setGenerationStep(0);

    for (let i = 0; i < generationSteps.length; i++) {
      setGenerationStep(i);
      await new Promise((resolve) => setTimeout(resolve, 1100));
    }

    try {
      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(childProfile),
      });

      const data = await res.json();
      if (data.success && data.story) {
        useAppStore.getState().useStoryCredit();

        confetti({
          particleCount: 120,
          spread: 75,
          origin: { y: 0.6 },
        });

        addStoryToLibrary(data.story);
        setActiveStory(data.story);
        router.push(`/story/${data.story.id}`);
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (err) {
      console.error(err);
      alert(locale === 'uz' ? "Ertak yaratishda xatolik yuz berdi. Qayta urinib ko'ring." : "Error generating story. Please try again.");
      setIsGenerating(false);
    }
  };

  const virtuesList: { id: MoralVirtue; label: string; desc: string; icon: string }[] = [
    { id: 'kindness', label: locale === 'uz' ? "Mehr-oqibat" : "Kindness", desc: locale === 'uz' ? "Kattalarga hurmat, kichiklarga shafqat" : "Gentle heart & compassion", icon: '💖' },
    { id: 'gratitude', label: locale === 'uz' ? "Shukronalik" : "Gratitude", desc: locale === 'uz' ? "Ne'matlar qadriga yetish va Alhamdulillah deyish" : "Thankful heart & content", icon: '🤲' },
    { id: 'respect_parents', label: locale === 'uz' ? "Ota-onaga Hurmat" : "Respecting Parents", desc: locale === 'uz' ? "Ota-onaga yaxshilik va ularning duosini olish" : "Honoring & loving parents", icon: '🏡' },
    { id: 'patience', label: locale === 'uz' ? "Sabr & Qanoat" : "Patience", desc: locale === 'uz' ? "Shoshmaslik, xotirjamlik va matonat" : "Calm spirit & resilience", icon: '⏳' },
    { id: 'generosity', label: locale === 'uz' ? "Saxovat & Ulashish" : "Generosity", desc: locale === 'uz' ? "O'yinchoqlar va shirinliklarni baham ko'rish" : "Sharing joyful blessings", icon: '🎁' },
    { id: 'cleanliness', label: locale === 'uz' ? "Poklik & Odob" : "Cleanliness", desc: locale === 'uz' ? "Poklik iymondandir — ozodalik va chiroyli odob" : "Purity & noble manners", icon: '✨' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Wizard Progress Header */}
      {!isGenerating && (
        <div className="mb-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-butter-200 text-pine-900 border border-pine-800 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{locale === 'uz' ? "Nurli Qissa Ustaxonasi" : "Story Workshop"}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-pine-900 dark:text-butter-200 font-display">
            {step === 1 
              ? (locale === 'uz' ? "1-Qadam: Bosh Qahramonni Belgilang" : "Step 1: Create Story Hero") 
              : (locale === 'uz' ? "2-Qadam: Ertak Mavzusi va Hajmi" : "Step 2: Story Morals & Length")}
          </h1>

          {/* Clean 2-step bar */}
          <div className="flex items-center justify-center gap-3 max-w-xs mx-auto pt-1">
            {[1, 2].map((i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`h-2.5 w-full rounded-full transition-all duration-300 ${
                    i <= step ? 'bg-gradient-to-r from-amber-500 to-emerald-600 shadow-sm' : 'bg-slate-200 dark:bg-pine-900'
                  }`}
                />
                <span className="text-[11px] font-bold text-slate-500 dark:text-butter-300">
                  {i === 1 ? (locale === 'uz' ? "1. Qahramon" : "1. Hero") : (locale === 'uz' ? "2. Sozlamalar" : "2. Settings")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Wizard Form Card */}
      <div className="bg-white dark:bg-[#002621] rounded-3xl border-2 border-pine-800/30 dark:border-butter-300/30 shadow-2xl p-6 sm:p-9 relative overflow-hidden">
        
        {/* If Generating: Full-Screen Animated Step Loader */}
        {isGenerating ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-8">
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-400 to-emerald-400 p-1 shadow-glow-amber animate-pulse">
              <div className="w-full h-full bg-[#1E1B4B] rounded-[20px] flex items-center justify-center">
                <Wand2 className="w-12 h-12 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-2xl font-extrabold text-pine-900 dark:text-butter-200 font-display">
                {locale === 'uz' ? "Nurli Qissa Yaratilmoqda..." : "Crafting Your Storybook..."}
              </h3>
              <p className="text-sm text-slate-600 dark:text-emerald-100">
                {childProfile.child_name} {locale === 'uz' ? "uchun shaxsiy ibratli ertak kitobi tayyorlanmoqda..." : "is becoming the star of a magical new book..."}
              </p>
            </div>

            {/* Step list progression */}
            <div className="w-full max-w-md space-y-3 bg-amber-50/60 dark:bg-emerald-950/80 p-5 rounded-2xl border border-amber-200/60 dark:border-emerald-700/60 text-left">
              {generationSteps.map((s, idx) => {
                const Icon = s.icon;
                const isPassed = generationStep > idx;
                const isCurrent = generationStep === idx;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 text-xs sm:text-sm font-semibold transition-all ${
                      isPassed
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : isCurrent
                        ? 'text-amber-900 dark:text-amber-300 font-bold scale-[1.02]'
                        : 'text-slate-400 dark:text-emerald-600 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isPassed
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-amber-500 text-white animate-bounce'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                    </div>
                    <span>{s.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <AnimatePresence mode="wait">
              {/* ========================================================= */}
              {/* STEP 1: Child Name, Age, Gender, Photo & Art Style */}
              {/* ========================================================= */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-800 dark:text-emerald-100 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>{t.childName} *</span>
                      </label>
                      <input
                        type="text"
                        value={childProfile.child_name}
                        onChange={(e) => updateChildProfile({ child_name: e.target.value })}
                        placeholder={locale === 'uz' ? "Masalan: Ali yoki Madinaxon" : "e.g. Ali or Madina"}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-pine-700 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 dark:bg-pine-950/60 text-slate-900 dark:text-butter-100 font-bold placeholder:text-slate-400"
                      />
                    </div>

                    {/* Age */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-800 dark:text-emerald-100 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>{t.childAge}:</span>
                        </span>
                        <span className="text-xs font-black text-amber-700 dark:text-amber-300">
                          {childProfile.age} {locale === 'uz' ? "yosh" : "years"}
                        </span>
                      </label>
                      <div className="flex items-center gap-1.5 pt-1">
                        {[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => updateChildProfile({ age: num })}
                            className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
                              childProfile.age === num
                                ? 'bg-amber-500 text-white shadow-md scale-105'
                                : 'bg-slate-100 dark:bg-pine-950 text-slate-700 dark:text-butter-200 hover:bg-amber-100 border border-slate-200 dark:border-pine-800'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-800 dark:text-emerald-100">{t.childGender}:</label>
                    <div className="grid grid-cols-2 gap-4">
                      {(['boy', 'girl'] as Gender[]).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            const isCustomPhoto = childProfile.child_photo_url && !PIXAR_AVATARS.some(a => a.url === childProfile.child_photo_url);
                            const matchingAvatar = PIXAR_AVATARS.find(a => a.gender === g) || PIXAR_AVATARS[0];
                            updateChildProfile({ 
                              gender: g,
                              child_photo_url: isCustomPhoto ? childProfile.child_photo_url : matchingAvatar.url
                            });
                          }}
                          className={`p-3.5 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                            childProfile.gender === g
                              ? 'border-amber-500 bg-amber-50 dark:bg-pine-900 text-amber-950 dark:text-amber-200 shadow-sm'
                              : 'border-slate-200 dark:border-pine-800 text-slate-700 dark:text-slate-300 bg-white dark:bg-pine-950'
                          }`}
                        >
                          <span className="text-lg">{g === 'boy' ? '👦' : '👧'}</span>
                          <span>{g === 'boy' ? (locale === 'uz' ? "O'g'il bola" : "Boy") : (locale === 'uz' ? "Qiz bola" : "Girl")}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3D Character Avatars & Photo */}
                  <div className="space-y-3 pt-1">
                    <label className="text-sm font-bold text-slate-800 dark:text-emerald-100 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>{locale === 'uz' ? "Bosh Qahramon Qiyofasini Tanlang:" : "Choose Character Appearance:"}</span>
                      </span>
                      <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {locale === 'uz' ? "3D Islomiy San'at" : "3D Pixar Art"}
                      </span>
                    </label>

                    {/* Pre-made 3D Avatars */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {PIXAR_AVATARS.map((char) => {
                        const isSelected = childProfile.child_photo_url === char.url || (!childProfile.child_photo_url && char.gender === childProfile.gender && char.id.includes(childProfile.gender === 'boy' ? 'yusuf' : 'fotima'));
                        return (
                          <button
                            key={char.id}
                            type="button"
                            onClick={() => {
                              updateChildProfile({ 
                                child_photo_url: char.url,
                                gender: char.gender as Gender
                              });
                            }}
                            className={`p-2 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 relative overflow-hidden ${
                              isSelected
                                ? 'border-amber-500 bg-amber-50 dark:bg-pine-900 shadow-md ring-2 ring-amber-400 scale-[1.03]'
                                : 'border-slate-200 dark:border-pine-800 bg-white dark:bg-pine-950 hover:border-amber-300'
                            }`}
                          >
                            <img
                              src={char.url}
                              alt={char.label_uz}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow-sm"
                            />
                            <span className="text-xs font-extrabold text-slate-800 dark:text-butter-100 text-center leading-tight">
                              {locale === 'uz' ? char.label_uz.split(' ')[0] : char.label_en.split(' ')[0]}
                            </span>
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-xs">
                                ✓
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Or Custom Photo Upload Option */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`mt-2 border-2 border-dashed rounded-2xl p-3.5 text-center cursor-pointer transition-all flex items-center justify-between ${
                        childProfile.child_photo_url && !PIXAR_AVATARS.some(a => a.url === childProfile.child_photo_url)
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-pine-900/50 ring-2 ring-emerald-300'
                          : 'border-slate-300 dark:border-pine-700 hover:border-amber-400 bg-slate-50/60 dark:bg-pine-950/60'
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-pine-800 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-800 dark:text-butter-100">
                            {childProfile.child_photo_url && !PIXAR_AVATARS.some(a => a.url === childProfile.child_photo_url)
                              ? (locale === 'uz' ? "Shaxsiy surat yuklandi ✓" : "Custom photo uploaded ✓")
                              : (locale === 'uz' ? "Yoki o'z farzandingiz rasmini yuklang (Ixtiyoriy)" : "Or upload custom child's photo (Optional)")}
                          </p>
                          <span className="text-[10px] text-slate-500">
                            {locale === 'uz' ? "AI qahramon yuzini suratga moslab chizadi" : "AI will personalize character from photo"}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-pine-800 px-3 py-1.5 rounded-xl shrink-0">
                        {locale === 'uz' ? "Tanlash" : "Browse"}
                      </span>
                    </div>
                  </div>

                  {/* Art Style Selection */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-pine-800">
                    <label className="text-sm font-bold text-slate-800 dark:text-emerald-100 flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-purple-600" />
                      <span>{locale === 'uz' ? "Kitob Rasmlari Uslubi:" : "Illustration Style:"}</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {ILLUSTRATION_STYLES.slice(0, 3).map((style) => {
                        const isSelected = (childProfile.illustration_style || 'pixar_3d') === style.id;
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => updateChildProfile({ illustration_style: style.id })}
                            className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                              isSelected
                                ? 'border-amber-500 bg-amber-50 dark:bg-pine-900 shadow-md font-bold'
                                : 'border-slate-200 dark:border-pine-800 bg-white dark:bg-pine-950 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{style.icon}</span>
                              <span className="text-xs font-black text-slate-900 dark:text-butter-100">
                                {locale === 'uz' ? style.label_uz : style.label_en}
                              </span>
                            </div>
                            {isSelected && <span className="text-xs text-amber-600 font-black">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ========================================================= */}
              {/* STEP 2: Story Settings, Morals, Page Count & Time Context */}
              {/* ========================================================= */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* 1. Reading Time Context (Only 2 Clean, Clear Options) */}
                  <div className="space-y-2.5">
                    <label className="text-sm font-bold text-slate-800 dark:text-emerald-100 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-emerald-600" />
                      <span>{locale === 'uz' ? "Ertak qachon tinglanadi?" : "Reading occasion:"}</span>
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => updateChildProfile({ reading_time_context: 'bedtime' })}
                        className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                          childProfile.reading_time_context === 'bedtime'
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 shadow-md ring-2 ring-indigo-400'
                            : 'border-slate-200 dark:border-pine-800 bg-white dark:bg-pine-950 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">🌙</span>
                          <div>
                            <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-butter-100">
                              {locale === 'uz' ? "Oqshomgi Uyqu Oldi" : "Bedtime Tale"}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {locale === 'uz' ? "Sokin va orombaxsh" : "Calm & soothing"}
                            </p>
                          </div>
                        </div>
                        {childProfile.reading_time_context === 'bedtime' && <span className="text-xs text-indigo-600 font-black">✓</span>}
                      </button>

                      <button
                        type="button"
                        onClick={() => updateChildProfile({ reading_time_context: 'daytime' })}
                        className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                          childProfile.reading_time_context === 'daytime'
                            ? 'border-amber-500 bg-amber-50 dark:bg-pine-900 shadow-md ring-2 ring-amber-400'
                            : 'border-slate-200 dark:border-pine-800 bg-white dark:bg-pine-950 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">☀️</span>
                          <div>
                            <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-butter-100">
                              {locale === 'uz' ? "Kunduzgi Sarguzasht" : "Daytime Adventure"}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {locale === 'uz' ? "Quvnoq va harakatli" : "Active & joyful"}
                            </p>
                          </div>
                        </div>
                        {childProfile.reading_time_context === 'daytime' && <span className="text-xs text-amber-600 font-black">✓</span>}
                      </button>
                    </div>
                  </div>

                  {/* 2. Core Moral Virtue (6 Clean Cards) */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-pine-800">
                    <label className="text-sm font-bold text-slate-800 dark:text-emerald-100 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>{locale === 'uz' ? "Qaysi ezgu fazilat o'rgatilsin?" : "Core moral virtue:"}</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {virtuesList.map((v) => {
                        const isSelected = childProfile.parent_goal === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => updateChildProfile({ parent_goal: v.id })}
                            className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'border-amber-500 bg-amber-50 dark:bg-pine-900 shadow-md ring-2 ring-amber-300'
                                : 'border-slate-200 dark:border-pine-800 bg-white dark:bg-pine-950 hover:border-amber-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-2xl">{v.icon}</span>
                              {isSelected && <span className="text-xs text-amber-600 font-black">✓</span>}
                            </div>
                            <p className="text-xs font-black text-slate-900 dark:text-butter-100">{v.label}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{v.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Page Count Selector (Min 3, Max 10) */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-pine-800">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-slate-800 dark:text-emerald-100 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-amber-500" />
                        <span>{locale === 'uz' ? "Kitob hajmi (Sahifalar soni):" : "Storybook Length:"}</span>
                      </label>
                      <span className="text-xs font-black text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-pine-900 px-3 py-1 rounded-full border border-amber-300 dark:border-pine-700">
                        📖 {childProfile.page_count || 6} {locale === 'uz' ? "sahifa" : "pages"}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
                      {[3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                        const isSelected = (childProfile.page_count || 6) === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => updateChildProfile({ page_count: num })}
                            className={`py-2.5 rounded-2xl font-black text-xs sm:text-sm flex flex-col items-center justify-center transition-all border-2 ${
                              isSelected
                                ? 'border-amber-500 bg-amber-500 text-white shadow-md scale-105'
                                : 'border-slate-200 dark:border-pine-800 bg-slate-50 dark:bg-pine-950 text-slate-700 dark:text-butter-200 hover:border-amber-300'
                            }`}
                          >
                            <span>{num}</span>
                            <span className="text-[9px] font-semibold opacity-90">{locale === 'uz' ? "bet" : "p"}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Optional 1-line custom wish */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-pine-800">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                      <span>{locale === 'uz' ? "Ertakda nima haqida aytilsin? (Ixtiyoriy):" : "Special wish for the plot (Optional):"}</span>
                    </label>
                    <input
                      type="text"
                      value={childProfile.daily_activity}
                      onChange={(e) => updateChildProfile({ daily_activity: e.target.value })}
                      placeholder={locale === 'uz' ? "Masalan: Buvijonisiga yordam bergani, o'yinchoq ulashgani..." : "e.g. Helping grandparents, sharing toys..."}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-pine-700 bg-slate-50 dark:bg-pine-950 text-xs font-medium text-slate-900 dark:text-butter-100 placeholder:text-slate-400"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200 dark:border-pine-800">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-5 py-2.5 rounded-2xl border border-slate-300 dark:border-pine-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{locale === 'uz' ? "Orqaga" : "Back"}</span>
                </button>
              ) : (
                <div />
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!childProfile.child_name.trim()) {
                      alert(locale === 'uz' ? "Iltimos, bolaning ismini kiriting" : "Please enter child's name");
                      return;
                    }
                    if (!childProfile.child_photo_url) {
                      const defaultAvatar = PIXAR_AVATARS.find(a => a.gender === childProfile.gender) || PIXAR_AVATARS[0];
                      updateChildProfile({ child_photo_url: defaultAvatar.url });
                    }
                    setStep(2);
                  }}
                  className="px-7 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-500/25 transition-all"
                >
                  <span>{locale === 'uz' ? "Keyingi qadam" : "Next Step"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateStory}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
                  <span>{locale === 'uz' ? "Ertak Yaratish ✨" : "Generate Story ✨"}</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
