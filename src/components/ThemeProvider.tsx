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

    // Sync fresh sample stories to localStorage so latest stories load seamlessly
    try {
      const stored = localStorage.getItem('nurqissa_stories');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const customStories = parsed.filter(
            (s: any) => s && s.id !== 'aqilli-bola-yusuf' && s.id !== 'fotima-va-sirli-hadya'
          );
          const merged = [...SAMPLE_STORIES, ...customStories];
          localStorage.setItem('nurqissa_stories', JSON.stringify(merged));
        }
      }
    } catch (e) {
      console.error('Story sync error:', e);
    }
  }, []);

  return <>{children}</>;
}
