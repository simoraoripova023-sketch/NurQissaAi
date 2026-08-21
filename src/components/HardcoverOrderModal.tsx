'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, CheckCircle, Printer, Sparkles, MapPin, Phone, User, Package, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { cleanUzbekPhoneDigits, formatUzbekPhoneDisplay } from '@/lib/phoneHelper';
import confetti from 'canvas-confetti';

export default function HardcoverOrderModal() {
  const { locale, isOrderModalOpen, setIsOrderModalOpen, activeStory } = useAppStore();
  const t = translations[locale];

  const [coverFinish, setCoverFinish] = useState<'glossy' | 'matte'>('glossy');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [recipientName, setRecipientName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOrderModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const storyTitle = activeStory ? (locale === 'uz' ? activeStory.title_uz : activeStory.title_en) : 'Shaxsiy ertak';
      const finishText = coverFinish === 'glossy' ? 'Yaltiroq (Glossy)' : 'Xira nafis (Matte)';
      const fullPhone = `+998 ${formatUzbekPhoneDisplay(phone)}`;

      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'buyurtma',
          name: recipientName.trim(),
          contact: fullPhone,
          message: `Kitob: "${storyTitle}"\nMuqova turi: ${finishText}\nYetkazish manzili: ${address.trim()}\nErtak ID: ${activeStory?.id || 'N/A'}`
        })
      });

      setIsSubmitted(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Order submit error:', err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOrderModalOpen(false);
    setTimeout(() => setIsSubmitted(false), 300);
  };

  return (
    <div className="no-print print:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#FDFBF7] w-full max-w-lg rounded-3xl border border-amber-300 shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="bg-[#1E1B4B] text-amber-100 p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Printer className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-amber-300 font-display">
              {t.orderModalTitle}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-[#1E1B4B] font-display">
                {locale === 'uz' ? "Buyurtmangiz muvaffaqiyatli qabul qilindi!" : "Order Received Successfully!"}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                {t.orderSuccess}
              </p>
              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all"
                >
                  {locale === 'uz' ? "Yopish" : "Done"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-xs text-slate-600">
                {t.orderModalSub}
              </p>

              {/* Book Info Summary */}
              {activeStory && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center gap-3">
                  <img
                    src={activeStory.cover_image_url}
                    alt="Book Cover"
                    className="w-12 h-16 rounded-lg object-cover border border-amber-300 shadow-sm"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-[#1E1B4B]">
                      {locale === 'uz' ? activeStory.title_uz : activeStory.title_en}
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      {activeStory.child_profile.child_name} {locale === 'uz' ? "nomli kitob (8 sahifa)" : "story book (8 pages)"}
                    </p>
                    <span className="text-xs font-bold text-amber-700">{t.orderPrice}</span>
                  </div>
                </div>
              )}

              {/* Cover Finish Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">{t.bookCoverType}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCoverFinish('glossy')}
                    className={`p-3 rounded-xl border-2 text-xs font-bold text-left transition-all ${
                      coverFinish === 'glossy'
                        ? 'border-amber-500 bg-amber-50/80 text-amber-950 shadow-sm'
                        : 'border-slate-200 text-slate-700 bg-white'
                    }`}
                  >
                    ✨ {t.hardcoverGlossy}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverFinish('matte')}
                    className={`p-3 rounded-xl border-2 text-xs font-bold text-left transition-all ${
                      coverFinish === 'matte'
                        ? 'border-amber-500 bg-amber-50/80 text-amber-950 shadow-sm'
                        : 'border-slate-200 text-slate-700 bg-white'
                    }`}
                  >
                    🌿 {t.hardcoverMatte}
                  </button>
                </div>
              </div>

              {/* Recipient details */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    {locale === 'uz' ? "Oluvchining ismi va familiyasi" : "Recipient Full Name"}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder={locale === 'uz' ? "Dilnoza Rahimova" : "Full Name"}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-800">{t.recipientPhone}</label>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      {cleanUzbekPhoneDigits(phone).length} / 9
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold pointer-events-none z-10">
                      <span>🇺🇿</span>
                      <span>+998</span>
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={14}
                      value={formatUzbekPhoneDisplay(phone)}
                      onChange={(e) => setPhone(cleanUzbekPhoneDigits(e.target.value))}
                      placeholder="(90) 123-45-67"
                      className="w-full pl-20 pr-4 py-2.5 rounded-xl border border-amber-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">{t.deliveryAddress}</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={locale === 'uz' ? "Shahar, tuman, ko'cha va xonadon raqami..." : "Street address, apartment, city, zip..."}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{locale === 'uz' ? "Buyurtma yuborilmoqda..." : "Submitting order..."}</span>
                    </>
                  ) : (
                    <>
                      <Package className="w-4 h-4 text-amber-200" />
                      <span>{t.confirmOrder}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
