'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles, Smartphone, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode (already installed app)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed previously in this session
    const dismissed = sessionStorage.getItem('nurqissa_pwa_dismissed');
    if (dismissed) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Capture Chrome / Android / Desktop PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait 3 seconds before showing so it doesn't interrupt initial page glance
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If iOS and not installed, show after 5 seconds
    if (isIosDevice && !isStandalone) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('nurqissa_pwa_dismissed', 'true');
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 pointer-events-auto"
      >
        <div className="relative p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-pine-900 via-pine-950 to-emerald-950 text-white border-2 border-amber-400/50 shadow-2xl backdrop-blur-xl flex flex-col gap-3">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Yopish"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5 pr-6">
            <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shrink-0 shadow-lg border border-amber-300">
              <img src="/logo.png" alt="NurQissa AI" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-white">NurQissa AI Ilovasi</span>
                <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-bold">PWA</span>
              </div>
              <p className="text-xs text-white/80 leading-snug mt-0.5">
                Telefoningizga ilova sifatida o'rnating — ertaklarni bir zumda ochish uchun!
              </p>
            </div>
          </div>

          {isIos ? (
            <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-xs text-white/90 space-y-1.5">
              <p className="font-semibold text-amber-200 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" />
                <span>iPhone / iPad uchun:</span>
              </p>
              <p className="text-[11px] text-white/80">
                1. Safari pastidagi <b>«Ulashish»</b> tugmasini bosing <br />
                2. <b>«Bosh ekranga qo'shish»</b> (+) ni tanlang.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleInstallClick}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-pine-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Ilovani o'rnatish</span>
              </button>
              <button
                onClick={handleDismiss}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Keyinroq
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
