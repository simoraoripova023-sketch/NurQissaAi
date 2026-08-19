'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Brush, Eraser, RotateCcw, 
  Download, Sparkles, Trophy, Star, Check, Volume2, 
  BookOpen, HelpCircle, Heart, Compass, ShieldCheck, PenTool, Image as ImageIcon, Smile, Award
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import confetti from 'canvas-confetti';

interface AqidaLessonTemplate {
  id: string;
  lessonNumber: number;
  questionUz: string;
  questionEn: string;
  answerUz: string;
  answerEn: string;
  instructionUz: string;
  instructionEn: string;
  imageUrl: string;
  icon: string;
  badge: string;
}

const AQIDA_TEMPLATES: AqidaLessonTemplate[] = [
  {
    id: 'lesson-robbim',
    lessonNumber: 1,
    questionUz: "Robbing kim?",
    questionEn: "Who is your Lord?",
    answerUz: "Mening Robbim — butun olamlarni, quyoshni, yulduzlarni va bizni yaratgan Mehribon ALLOHDIR!",
    answerEn: "My Lord is ALLAH, the Creator of the heavens, the earth, the shining sun, and all living beings!",
    instructionUz: "Quyosh nurlari, gullar, qushchalar va tabiat go'zalligini yorqin ranglar bilan bo'yang.",
    instructionEn: "Color the radiant sun, blooming garden, birds, and nature with vibrant colors.",
    imageUrl: "/coloring/lesson-robbim.png",
    icon: "☀️",
    badge: "1-Saboq: Tavhid"
  },
  {
    id: 'lesson-dinim',
    lessonNumber: 2,
    questionUz: "Dining qaysi?",
    questionEn: "What is your Religion?",
    answerUz: "Mening dinim — tinchlik, mehr-oqibat, ota-onaga hurmat va ezgulik dini bo'lgan ISLOMDIR!",
    answerEn: "My religion is ISLAM — the noble path of peace, love, kindness, and spiritual purity!",
    instructionUz: "Muazzam jome masjidi gumbazlari, minoralar, hilol oy va fanochiroqlarni bo'yang.",
    instructionEn: "Color the grand fairytale mosque, domes, minarets, crescent moon, and lanterns.",
    imageUrl: "/coloring/lesson-dinim.png",
    icon: "🕌",
    badge: "2-Saboq: Islom"
  },
  {
    id: 'lesson-paygambar',
    lessonNumber: 3,
    questionUz: "Payg'ambaring kim?",
    questionEn: "Who is your Prophet?",
    answerUz: "Mening payg'ambarim — barcha olamlarga cheksiz rahmat qilib yuborilgan Muhammad Mustafo (s.a.v.)dirlar!",
    answerEn: "My Prophet is Muhammad Mustafa (peace be upon him), sent as a mercy to all creation!",
    instructionUz: "Madinai Munavvara Yashil Gumbazi, serhosil xurmozor va muborak bog'ni bo'yang.",
    instructionEn: "Color the blessed Green Dome of Madinah, date palms, and peaceful garden path.",
    imageUrl: "/coloring/lesson-paygambar.png",
    icon: "🌴",
    badge: "3-Saboq: Risolat"
  },
  {
    id: 'lesson-kitob',
    lessonNumber: 4,
    questionUz: "Muqaddas Kitobing qaysi?",
    questionEn: "What is your Holy Book?",
    answerUz: "Mening muqaddas kitobim — Alloh taoloning bizga hidoyat nuri qilib nozil qilgan QUR'ONI KARIMDIR!",
    answerEn: "My Holy Book is the NOBLE QUR'AN — the divine word of Allah and eternal guidance!",
    instructionUz: "O'yma naqshli lavhdagi Qur'oni Karim sahifalari va samoviy nurlarni bo'yang.",
    instructionEn: "Color the illuminated Holy Qur'an on the carved wooden stand and divine rays.",
    imageUrl: "/coloring/lesson-kitob.png",
    icon: "📖",
    badge: "4-Saboq: Qur'on"
  },
  {
    id: 'lesson-qibla',
    lessonNumber: 5,
    questionUz: "Qiblang qayer?",
    questionEn: "Where is your Qibla?",
    answerUz: "Mening qiblam — Makkayi Mukarramadagi muqaddas va ulug'vor KA'BATULLOHDIR!",
    answerEn: "My Qibla is the sacred and magnificent KA'BA in Makkah al-Mukarramah!",
    instructionUz: "Muazzam Ka'batulloh, Oltin Eshik, Kisva kamari va samoda parvoz qilayotgan oq kaptarlarni bo'yang.",
    instructionEn: "Color the Holy Ka'bah in 3D, Golden Door, Kiswah embroidery, and flying white doves.",
    imageUrl: "/coloring/lesson-qibla.png",
    icon: "🕋",
    badge: "5-Saboq: Qibla"
  }
];

// Tracing Lines data for Fine Motor Writing
const TRACING_PATHS = [
  { id: 't1', titleUz: "Politsiya xodimi 👮 ───> Tartib o'rnatish 🚨", type: 'straight', iconStart: '👮', iconEnd: '🚨', pathD: 'M 30 100 L 570 100' },
  { id: 't2', titleUz: "O't o'chiruvchi 🚒 ∿∿∿> Olovni o'chirish 🔥", type: 'wave', iconStart: '🚒', iconEnd: '🔥', pathD: 'M 30 100 Q 150 20 270 100 T 510 100 L 570 100' },
  { id: 't3', titleUz: "Shifokor 🩺 ∧∧∧> Bemor bolakayga 👦", type: 'zigzag', iconStart: '🩺', iconEnd: '👦', pathD: 'M 30 100 L 120 30 L 210 100 L 300 30 L 390 100 L 480 30 L 570 100' },
  { id: 't4', titleUz: "Oshpaz 👨‍🍳 ⋒⋒⋒> Qozonga 🍲", type: 'loops', iconStart: '👨‍🍳', iconEnd: '🍲', pathD: 'M 30 100 Q 100 170 170 100 Q 240 170 310 100 Q 380 170 450 100 L 570 100' },
  { id: 't5', titleUz: "Quruvchi 👷 ⎍⎍⎍> Shinam uy qurish 🏠", type: 'steps', iconStart: '👷', iconEnd: '🏠', pathD: 'M 30 100 L 110 100 L 110 40 L 190 40 L 190 100 L 270 100 L 270 40 L 350 40 L 350 100 L 570 100' },
];

// Islamic and cute stickers for Free Drawing mode
const STICKERS = [
  { id: 's-kaba', icon: '🕋', nameUz: "Ka'batulloh" },
  { id: 's-mosque', icon: '🕌', nameUz: "Masjid" },
  { id: 's-moon', icon: '🌙', nameUz: "Hilol" },
  { id: 's-sun', icon: '☀️', nameUz: "Quyosh" },
  { id: 's-star', icon: '⭐', nameUz: "Yulduzcha" },
  { id: 's-book', icon: '📖', nameUz: "Qur'on" },
  { id: 's-flower', icon: '🌸', nameUz: "Gul" },
  { id: 's-dove', icon: '🕊️', nameUz: "Kaptar" },
  { id: 's-heart', icon: '💖', nameUz: "Mehr" },
  { id: 's-gift', icon: '🎁', nameUz: "Hadya" },
];

const PALETTE_COLORS = [
  { hex: '#10B981', name: 'Zumrad Yashil' },
  { hex: '#059669', name: 'To\'q Yashil' },
  { hex: '#F59E0B', name: 'Oltin Sariq' },
  { hex: '#FBBF24', name: 'Quyosh Nuri' },
  { hex: '#3B82F6', name: 'Moviy Osmon' },
  { hex: '#1D4ED8', name: 'Dengiz Ko\'ki' },
  { hex: '#EC4899', name: 'Pushti Atirgul' },
  { hex: '#8B5CF6', name: 'Binafsha Nur' },
  { hex: '#EF4444', name: 'Yoqut Qizil' },
  { hex: '#F97316', name: 'Shirin Apelsin' },
  { hex: '#8D6E63', name: 'Daraxt Jigar' },
  { hex: '#5D4037', name: 'To\'q Qahva' },
  { hex: '#14B8A6', name: 'Firuza Suv' },
  { hex: '#FFFFFF', name: 'Sutdek Oq' },
  { hex: '#1E293B', name: 'Tungi Qora' },
];

type StudioTab = 'coloring' | 'tracing' | 'freehand';

export default function ColoringStudio() {
  const { locale, addNurCoins } = useAppStore();
  const isUz = locale === 'uz';

  const [activeTab, setActiveTab] = useState<StudioTab>('coloring');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const freeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const traceCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [selectedTemplate, setSelectedTemplate] = useState<AqidaLessonTemplate>(AQIDA_TEMPLATES[0]);
  const [currentColor, setCurrentColor] = useState<string>('#F59E0B');
  const [brushSize, setBrushSize] = useState<number>(20);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Tracing selected route
  const [selectedTracePath, setSelectedTracePath] = useState(TRACING_PATHS[0]);
  const [placedStickers, setPlacedStickers] = useState<{ id: string; icon: string; x: number; y: number }[]>([]);

  // Clear paint layer on template change
  const clearPaintCanvas = () => {
    const canvas = activeTab === 'coloring' ? canvasRef.current : (activeTab === 'freehand' ? freeCanvasRef.current : traceCanvasRef.current);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (activeTab === 'freehand') {
      setPlacedStickers([]);
    }
  };

  useEffect(() => {
    clearPaintCanvas();
  }, [selectedTemplate, activeTab, selectedTracePath]);

  // Audio speech narration for children
  const speakLesson = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const textToRead = isUz 
      ? `${selectedTemplate.questionUz}. ${selectedTemplate.answerUz}`
      : `${selectedTemplate.questionEn}. ${selectedTemplate.answerEn}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Drawing state refs
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const getPointerPos = (e: React.PointerEvent<HTMLCanvasElement>, targetCanvas: HTMLCanvasElement | null) => {
    if (!targetCanvas) return { x: 0, y: 0 };
    const rect = targetCanvas.getBoundingClientRect();

    const scaleX = targetCanvas.width / (rect.width || 1);
    const scaleY = targetCanvas.height / (rect.height || 1);
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>, targetCanvas: HTMLCanvasElement | null) => {
    e.preventDefault();
    try {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {}

    if (!targetCanvas) return;
    const ctx = targetCanvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const pos = getPointerPos(e, targetCanvas);
    lastPointRef.current = pos;

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = '#000000';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = brushSize * 1.8;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
      ctx.fillStyle = currentColor;
      ctx.lineWidth = brushSize;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, tool === 'eraser' ? brushSize * 0.9 : brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>, targetCanvas: HTMLCanvasElement | null) => {
    if (!isDrawing) return;
    e.preventDefault();
    if (!targetCanvas) return;
    const ctx = targetCanvas.getContext('2d');
    if (!ctx) return;

    const pos = getPointerPos(e, targetCanvas);

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 1.8;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (lastPointRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    lastPointRef.current = pos;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  // Add Sticker to Free Canvas
  const handleAddSticker = (sticker: { icon: string }) => {
    const newSticker = {
      id: `stk-${Date.now()}-${Math.random()}`,
      icon: sticker.icon,
      x: 350 + Math.random() * 200,
      y: 350 + Math.random() * 200,
    };
    setPlacedStickers(prev => [...prev, newSticker]);
  };

  // Download combined 1024x1024 High-Res artwork
  const handleSaveAndDownload = () => {
    const userCanvas = activeTab === 'coloring' ? canvasRef.current : (activeTab === 'freehand' ? freeCanvasRef.current : traceCanvasRef.current);
    if (!userCanvas) return;

    const offscreen = document.createElement('canvas');
    offscreen.width = 1024;
    offscreen.height = 1024;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;

    // 1. White Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. Draw user's painted colors
    ctx.drawImage(userCanvas, 0, 0, 1024, 1024);

    if (activeTab === 'coloring') {
      // 3. Render Master Line-art with Multiply blend
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = selectedTemplate.imageUrl;

      img.onload = () => {
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(img, 0, 0, 1024, 1024);

        const link = document.createElement('a');
        link.download = `NurQissa-Ijod-${selectedTemplate.id}.png`;
        link.href = offscreen.toDataURL('image/png');
        link.click();

        setIsSaved(true);
        addNurCoins(35);
        confetti({ particleCount: 160, spread: 95, origin: { y: 0.6 } });
        setTimeout(() => setIsSaved(false), 3000);
      };
    } else {
      // Freehand / Tracing download
      const link = document.createElement('a');
      link.download = `NurQissa-Ijod-${activeTab}-${Date.now()}.png`;
      link.href = offscreen.toDataURL('image/png');
      link.click();

      setIsSaved(true);
      addNurCoins(35);
      confetti({ particleCount: 160, spread: 95, origin: { y: 0.6 } });
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="relative w-full rounded-3xl bg-[#FFFDF5] dark:bg-[#002621] border-2 border-pine-800/40 dark:border-butter-200/40 shadow-2xl p-5 sm:p-8 overflow-hidden">
      
      {/* Top Main Switcher: Coloring vs Tracing vs Free Drawing */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-pine-800/20 dark:border-butter-200/20">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/30 to-emerald-400/30 text-pine-900 dark:text-amber-200 text-xs font-black uppercase tracking-wider mb-2 border border-amber-400/50 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>{isUz ? "«Nurli Ijodxona» — Rassomlik va Husnixat Maskani" : "Radiant Art Studio"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-pine-900 dark:text-butter-100 font-display flex items-center gap-3">
            {activeTab === 'coloring' && (isUz ? "🎨 Islomiy Saboqlarni Bo'yash" : "🎨 Islamic Lessons Coloring")}
            {activeTab === 'tracing' && (isUz ? "✍️ Sehrli Chiziqlar & Husnixat" : "✍️ Magic Tracing & Writing")}
            {activeTab === 'freehand' && (isUz ? "🤍 Oq Qog'oz & Islomiy Stikerlar" : "🤍 Free Drawing & Stickers")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl font-medium">
            {activeTab === 'coloring' && (isUz ? selectedTemplate.instructionUz : selectedTemplate.instructionEn)}
            {activeTab === 'tracing' && (isUz ? "Mo'yqalam bilan nuqtalar ustidan yurgizib, qahramonlarni manziliga eltib qo'ying va qo'lingizni yozuvga tayyorlang!" : "Trace dotted lines to develop fine motor writing skills!")}
            {activeTab === 'freehand' && (isUz ? "O'z tasavvuringizdagi rasmlarni chizing va go'zal stikerlar bilan bezating!" : "Draw anything you imagine and decorate with stickers!")}
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-pine-900 p-1.5 rounded-2xl border border-slate-300 dark:border-pine-700">
          <button
            onClick={() => setActiveTab('coloring')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'coloring' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <span>🎨 {isUz ? "Darslik Bo'yash" : "Coloring"}</span>
          </button>
          <button
            onClick={() => setActiveTab('tracing')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'tracing' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <span>✍️ {isUz ? "Sehrli Chiziqlar" : "Tracing"}</span>
          </button>
          <button
            onClick={() => setActiveTab('freehand')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'freehand' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <span>🤍 {isUz ? "Erkin Chizish" : "Free Draw"}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. COLORING TAB */}
      {/* ========================================================================= */}
      {activeTab === 'coloring' && (
        <>
          {/* Educational Question & Answer Highlight Card */}
          <div className="my-6 p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-100/90 via-emerald-50 to-amber-100/90 dark:from-pine-950 dark:via-pine-900 dark:to-pine-950 border-2 border-amber-400/70 dark:border-emerald-600/70 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-pine-950 font-black text-3xl flex items-center justify-center shadow-md shrink-0">
                {selectedTemplate.icon}
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isUz ? "Hikmatli Saboq & Javob:" : "Sacred Wisdom & Answer:"}</span>
                </span>
                <p className="text-base sm:text-lg font-black text-pine-950 dark:text-butter-100 mt-1 leading-snug">
                  {isUz ? selectedTemplate.answerUz : selectedTemplate.answerEn}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={speakLesson}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-pine-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-50"
              >
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span>{isUz ? "Tinglash" : "Listen"}</span>
              </button>

              <button
                onClick={handleSaveAndDownload}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>{isUz ? "Saqlash" : "Save"}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Toolbar */}
            <div className="lg:col-span-4 space-y-4">
              {/* Template selector */}
              <div className="p-4 rounded-3xl bg-white dark:bg-pine-900 border-2 border-slate-200 dark:border-pine-700 shadow-sm">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-2.5">
                  {isUz ? "«Jajji Musulmon» Aqida Saboqlari:" : "Select Aqida Lesson:"}
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {AQIDA_TEMPLATES.map((tmpl) => {
                    const isSelected = selectedTemplate.id === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        onClick={() => setSelectedTemplate(tmpl)}
                        className={`p-2.5 rounded-2xl text-left border-2 transition-all flex items-center justify-between gap-3 ${
                          isSelected 
                            ? 'border-amber-500 bg-amber-50 dark:bg-pine-950 font-bold shadow-md scale-[1.02]' 
                            : 'border-slate-200 dark:border-pine-800 bg-slate-50/80 dark:bg-pine-900/60 opacity-85 hover:opacity-100 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={tmpl.imageUrl} alt={tmpl.questionUz} className="w-10 h-10 rounded-xl object-cover border border-slate-300 dark:border-pine-700" />
                          <div>
                            <span className="text-xs font-black text-pine-900 dark:text-butter-100 block">
                              {isUz ? tmpl.questionUz : tmpl.questionEn}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                              {tmpl.badge}
                            </span>
                          </div>
                        </div>
                        {isSelected && <span className="text-xs text-amber-600 font-black">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tools & Palette */}
              <div className="p-4 rounded-3xl bg-white dark:bg-pine-900 border-2 border-slate-200 dark:border-pine-700 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTool('brush')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 ${
                      tool === 'brush' ? 'bg-amber-500 text-white font-black' : 'bg-slate-50 dark:bg-pine-950 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Brush className="w-3.5 h-3.5" />
                    <span>{isUz ? "Mo'yqalam" : "Brush"}</span>
                  </button>
                  <button
                    onClick={() => setTool('eraser')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 ${
                      tool === 'eraser' ? 'bg-slate-800 text-white font-black' : 'bg-slate-50 dark:bg-pine-950 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Eraser className="w-3.5 h-3.5" />
                    <span>{isUz ? "O'chirg'ich" : "Eraser"}</span>
                  </button>
                  <button onClick={clearPaintCanvas} className="p-2 rounded-xl bg-slate-100 dark:bg-pine-950 text-slate-700 dark:text-slate-300">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Color Palette */}
                <div className="grid grid-cols-5 gap-2 pt-2">
                  {PALETTE_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => { setCurrentColor(c.hex); setTool('brush'); }}
                      className={`relative aspect-square rounded-xl border transition-all ${
                        currentColor === c.hex && tool === 'brush' ? 'ring-2 ring-amber-500 scale-110 shadow-md' : ''
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Canvas Arena */}
            <div className="lg:col-span-8 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[580px] aspect-square bg-white rounded-3xl shadow-2xl border-4 border-pine-800/80 dark:border-butter-300/80 overflow-hidden select-none">
                <canvas
                  ref={canvasRef}
                  width={1024}
                  height={1024}
                  onPointerDown={(e) => handlePointerDown(e, canvasRef.current)}
                  onPointerMove={(e) => handlePointerMove(e, canvasRef.current)}
                  onPointerUp={handlePointerUp}
                  className="absolute inset-0 w-full h-full touch-none z-10 cursor-crosshair"
                />
                <img
                  src={selectedTemplate.imageUrl}
                  alt={selectedTemplate.questionUz}
                  style={{ mixBlendMode: 'multiply' }}
                  className="absolute inset-0 w-full h-full pointer-events-none z-20 object-contain"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. TRACING & FINE MOTOR WRITING TAB */}
      {/* ========================================================================= */}
      {activeTab === 'tracing' && (
        <div className="pt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Route Selector */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {isUz ? "Kasb va Yo'nalishni tanlang:" : "Select Profession Route:"}
              </h4>

              {TRACING_PATHS.map(path => {
                const isSelected = selectedTracePath.id === path.id;
                return (
                  <button
                    key={path.id}
                    onClick={() => setSelectedTracePath(path)}
                    className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-pine-900 shadow-md font-bold' 
                        : 'border-slate-200 dark:border-pine-800 bg-white dark:bg-pine-950'
                    }`}
                  >
                    <span className="text-xs text-slate-800 dark:text-butter-100">{path.titleUz}</span>
                    <span className="text-lg">{path.iconEnd}</span>
                  </button>
                );
              })}

              {/* Color tools */}
              <div className="p-4 rounded-3xl bg-white dark:bg-pine-900 border border-slate-200 dark:border-pine-800 space-y-3">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">{isUz ? "Cho'tka Rangi:" : "Brush Color:"}</span>
                <div className="grid grid-cols-5 gap-2">
                  {PALETTE_COLORS.slice(0, 10).map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setCurrentColor(c.hex)}
                      className={`aspect-square rounded-xl border ${currentColor === c.hex ? 'ring-2 ring-emerald-500 scale-110' : ''}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
                <button
                  onClick={clearPaintCanvas}
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-pine-950 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isUz ? "Chiziqni tozalash" : "Clear Line"}</span>
                </button>
              </div>
            </div>

            {/* Right Interactive Tracing Stage */}
            <div className="lg:col-span-8 flex flex-col items-center">
              <div className="relative w-full max-w-[620px] aspect-[6/3] bg-white rounded-3xl shadow-xl border-4 border-emerald-600/60 dark:border-butter-300/60 overflow-hidden">
                
                {/* SVG Dotted Guide Line */}
                <svg viewBox="0 0 600 200" className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <path
                    d={selectedTracePath.pathD}
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="10"
                    strokeDasharray="12 10"
                    strokeLinecap="round"
                  />
                  <path
                    d={selectedTracePath.pathD}
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Left & Right Icons */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl z-20 animate-bounce">
                  {selectedTracePath.iconStart}
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl z-20 animate-pulse">
                  {selectedTracePath.iconEnd}
                </div>

                {/* User Interactive Tracing Canvas */}
                <canvas
                  ref={traceCanvasRef}
                  width={600}
                  height={200}
                  onPointerDown={(e) => handlePointerDown(e, traceCanvasRef.current)}
                  onPointerMove={(e) => handlePointerMove(e, traceCanvasRef.current)}
                  onPointerUp={handlePointerUp}
                  className="absolute inset-0 w-full h-full touch-none z-10 cursor-crosshair"
                />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => {
                    addNurCoins(20);
                    confetti({ particleCount: 120, spread: 80 });
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xs shadow-md flex items-center gap-2 hover:scale-105 transition-all"
                >
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <span>{isUz ? "Chizib bo'ldim! (+20 Tanga)" : "Finished Tracing! (+20 Coins)"}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FREE DRAWING & ISLAMIC STICKERS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'freehand' && (
        <div className="pt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Stickers & Color Palette */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Stickers Basket */}
              <div className="p-4 rounded-3xl bg-white dark:bg-pine-900 border border-slate-200 dark:border-pine-800">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2.5">
                  ✨ {isUz ? "Islomiy & Sehrli Stikerlar:" : "Magic Stickers:"}
                </span>

                <div className="grid grid-cols-5 gap-2">
                  {STICKERS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleAddSticker(s)}
                      className="p-2.5 rounded-2xl bg-slate-50 dark:bg-pine-950 hover:bg-amber-100 dark:hover:bg-pine-800 border border-slate-200 dark:border-pine-700 text-2xl flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                      title={s.nameUz}
                    >
                      {s.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette & Brush */}
              <div className="p-4 rounded-3xl bg-white dark:bg-pine-900 border border-slate-200 dark:border-pine-800 space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTool('brush')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border ${tool === 'brush' ? 'bg-purple-600 text-white font-black' : 'bg-slate-50 dark:bg-pine-950'}`}
                  >
                    <span>🖌️ Mo'yqalam</span>
                  </button>
                  <button
                    onClick={() => setTool('eraser')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border ${tool === 'eraser' ? 'bg-slate-800 text-white font-black' : 'bg-slate-50 dark:bg-pine-950'}`}
                  >
                    <span>🧹 O'chirg'ich</span>
                  </button>
                  <button onClick={clearPaintCanvas} className="p-2 rounded-xl bg-slate-100 dark:bg-pine-950">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {PALETTE_COLORS.map(c => (
                    <button
                      key={c.hex}
                      onClick={() => { setCurrentColor(c.hex); setTool('brush'); }}
                      className={`aspect-square rounded-xl border ${currentColor === c.hex ? 'ring-2 ring-purple-500 scale-110' : ''}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveAndDownload}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 hover:scale-105 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{isUz ? "Asarni Yuklab Olish (HD)" : "Download Artwork"}</span>
              </button>
            </div>

            {/* Right Free Canvas Stage */}
            <div className="lg:col-span-8 flex flex-col items-center">
              <div className="relative w-full max-w-[580px] aspect-square bg-white rounded-3xl shadow-2xl border-4 border-purple-500/60 dark:border-butter-300/60 overflow-hidden select-none">
                
                {/* User Canvas */}
                <canvas
                  ref={freeCanvasRef}
                  width={1024}
                  height={1024}
                  onPointerDown={(e) => handlePointerDown(e, freeCanvasRef.current)}
                  onPointerMove={(e) => handlePointerMove(e, freeCanvasRef.current)}
                  onPointerUp={handlePointerUp}
                  className="absolute inset-0 w-full h-full touch-none z-10 cursor-crosshair"
                />

                {/* Render Placed Stickers */}
                {placedStickers.map(stk => (
                  <div
                    key={stk.id}
                    style={{ left: `${(stk.x / 1024) * 100}%`, top: `${(stk.y / 1024) * 100}%` }}
                    className="absolute text-5xl z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-bounce"
                  >
                    {stk.icon}
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 italic text-center">
                {isUz ? "💡 Oq qog'ozda bemalol rasm chizing va chap paneldan xohlagan stikeringizni bosing!" : "💡 Draw on white canvas and tap any sticker on the left to add!"}
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
