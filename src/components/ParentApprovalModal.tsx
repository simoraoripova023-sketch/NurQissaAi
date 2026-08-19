'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CheckCircle2, Sparkles, Trophy, Lock } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import confetti from 'canvas-confetti';

export default function ParentApprovalModal() {
  const { 
    locale, 
    isParentApprovalOpen, 
    setIsParentApprovalOpen, 
    activeMissionToApprove, 
    approveMissionByParent 
  } = useAppStore();
  const t = translations[locale];

  // Random math question to verify parent
  const [num1, setNum1] = useState(7);
  const [num2, setNum2] = useState(6);
  const [parentAnswer, setParentAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isParentApprovalOpen) {
      const n1 = Math.floor(Math.random() * 8) + 4;
      const n2 = Math.floor(Math.random() * 8) + 3;
      setNum1(n1);
      setNum2(n2);
      setParentAnswer('');
      setErrorMsg('');
    }
  }, [isParentApprovalOpen]);

  if (!isParentApprovalOpen || !activeMissionToApprove) return null;

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    const correctAnswer = num1 + num2;
    if (parseInt(parentAnswer.trim()) !== correctAnswer) {
      setErrorMsg(locale === 'uz' ? "Noto'g'ri javob kiritildi. Qayta urinib ko'ring." : "Incorrect math check. Please try again.");
      return;
    }

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
    });

    approveMissionByParent(activeMissionToApprove.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#FDFBF7] w-full max-w-md rounded-3xl border border-amber-300 shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="bg-[#1E1B4B] text-amber-100 p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-amber-300 font-display">
              {t.parentApprovalTitle}
            </h3>
          </div>
          <button
            onClick={() => setIsParentApprovalOpen(false)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleApprove} className="p-6 sm:p-8 space-y-5">
          <p className="text-xs text-slate-600">
            {t.parentApprovalSub}
          </p>

          {/* Mission Card Preview */}
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-center gap-3">
            <span className="text-3xl">{activeMissionToApprove.icon}</span>
            <div className="space-y-0.5 flex-1">
              <h4 className="text-sm font-bold text-[#1E1B4B]">
                {locale === 'uz' ? activeMissionToApprove.title_uz : activeMissionToApprove.title_en}
              </h4>
              <p className="text-xs text-slate-600">
                {locale === 'uz' ? activeMissionToApprove.description_uz : activeMissionToApprove.description_en}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  🌟 +{activeMissionToApprove.coin_reward} {t.nurCoins}
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  ⚡ +{activeMissionToApprove.xp_reward} {t.xpPoints}
                </span>
              </div>
            </div>
          </div>

          {/* Parent Verification Math Question */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.parentSecretQuestion}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-2 rounded-xl bg-slate-100 font-mono font-bold text-slate-800 text-sm">
                {num1} + {num2} = ?
              </span>
              <input
                type="number"
                required
                value={parentAnswer}
                onChange={(e) => setParentAnswer(e.target.value)}
                placeholder={locale === 'uz' ? "Natijani yozing" : "Enter sum"}
                className="flex-1 px-3 py-2 rounded-xl border border-amber-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            {errorMsg && <p className="text-xs font-semibold text-rose-600">{errorMsg}</p>}
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsParentApprovalOpen(false)}
              className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all"
            >
              {locale === 'uz' ? "Bekor qilish" : "Cancel"}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:brightness-110 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{t.approveAndReward}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
