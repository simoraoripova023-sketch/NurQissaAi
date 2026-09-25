'use client';

import React from 'react';
import Link from 'next/link';
import { Moon, Sparkles, Heart, BookOpen, ShieldCheck, Mail, Phone, Instagram, Send } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/translations';
import { CONTACT_CONFIG } from '@/lib/contact';

export default function Footer() {
  const { locale } = useAppStore();
  const t = translations[locale];

  return (
    <footer className="no-print print:hidden relative bg-[#131131] text-amber-50/90 pt-16 pb-12 overflow-hidden border-t border-amber-500/20">
      {/* Decorative Night Stars & Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-indigo-900/60">
          
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-[2px] shadow-glow-amber">
                <div className="w-full h-full bg-[#1E1B4B] rounded-[14px] flex items-center justify-center">
                  <Moon className="w-5 h-5 text-amber-300 fill-amber-300/30 transform -rotate-12" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-display">
                NurQissa<span className="text-amber-400 text-lg font-bold">AI</span>
              </span>
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              {locale === 'uz'
                ? "Har bir bolajonning qalbida ezgulik, sabr, saxovat va shukronalik chiroqlarini yoquvchi shaxsiylashtirilgan ertaklar olami."
                : "A magical world of personalized bedtime stories lighting the lamps of patience, gratitude, generosity, and kindness in every child's heart."}
            </p>

            <div className="flex items-center gap-3 text-xs text-emerald-300/90 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{locale === 'uz' ? "100% bolalar uchun xavfsiz va ibratli kontent" : "100% child-safe, values-centered content"}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
              {locale === 'uz' ? "Bo'limlar" : "Navigation"}
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/" className="hover:text-amber-300 transition-colors">
                  {locale === 'uz' ? "Bosh sahifa" : "Home"}
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.createStory}</span>
                </Link>
              </li>
              <li>
                <Link href="/story/aqilli-bola-yusuf" className="hover:text-amber-300 transition-colors">
                  {locale === 'uz' ? "Namunaviy ertak" : "Sample Story"}
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-amber-300 transition-colors">
                  {t.library}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Values */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
              {locale === 'uz' ? "Ezgu Qadriyatlar" : "Core Virtues"}
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>{locale === 'uz' ? "Sabr-toqat (Sabr)" : "Patience (Sabr)"}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{locale === 'uz' ? "Shukronalik (Shukr)" : "Gratitude (Shukr)"}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>{locale === 'uz' ? "Ota-onaga hurmat" : "Respect for Parents"}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                <span>{locale === 'uz' ? "Saxovat va saxiy qo'l" : "Generosity & Sharing"}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
              {locale === 'uz' ? "Bog'lanish & Aloqa" : "Contact & Support"}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <a 
                  href="https://t.me/nurqissaaa_bot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-sky-300 transition-colors group"
                >
                  <Send className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">Telegram: @nurqissaaa_bot</span>
                </a>
              </li>
              <li>
                <a 
                  href={CONTACT_CONFIG.telLink} 
                  className="flex items-center gap-2 hover:text-emerald-300 transition-colors group"
                >
                  <Phone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold">{CONTACT_CONFIG.phone}</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:support@nurqissa.ai" 
                  className="flex items-center gap-2 hover:text-amber-300 transition-colors group"
                >
                  <Mail className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">support@nurqissa.ai</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com/nurqissa.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-rose-300 transition-colors group"
                >
                  <Instagram className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">Instagram: @nurqissa.ai</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} NurQissa AI. {locale === 'uz' ? "Barcha huquqlar himoyalangan." : "All rights reserved."}</p>
          <div className="flex items-center gap-1.5 text-amber-300/80">
            <span>{locale === 'uz' ? "Farzandlarimiz kelajagi uchun mehr bilan yaratildi" : "Crafted with love for the children's future"}</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
