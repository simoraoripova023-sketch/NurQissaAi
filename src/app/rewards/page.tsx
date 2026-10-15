'use client';

import React from 'react';
import WeeklyRewardsCertificate from '@/components/WeeklyRewardsCertificate';
import { useAppStore } from '@/lib/store';

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF5] dark:bg-[#002621] py-8 sm:py-12 pb-24 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <WeeklyRewardsCertificate />
      </div>
    </div>
  );
}
