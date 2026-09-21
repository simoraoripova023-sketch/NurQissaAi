'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { SAMPLE_STORIES } from '@/lib/sampleStories';
import { StoryBook } from '@/lib/types';
import BookReader from '@/components/BookReader';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function StoryReaderPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params?.id as string;
  const { stories, locale } = useAppStore();

  const [story, setStory] = useState<StoryBook | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storyId) return;

    // First check Zustand stories, then sample stories, then fallback to local storage
    const found = 
      stories.find((s) => s.id === storyId) || 
      SAMPLE_STORIES.find((s) => s.id === storyId);

    if (found) {
      setStory(found);
      setLoading(false);
      if (typeof document !== 'undefined') {
        document.title = `${found.title_uz} - NurQissa AI`;
      }
    } else {
      // Try reading from localStorage directly if refreshed
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('nurqissa_store') || localStorage.getItem('nurqissa_stories');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const storyList = parsed.state?.stories || parsed;
            if (Array.isArray(storyList)) {
              const lsFound = storyList.find((s: StoryBook) => s && s.id === storyId);
              if (lsFound) {
                setStory(lsFound);
                setLoading(false);
                if (typeof document !== 'undefined') {
                  document.title = `${lsFound.title_uz} - NurQissa AI`;
                }
                return;
              }
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
      setLoading(false);
    }
  }, [storyId, stories]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#FFFDF5] dark:bg-[#002621] transition-colors duration-300">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-600 dark:text-emerald-200">
          {locale === 'uz' ? "Ertak ochilmoqda..." : "Opening storybook..."}
        </p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center bg-[#FFFDF5] dark:bg-[#002621] transition-colors duration-300">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-emerald-950 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-4">
          📖
        </div>
        <h2 className="text-2xl font-bold text-[#1E1B4B] dark:text-amber-200 mb-2 font-display">
          {locale === 'uz' ? "Ertak topilmadi" : "Story Not Found"}
        </h2>
        <p className="text-sm text-slate-600 dark:text-emerald-100 max-w-sm mb-6">
          {locale === 'uz'
            ? "Kechirasiz, siz qidirayotgan ertak mavjud emas yoki o'chirilgan bo'lishi mumkin."
            : "The requested storybook might have been moved or removed."}
        </p>
        <Link
          href="/create"
          className="px-6 py-3 rounded-full bg-pine-800 hover:bg-pine-700 text-butter-200 border-2 border-butter-200 font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{locale === 'uz' ? "Yangi ertak yaratish" : "Create New Story"}</span>
        </Link>
      </div>
    );
  }

  return <BookReader story={story} />;
}
