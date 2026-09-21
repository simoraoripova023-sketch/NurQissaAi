'use client';

import React, { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, loginUser } = useAppStore();

  useEffect(() => {
    // Sync dark class on documentElement based on active theme
    if (theme === 'night') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Real Supabase Auth State Sync (e.g. Google Sign-In / OAuth)
    import('@/lib/supabase').then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const user = session.user;
          const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Ota-ona';
          loginUser({
            name: fullName,
            phone: user.email || user.phone || '',
            childName: 'Alijon',
          });
        }
      }).catch(() => {});

      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const user = session.user;
          const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Ota-ona';
          loginUser({
            name: fullName,
            phone: user.email || user.phone || '',
            childName: 'Alijon',
          });
        } else if (_event === 'SIGNED_OUT') {
          useAppStore.setState({ currentUser: null });
        }
      });
    }).catch((err) => {
      console.warn('Supabase auth listener notice:', err);
    });
  }, [loginUser]);

  return <>{children}</>;
}
