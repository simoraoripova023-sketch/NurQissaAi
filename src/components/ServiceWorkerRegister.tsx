'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('NurQissa ServiceWorker registered successfully:', registration.scope);
          })
          .catch((error) => {
            console.warn('ServiceWorker registration notice:', error);
          });
      });
    }
  }, []);

  return null;
}
