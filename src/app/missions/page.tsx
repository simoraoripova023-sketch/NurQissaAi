'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Circle, Flame, Sparkles, Trophy, ShieldCheck, 
  Lock, Award, Star, ArrowRight, Heart, Clock, Check, Plus
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { DailyMission, MissionCategory } from '@/lib/types';
import ParentApprovalModal from '@/components/ParentApprovalModal';
import confetti from 'canvas-confetti';

export default function MissionsPage() {
  const { 
    locale, 
    dailyMissions, 
    toggleMissionComplete, 
    nurCoins, 
    userXP, 
    userLevel, 
    dailyStreak, 
    badges, 
    setIsParentApprovalOpen, 
    setActiveMissionToApprove 
  } = useAppStore();
  const t = translations[locale];

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const completedCount = dailyMissions.filter((m) => m.isCompleted && m.isParentApproved).length;
  const totalCount = dailyMissions.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const filteredMissions = dailyMissions.filter((m) => {
    if (activeCategory === 'all') return true;
    return m.category === activeCategory;
  });

  const handleTaskClick = (mission: DailyMission) => {
    if (mission.isCompleted && mission.isParentApproved) return;

    if (!mission.isCompleted) {
      toggleMissionComplete(mission.id);
    }

    // Open Parent Approval dialog to verify and award coins
    setActiveMissionToApprove(mission);
    setIsParentApprovalOpen(true);
  };

  const categories = [
    { id: 'all', label: locale === 'uz' ? "Barchasi" : "All" },
    { id: 'sunnah', label: t.sunnahHabits },
    { id: 'good_deed', label: t.goodDeeds },
    { id: 'habit', label: t.habits },
    { id: 'story_task', label: t.storyTasks },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF5] dark:bg-[#002621] islamic-pattern py-10 pb-20 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header & Stats Banner */}
        <div className="bg-pine-800 text-butter-200 rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-butter-300 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-butter-300/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Title & Streak */}
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-butter-200 text-pine-900 text-xs font-black uppercase tracking-wider border border-pine-800">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.missions}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black font-display leading-tight text-butter-200">
                {t.missionsTitle}
              </h1>

              <p className="text-sm text-butter-100/90 max-w-xl font-medium">
                {t.missionsSubtitle}
              </p>

              {/* Daily Streak Badge */}
              <div className="pt-2 flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-butter-200 text-pine-950 font-black text-sm border-2 border-pine-800 shadow-sm">
                  <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-bounce" />
                  <span>{dailyStreak} {locale === 'uz' ? "kunlik seriya!" : "day streak!"}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-butter-200 font-bold">
                  <ShieldCheck className="w-4 h-4 text-butter-300" />
                  <span>{locale === 'uz' ? "Ota-ona tasdiqlagan" : "Parent verified"}</span>
                </div>
              </div>
            </div>

            {/* Right: Wallet, Level & XP Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              
              {/* Nur Coins Wallet */}
              <div className="bg-pine-900/90 backdrop-blur-md p-5 rounded-2xl border-2 border-butter-300/40 space-y-1">
                <div className="flex items-center justify-between text-xs text-butter-300 font-bold">
                  <span>{t.nurCoins}</span>
                  <span className="text-xl">🌟</span>
                </div>
                <p className="text-3xl font-black font-display text-butter-200">
                  {nurCoins}
                </p>
                <p className="text-[11px] text-butter-200/70">
                  {locale === 'uz' ? "Har bir ezgu ish uchun" : "Earned from good deeds"}
                </p>
              </div>

              {/* Level & XP */}
              <div className="bg-pine-900/90 backdrop-blur-md p-5 rounded-2xl border-2 border-butter-300/40 space-y-2">
                <div className="flex items-center justify-between text-xs text-butter-300 font-bold">
                  <span>{t.level} {userLevel}</span>
                  <span className="text-lg">⚡</span>
                </div>
                <p className="text-lg font-bold text-butter-200 font-display">
                  {userLevel === 1 ? "Yangi Sayyoh" : userLevel === 2 ? "Yulduzli Qahramon" : "Dono Hikmatbon"}
                </p>
                <div className="space-y-1">
                  <div className="h-2 w-full bg-pine-950 rounded-full overflow-hidden border border-butter-300/30">
                    <div
                      className="h-full bg-butter-200"
                      style={{ width: `${(userXP % 200) / 2}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-butter-300 text-right font-mono font-bold">
                    {userXP % 200} / 200 XP
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Progress Bar of Today's Missions */}
        <div className="bg-white dark:bg-pine-900 p-6 rounded-3xl border-2 border-butter-300 dark:border-pine-700 shadow-md mb-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-butter-200 text-pine-950 flex items-center justify-center font-black text-xs border border-pine-800">
                {progressPercent}%
              </div>
              <div>
                <h3 className="text-sm font-bold text-pine-900 dark:text-butter-200">
                  {locale === 'uz' ? "Bugungi vazifalar bajarilishi" : "Today's Mission Progress"}
                </h3>
                <p className="text-xs text-pine-700/80 dark:text-butter-200/70">
                  {completedCount} / {totalCount} {locale === 'uz' ? "vazifa to'liq tasdiqlandi" : "tasks approved"}
                </p>
              </div>
            </div>

            {progressPercent === 100 && (
              <span className="px-3.5 py-1 rounded-full bg-butter-200 text-pine-900 font-bold text-xs flex items-center gap-1.5 border border-pine-800">
                <Sparkles className="w-3.5 h-3.5 text-pine-800" />
                <span>{locale === 'uz' ? "Hammasi bajarildi! 🎉" : "All Done! 🎉"}</span>
              </span>
            )}
          </div>

          <div className="h-3 w-full bg-butter-100 dark:bg-pine-950 rounded-full overflow-hidden border border-butter-300/60">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-pine-800 dark:bg-butter-200"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                activeCategory === c.id
                  ? 'bg-pine-800 dark:bg-butter-200 text-butter-200 dark:text-pine-950 shadow-md border-2 border-butter-300 dark:border-pine-800'
                  : 'bg-butter-100 dark:bg-pine-900 text-pine-800 dark:text-butter-200 hover:bg-butter-200 border border-butter-300 dark:border-pine-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Missions Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {filteredMissions.map((mission) => {
            const isApproved = mission.isCompleted && mission.isParentApproved;
            const isPending = mission.isCompleted && !mission.isParentApproved;

            return (
              <div
                key={mission.id}
                onClick={() => handleTaskClick(mission)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                  isApproved
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/80 border-emerald-300/80 dark:border-emerald-700/80 shadow-sm'
                    : isPending
                    ? 'bg-amber-50/70 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700/80 shadow-sm'
                    : 'bg-white dark:bg-[#01342e] border-slate-200 dark:border-emerald-700/60 hover:border-amber-400 dark:hover:border-amber-400 hover:shadow-md'
                }`}
              >
                {/* Checkbox icon */}
                <button
                  type="button"
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 transition-transform hover:scale-110 ${
                    isApproved
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : isPending
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-slate-100 dark:bg-emerald-950 text-slate-400 dark:text-emerald-400 border border-slate-300 dark:border-emerald-700'
                  }`}
                >
                  {isApproved ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : isPending ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{mission.icon}</span>
                      <h4 className={`text-sm font-bold ${isApproved ? 'line-through text-slate-500 dark:text-emerald-300/60' : 'text-[#1E1B4B] dark:text-amber-200'}`}>
                        {locale === 'uz' ? mission.title_uz : mission.title_en}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-emerald-100 leading-relaxed">
                    {locale === 'uz' ? mission.description_uz : mission.description_en}
                  </p>

                  {/* Rewards & status badges */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-[11px] font-bold">
                      <span className="bg-amber-100 dark:bg-emerald-950 text-amber-900 dark:text-amber-300 border border-transparent dark:border-emerald-700/60 px-2.5 py-0.5 rounded-full">
                        🌟 +{mission.coin_reward} {t.nurCoins}
                      </span>
                      <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-transparent dark:border-emerald-700/60 px-2 py-0.5 rounded-full">
                        ⚡ +{mission.xp_reward} XP
                      </span>
                    </div>

                    <div className="text-[11px] font-semibold">
                      {isApproved && (
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {t.parentApproved}
                        </span>
                      )}
                      {isPending && (
                        <span className="text-amber-800 dark:text-amber-300 font-bold bg-amber-200/80 dark:bg-amber-950/80 border border-transparent dark:border-amber-700/60 px-2 py-0.5 rounded-full">
                          {t.waitingParentApproval}
                        </span>
                      )}
                      {!mission.isCompleted && (
                        <span className="text-slate-400 dark:text-emerald-300 group-hover:text-amber-600 dark:group-hover:text-amber-300">
                          {t.markDone} ➔
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Badges & Achievements Gallery Section */}
        <div className="bg-white dark:bg-[#01342e] rounded-3xl border border-amber-200/80 dark:border-emerald-700/60 p-6 sm:p-10 shadow-lg space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-butter-200 text-pine-900 border border-pine-800 text-xs font-bold uppercase">
              <Award className="w-3.5 h-3.5 text-pine-800" />
              <span>{t.badgesTitle}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-pine-900 dark:text-butter-200 font-display">
              {locale === 'uz' ? "Haftalik Yutuqlar va Medallar" : "Weekly Badges & Honors"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100">
              {t.badgesSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-5 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                  b.isUnlocked
                    ? 'bg-gradient-to-br from-amber-50/80 to-emerald-50/80 dark:from-emerald-950/80 dark:to-emerald-900/60 border-amber-300 dark:border-emerald-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-emerald-950/40 border-slate-200 dark:border-emerald-800 opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                  b.isUnlocked ? 'bg-amber-100 dark:bg-emerald-900 shadow-inner' : 'bg-slate-200 dark:bg-emerald-950 grayscale'
                }`}>
                  {b.icon}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1E1B4B] dark:text-amber-200">
                      {locale === 'uz' ? b.title_uz : b.title_en}
                    </h4>
                    {b.isUnlocked ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                        {t.unlocked}
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-emerald-500" />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-emerald-100 leading-snug">
                    {locale === 'uz' ? b.description_uz : b.description_en}
                  </p>

                  <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-emerald-300 font-mono font-semibold">
                    <span>{b.currentCount} / {b.requiredCount}</span>
                    {b.isUnlocked && <span className="text-amber-700 dark:text-amber-400">⭐ +100 Coins</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Parent Approval Modal */}
      <ParentApprovalModal />
    </div>
  );
}
