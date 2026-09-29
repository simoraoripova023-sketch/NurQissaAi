'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { CheckCircle2, XCircle, Clock, Sparkles, BookOpen, ArrowRight, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id') || searchParams.get('orderId');

  const { addStoryCredits, setHasPaidSubscription } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState<'checking' | 'paid' | 'pending' | 'failed' | 'not_found'>('checking');
  const [errorMessage, setErrorMessage] = useState('');

  const checkOrder = async () => {
    if (!orderId) {
      setStatus('not_found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/click/check-order?orderId=${encodeURIComponent(orderId)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus('not_found');
        setErrorMessage(data.error || 'Buyurtma topilmadi');
        setLoading(false);
        return;
      }

      const currentOrder = data.order;
      setOrder(currentOrder);

      if (currentOrder.isPaid) {
        setStatus('paid');
        
        // Prevent duplicate crediting
        const credited = JSON.parse(localStorage.getItem('nurqissa_credited_orders') || '[]');
        if (!credited.includes(orderId)) {
          credited.push(orderId);
          localStorage.setItem('nurqissa_credited_orders', JSON.stringify(credited));

          if (currentOrder.planKey === 'pack3') {
            addStoryCredits(3);
          } else if (currentOrder.planKey === 'pack10') {
            addStoryCredits(10);
          } else if (currentOrder.planKey === 'vip') {
            setHasPaidSubscription(true);
          }
        }

        confetti({
          particleCount: 180,
          spread: 100,
          origin: { y: 0.5 },
        });
      } else if (currentOrder.status === 'cancelled' || currentOrder.status === 'rejected_underpaid') {
        setStatus('failed');
      } else {
        setStatus('pending');
      }
    } catch (err: any) {
      console.error('Order verification error:', err);
      setStatus('pending');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkOrder();

    // Auto-poll up to 3 times if pending
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      if (attempts >= 4) {
        clearInterval(interval);
        return;
      }
      if (status === 'checking' || status === 'pending') {
        await checkOrder();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#FDFBF7] dark:bg-[#0B0E1B]">
      <div className="w-full max-w-md bg-white dark:bg-[#12182B] rounded-3xl p-6 sm:p-8 border border-pine-800/10 dark:border-white/10 shadow-2xl text-center">
        
        {loading ? (
          <div className="py-12 space-y-4">
            <RefreshCw className="w-12 h-12 text-pine-600 dark:text-emerald-400 animate-spin mx-auto" />
            <h2 className="text-lg font-black text-pine-950 dark:text-white">To'lov tekshirilmoqda...</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Click serverlaridan tasdiqnoma qabul qilinmoqda, iltimos kuting.</p>
          </div>
        ) : status === 'paid' ? (
          <div className="space-y-5 animate-fade-in">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" /> To'lov 100% Tasdiqlandi
              </span>
              <h1 className="text-2xl font-black text-pine-950 dark:text-white">Tabriklaymiz! 🎉</h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <b>{order?.planName}</b> muvaffaqiyatli faollashtirildi. Bolangiz uchun yangi ibratli ertaklar hisobingizga qo'shildi!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Buyurtma ID:</span>
                <span className="font-mono font-bold">{order?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Summa:</span>
                <span className="font-black text-emerald-700 dark:text-emerald-300">
                  {Number(order?.amount || 0).toLocaleString('uz-UZ')} so'm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Holat:</span>
                <span className="font-bold text-emerald-600">To'langan (Click Merchant)</span>
              </div>
            </div>

            <Link
              href="/create"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-sm shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Yangi Ertak Yaratish</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : status === 'pending' ? (
          <div className="space-y-5 animate-fade-in">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
              <Clock className="w-12 h-12 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-pine-950 dark:text-white">To'lov hali kutilmoqda</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Click to'lov tizimidan mablag' tushgani haqida xabarnoma kutilmoqda. Agar hisobingizdan mablag' yechilgan bo'lsa, "Qayta tekshirish" tugmasini bosing.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={checkOrder}
                className="w-full py-3 px-4 rounded-xl bg-pine-900 dark:bg-emerald-600 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Qayta tekshirish</span>
              </button>

              <a
                href="https://t.me/nurqissaaa_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Yordam olish (@nurqissaaa_bot)
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-fade-in">
            <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/40 rounded-full flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
              <XCircle className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-pine-950 dark:text-white">To'lov amalga oshmadi</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {errorMessage || "Buyurtma topilmadi yoki to'lov bekor qilindi. Hisobingizdan mablag' yechilmagan bo'lsa, qaytadan urinib ko'ring."}
              </p>
            </div>

            <Link
              href="/"
              className="inline-block w-full py-3 px-4 rounded-xl bg-slate-800 text-white font-black text-xs"
            >
              Bosh sahifaga qaytish
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <RefreshCw className="w-10 h-10 text-pine-600 animate-spin" />
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  );
}
