'use client';

import React, { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { SAMPLE_STORIES } from '@/lib/sampleStories';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useAppStore();

  useEffect(() => {
    // Check saved theme in localStorage
    const savedTheme = localStorage.getItem('nurqissa_theme') as 'night' | 'day' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'night') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Default to night mode for cozy bedtime story experience
      setTheme('night');
      document.documentElement.classList.add('dark');
    }

    // Sync fresh sample stories & user states to Zustand store
    try {
      const stored = localStorage.getItem('nurqissa_stories');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const customStories = parsed.filter(
            (s: any) => s && s.id !== 'aqilli-bola-yusuf' && s.id !== 'haj-qilishni-organamiz'
          );
          const merged = [...SAMPLE_STORIES, ...customStories];
          localStorage.setItem('nurqissa_stories', JSON.stringify(merged));
          useAppStore.setState({ stories: merged });
        }
      }

      const userStr = localStorage.getItem('nurqissa_user');
      if (userStr) {
        try {
          useAppStore.setState({ currentUser: JSON.parse(userStr) });
        } catch {}
      }

      const freeStories = localStorage.getItem('nurqissa_free_stories');
      if (freeStories !== null) {
        useAppStore.setState({ freeStoriesLeft: parseInt(freeStories, 10) });
      }

      const paidSub = localStorage.getItem('nurqissa_paid_sub');
      if (paidSub !== null) {
        useAppStore.setState({ hasPaidSubscription: paidSub === 'true' });
      }

      const coins = localStorage.getItem('nurqissa_coins');
      if (coins !== null) {
        useAppStore.setState({ nurCoins: parseInt(coins, 10) });
      }

      const streak = localStorage.getItem('nurqissa_daily_streak');
      if (streak !== null) {
        useAppStore.setState({ dailyStreak: parseInt(streak, 10) });
      }
    } catch (e) {
      console.error('State sync error:', e);
    }

    // Real Supabase Auth State Sync (e.g. Google Sign-In)
    const hasValidSupabase =
      typeof process !== 'undefined' &&
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('byfftryvhlwgadouglgs') &&
      process.env.NEXT_PUBLIC_ENABLE_SUPABASE_AUTH === 'true';

    if (hasValidSupabase) {
      import('@/lib/supabase').then(({ supabase }) => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            const user = session.user;
            const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Ota-ona';
            useAppStore.setState({
              currentUser: {
                name: fullName,
                phone: user.phone || user.email || '',
                childName: 'Alijon',
                isLoggedIn: true,
              },
              isAuthModalOpen: false,
            });
          }
        }).catch(() => {});

        supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            const user = session.user;
            const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Ota-ona';
            useAppStore.setState({
              currentUser: {
                name: fullName,
                phone: user.phone || user.email || '',
                childName: 'Alijon',
                isLoggedIn: true,
              },
              isAuthModalOpen: false,
            });
          }
        });
      }).catch((err) => {
        console.warn('Supabase auth listener notice:', err);
      });
    }
  }, []);

  return <>{children}</>;
}
