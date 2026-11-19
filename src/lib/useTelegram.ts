'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { TelegramUser, TelegramWebApp } from '@/types/telegram';

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [isTelegram, setIsTelegram] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tg = window.Telegram?.WebApp;
    if (tg && tg.initDataUnsafe && Object.keys(tg.initDataUnsafe).length > 0) {
      setWebApp(tg);
      setIsTelegram(true);
      
      if (tg.initDataUnsafe.user) {
        setUser(tg.initDataUnsafe.user);
      }

      setColorScheme(tg.colorScheme || 'light');

      // Expand to maximum available screen
      try {
        tg.ready();
        tg.expand();
        tg.enableClosingConfirmation?.();
        tg.disableVerticalSwipes?.();
        
        // Match header color with the app theme
        const isDark = tg.colorScheme === 'dark';
        tg.setHeaderColor?.(isDark ? '#0B0E1B' : '#FDFBF7');
        tg.setBackgroundColor?.(isDark ? '#0B0E1B' : '#FDFBF7');
      } catch (e) {
        console.warn('Telegram WebApp init warning:', e);
      }

      const handleThemeChange = () => {
        if (tg.colorScheme) {
          setColorScheme(tg.colorScheme);
        }
      };

      tg.onEvent('themeChanged', handleThemeChange);
      return () => {
        tg.offEvent('themeChanged', handleThemeChange);
      };
    }
  }, []);

  // Haptic feedback helpers
  const hapticImpact = useCallback((style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
    try {
      webApp?.HapticFeedback?.impactOccurred(style);
    } catch {}
  }, [webApp]);

  const hapticNotification = useCallback((type: 'error' | 'success' | 'warning') => {
    try {
      webApp?.HapticFeedback?.notificationOccurred(type);
    } catch {}
  }, [webApp]);

  const hapticSelection = useCallback(() => {
    try {
      webApp?.HapticFeedback?.selectionChanged();
    } catch {}
  }, [webApp]);

  // BackButton helpers
  const setupBackButton = useCallback((onBack: () => void) => {
    if (!webApp?.BackButton) return () => {};

    webApp.BackButton.show();
    webApp.BackButton.onClick(onBack);

    return () => {
      webApp.BackButton.offClick(onBack);
      webApp.BackButton.hide();
    };
  }, [webApp]);

  // MainButton helpers
  const showMainButton = useCallback((text: string, onClick: () => void, isProgress = false) => {
    if (!webApp?.MainButton) return;

    webApp.MainButton.setText(text);
    webApp.MainButton.show();
    webApp.MainButton.enable();
    if (isProgress) {
      webApp.MainButton.showProgress(false);
    } else {
      webApp.MainButton.hideProgress();
    }
    webApp.MainButton.onClick(onClick);
  }, [webApp]);

  const hideMainButton = useCallback(() => {
    if (!webApp?.MainButton) return;
    webApp.MainButton.hide();
  }, [webApp]);

  const closeApp = useCallback(() => {
    try {
      webApp?.close();
    } catch {}
  }, [webApp]);

  const openLink = useCallback((url: string) => {
    if (webApp?.openLink) {
      webApp.openLink(url);
    } else if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  }, [webApp]);

  return {
    webApp,
    isTelegram,
    user,
    colorScheme,
    hapticImpact,
    hapticNotification,
    hapticSelection,
    setupBackButton,
    showMainButton,
    hideMainButton,
    closeApp,
    openLink,
  };
}
