'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/lib/store';
import { Sparkles, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginUser } = useAppStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function handleAuthCallback() {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error_description') || searchParams.get('error');

        if (error) {
          throw new Error(error);
        }

        // 1. If code exists in URL (PKCE Flow), exchange it client-side
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.warn('exchangeCodeForSession notice:', exchangeError.message);
          }
        }

        // 2. Retrieve the active session (either from code exchange or hash)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session?.user) {
          const user = session.user;
          const fullName = 
            user.user_metadata?.full_name || 
            user.user_metadata?.name || 
            user.email?.split('@')[0] || 
            'Ota-ona';
          
          const emailOrPhone = user.email || user.phone || '';

          // Log in user in Zustand store & localStorage
          loginUser({
            name: fullName,
            phone: emailOrPhone,
            childName: 'Alijon',
          });

          if (isMounted) {
            setStatus('success');
            try {
              confetti({
                particleCount: 70,
                spread: 75,
                origin: { y: 0.6 },
                colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'],
              });
            } catch {}
          }

          // Redirect to home after brief success feedback
          setTimeout(() => {
            window.location.href = '/';
          }, 800);
          return;
        }

        // 3. Fallback: Listen to auth state change if session is still settling
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (session?.user && isMounted) {
            const user = session.user;
            const fullName = 
              user.user_metadata?.full_name || 
              user.user_metadata?.name || 
              user.email?.split('@')[0] || 
              'Ota-ona';

            loginUser({
              name: fullName,
              phone: user.email || user.phone || '',
              childName: 'Alijon',
            });

            setStatus('success');
            setTimeout(() => {
              window.location.href = '/';
            }, 800);
          }
        });

        // Timeout fallback if no session received
        setTimeout(() => {
          if (isMounted && status === 'loading') {
            supabase.auth.getSession().then(({ data: { session: checkSession } }) => {
              if (checkSession?.user) {
                window.location.href = '/';
              } else {
                setStatus('error');
                setErrorMessage("Avtorizatsiya ma'lumotlarini qabul qilib bo'lmadi");
              }
            });
          }
        }, 4000);

        return () => {
          subscription.unsubscribe();
        };

      } catch (err: any) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err?.message || "Google tizimiga ulanishda xatolik yuz berdi");
        }
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [searchParams, loginUser, router]);

  return (
    <div className="min-h-screen bg-[#FFFDF5] dark:bg-[#002621] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-pine-900 border-2 border-pine-800/30 dark:border-butter-300/30 rounded-3xl p-8 text-center shadow-2xl space-y-5">
        
        {/* Google Icon */}
        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-pine-950 border-2 border-slate-200 dark:border-butter-300 mx-auto flex items-center justify-center shadow-md p-3">
          <svg className="w-9 h-9" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
        </div>

        {status === 'loading' && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-pine-900 dark:text-butter-200">
              <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
              <h2 className="text-xl font-black font-display">Hisobingiz tasdiqlanmoqda...</h2>
            </div>
            <p className="text-xs text-pine-700/80 dark:text-butter-300/80">
              Google orqali avtorizatsiya yakunlanmoqda. Bir necha soniya kuting...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-3 animate-fade-in">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-400 text-emerald-800 dark:text-emerald-200 text-xs font-black">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Muvaffaqiyatli kirdingiz! 🌟</span>
            </div>
            <h2 className="text-xl font-black text-pine-900 dark:text-butter-200 font-display">
              Xush kelibsiz!
            </h2>
            <p className="text-xs text-pine-700/80 dark:text-butter-300/80">
              Bosh sahifaga yo'naltirilmoqdasiz...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center gap-2 text-left">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage || "Xatolik yuz berdi"}</span>
            </div>
            <button
              type="button"
              onClick={() => { window.location.href = '/'; }}
              className="w-full py-3 px-6 rounded-2xl bg-pine-800 hover:bg-pine-700 text-butter-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Bosh sahifaga qaytish
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFFDF5] dark:bg-[#002621] flex items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
