'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Star, Sparkles, Check, Lock, Palette, Trophy, Gift, 
  Download, ArrowRight, HeartHandshake, ShieldCheck, Flame
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import confetti from 'canvas-confetti';

interface ShopItem {
  id: string;
  category: 'coloring' | 'badge' | 'coupon';
  titleUz: string;
  titleEn: string;
  descUz: string;
  descEn: string;
  cost: number;
  icon: string;
  rewardType: 'print' | 'badge' | 'coupon';
  downloadUrl?: string;
}

const SHOP_ITEMS: ShopItem[] = [
  // 1. Coloring Templates
  {
    id: 'clr_kaba',
    category: 'coloring',
    titleUz: "Ka'ba Ziyorati va Chaqnoq Yulduzlar",
    titleEn: "Kaaba Pilgrimage & Twinkling Stars",
    descUz: "Qalblarga sokinlik ulashuvchi maxsus A4 formatdagi bolalar bo'yash rasmi",
    descEn: "Special A4 bedtime coloring illustration for kids",
    cost: 50,
    icon: '🕋',
    rewardType: 'print',
    downloadUrl: '/coloring/kaba_coloring.png',
  },
  {
    id: 'clr_dove',
    category: 'coloring',
    titleUz: "Oydin Kecha va Mitti Oq Kabutar",
    titleEn: "Peaceful Moonlit Night & White Dove",
    descUz: "Mehr va tinchlik ramzi bo'lgan beozor qushcha rasmi",
    descEn: "Gentle bedtime bird coloring sheet",
    cost: 50,
    icon: '🕊️',
    rewardType: 'print',
    downloadUrl: '/coloring/dove_coloring.png',
  },
  {
    id: 'clr_ramadan',
    category: 'coloring',
    titleUz: "Ramazon Fanozi va Shirin Xurmo",
    titleEn: "Ramadan Lantern & Sweet Dates",
    descUz: "Fayzli oqshom va qutlug' oy shukronaligi aks etgan nafis naqsh",
    descEn: "Festive blessing lantern illustration",
    cost: 60,
    icon: '🏮',
    rewardType: 'print',
    downloadUrl: '/coloring/ramadan_lantern.png',
  },
  {
    id: 'clr_steed',
    category: 'coloring',
    titleUz: "Jasur Chavandoz va Shiddatli Tulpor",
    titleEn: "Brave Young Rider & Gentle Steed",
    descUz: "Botirlik va qat'iyat fazilatini tarbiyalaydigan qahramonlik surati",
    descEn: "Heroic bravery coloring template",
    cost: 70,
    icon: '🐎',
    rewardType: 'print',
    downloadUrl: '/coloring/steed_coloring.png',
  },

  // 2. Badges
  {
    id: 'bdg_golden_heart',
    category: 'badge',
    titleUz: "«Oltin Qalb» Sharafi",
    titleEn: "«Golden Heart» Honor",
    descUz: "Boshqalarga doim mehr va yordam ulashuvchi saxiy bolajonlar unvoni",
    descEn: "Honor badge for kind-hearted children",
    cost: 100,
    icon: '💛',
    rewardType: 'badge',
  },
  {
    id: 'bdg_brave_hero',
    category: 'badge',
    titleUz: "«Halol & Jasur Qahramon»",
    titleEn: "«Brave & Truthful Hero»",
    descUz: "Doim rost so'zlovchi va ota-onaga suyanch bo'lgan mardlik nishoni",
    descEn: "Truthfulness and courage excellence badge",
    cost: 120,
    icon: '🛡️',
    rewardType: 'badge',
  },
  {
    id: 'bdg_scholar',
    category: 'badge',
    titleUz: "«Kichik Alloma» Bilimdonligi",
    titleEn: "«Young Scholar» Intelligence",
    descUz: "Kitob mutolaasi va hikmatlarni teran anglash bo'yicha oliy daraja",
    descEn: "Excellence in wisdom and storytelling",
    cost: 150,
    icon: '📚',
    rewardType: 'badge',
  },

  // 3. Family Rewards (Kuponlar)
  {
    id: 'cpn_ice_cream',
    category: 'coupon',
    titleUz: "Oila Bilan «Muzqaymoq Sayli»",
    titleEn: "Family «Ice Cream Outing»",
    descUz: "Ota-onaga taqdim etiladigan shirin oilaviy sayr va muzqaymoq hadyasi",
    descEn: "Special family time coupon with parents",
    cost: 80,
    icon: '🍦',
    rewardType: 'coupon',
  },
  {
    id: 'cpn_park',
    category: 'coupon',
    titleUz: "Dam Olish Kuni «Istirohat Bog'i»",
    titleEn: "Weekend «Park Adventure»",
    descUz: "Farzandning haftalik intilishlari uchun ota-onadan quvnoq attraksion sovg'asi",
    descEn: "Weekend playground treat by parents",
    cost: 130,
    icon: '🎡',
    rewardType: 'coupon',
  },
  {
    id: 'cpn_extra_story',
    category: 'coupon',
    titleUz: "Qo'shimcha «Oqshomgi Shirin Ertak»",
    titleEn: "Extra «Bedtime Fairytale»",
    descUz: "Bugun ota-ona bolajonga istalgan sevimli ertagini uxlab qolguncha o'qib beradi",
    descEn: "Extra storytime coupon with mom/dad",
    cost: 60,
    icon: '🌙',
    rewardType: 'coupon',
  },
];

export default function NurShopModal() {
  const { 
    locale, 
    nurCoins, 
    isNurShopOpen, 
    setIsNurShopOpen, 
    unlockedShopItems, 
    buyShopItem 
  } = useAppStore();

  const isUz = locale === 'uz';
  const [activeTab, setActiveTab] = useState<'all' | 'coloring' | 'badge' | 'coupon'>('all');
  const [celebratedItem, setCelebratedItem] = useState<string | null>(null);

  if (!isNurShopOpen) return null;

  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  const handlePurchase = (item: ShopItem) => {
    if (unlockedShopItems.includes(item.id)) return;

    if (nurCoins < item.cost) {
      alert(
        isUz 
          ? `Sizda yetarli Nur tangasi mavjud emas. Yana ${item.cost - nurCoins} tanga to'plang!`
          : `Not enough NurCoins. You need ${item.cost - nurCoins} more coins!`
      );
      return;
    }

    const success = buyShopItem(item.id, item.cost);
    if (success) {
      setCelebratedItem(item.id);
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#FFD700', '#F59E0B', '#10B981', '#38BDF8', '#EC4899'],
      });
      setTimeout(() => setCelebratedItem(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto no-print print:hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        className="bg-[#FFFDF5] dark:bg-[#002621] w-full max-w-4xl rounded-3xl border-2 sm:border-4 border-amber-300 dark:border-emerald-700 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]"
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-600 text-slate-950 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/50 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🛍️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-slate-950">
                  {isUz ? "Nur Do'koni" : "NurCoins Magic Shop"}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-white/40 text-[11px] font-black uppercase tracking-wider">
                  {isUz ? "Sovg'alar" : "Rewards"}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900/90 mt-0.5">
                {isUz 
                  ? "Odob va ezgu amallar bilan to'plangan tangalarga ajoyib sovg'alar oling!"
                  : "Redeem your hard-earned virtue coins for exclusive bedtime treats!"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Coin Balance Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/90 dark:bg-emerald-950/90 border-2 border-amber-400 text-amber-950 dark:text-amber-200 font-black text-sm shadow-md">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{nurCoins}</span>
              <span className="text-xs font-bold opacity-80">{isUz ? "tanga" : "coins"}</span>
            </div>

            <button
              onClick={() => setIsNurShopOpen(false)}
              className="p-2 rounded-2xl bg-white/30 hover:bg-white/50 text-slate-950 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="p-3 sm:p-4 bg-white/95 dark:bg-[#01342e] border-b border-amber-200 dark:border-emerald-800 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              { id: 'all', label: isUz ? "🌟 Barchasi" : "🌟 All" },
              { id: 'coloring', label: isUz ? "🎨 Bo'yash Rasmlari" : "🎨 Coloring" },
              { id: 'badge', label: isUz ? "🏆 Sharaf Nishonlari" : "🏆 Badges" },
              { id: 'coupon', label: isUz ? "🎁 Oila Kuponlari" : "🎁 Coupons" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-105'
                    : 'bg-amber-50/80 dark:bg-emerald-900/60 text-slate-700 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-emerald-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile Balance */}
          <div className="sm:hidden flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-emerald-900 border border-amber-300 text-amber-950 dark:text-amber-200 font-black text-xs shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{nurCoins}</span>
          </div>
        </div>

        {/* Items Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const isUnlocked = unlockedShopItems.includes(item.id);
              const canAfford = nurCoins >= item.cost;
              const isRecentlyCelebrated = celebratedItem === item.id;

              return (
                <div
                  key={item.id}
                  className={`relative p-5 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/70 border-emerald-400 shadow-sm'
                      : canAfford
                        ? 'bg-white dark:bg-[#01342e] border-amber-300 hover:border-amber-400 hover:shadow-lg'
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
                  }`}
                >
                  {/* Top Badge Tag */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100/90 dark:bg-emerald-900/90 border border-amber-300/80 flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {item.icon}
                    </div>

                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-black shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>{isUz ? "Ochilgan" : "Unlocked"}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-300 text-amber-950 dark:text-amber-200 text-xs font-black shadow-sm">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{item.cost} {isUz ? "tanga" : "coins"}</span>
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-1 mb-4">
                    <h3 className="text-base font-black text-slate-950 dark:text-amber-100 font-display">
                      {isUz ? item.titleUz : item.titleEn}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {isUz ? item.descUz : item.descEn}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div>
                    {isUnlocked ? (
                      item.rewardType === 'print' ? (
                        <button
                          onClick={() => window.print()}
                          className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>{isUz ? "Rasmni Chop Etish" : "Print Coloring Sheet"}</span>
                        </button>
                      ) : item.rewardType === 'coupon' ? (
                        <div className="w-full py-2 rounded-2xl bg-emerald-100 dark:bg-emerald-900 border border-emerald-300 text-emerald-950 dark:text-emerald-200 text-xs font-bold text-center">
                          🎉 {isUz ? "Ota-onangizga ko'rsating!" : "Show coupon to parents!"}
                        </div>
                      ) : (
                        <div className="w-full py-2 rounded-2xl bg-emerald-100 dark:bg-emerald-900 border border-emerald-300 text-emerald-950 dark:text-emerald-200 text-xs font-bold text-center">
                          ⭐ {isUz ? "Profilingizda faol!" : "Active on profile!"}
                        </div>
                      )
                    ) : (
                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford}
                        className={`w-full py-2.5 rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-105 text-slate-950 active:scale-95 shadow-amber-500/20'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? (
                          <>
                            <Sparkles className="w-4 h-4 text-slate-950" />
                            <span>{isUz ? "Ochish (Harid Qilish)" : "Unlock Reward"}</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>{isUz ? `Yana ${item.cost - nurCoins} tanga kerak` : `Need ${item.cost - nurCoins} more`}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info banner */}
        <div className="p-4 bg-amber-50/80 dark:bg-emerald-950/80 border-t border-amber-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {isUz
                ? "Tangalarni kunlik odob missiyalari, jumboqlar va ertaklarni o'qib ko'paytiring!"
                : "Earn more coins by completing daily virtue missions and reading stories!"}
            </span>
          </div>

          <button
            onClick={() => setIsNurShopOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold hover:scale-105 transition-all text-xs shrink-0"
          >
            {isUz ? "Tushundim" : "Close"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
