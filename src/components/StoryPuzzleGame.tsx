'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Trophy, RotateCcw, Play, CheckCircle2, 
  Clock, ArrowRight, Star, Heart, Award, Volume2, ShieldCheck, Compass
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import ColoringStudio from '@/components/ColoringStudio';
import confetti from 'canvas-confetti';

interface StoryPuzzleGameProps {
  initialImageUrl?: string;
  storyTitle?: string;
  onGameComplete?: () => void;
}

const SAMPLE_PUZZLE_IMAGES = [
  { id: 'fotima-1', url: '/stories/fotima/page_1.jpeg', titleUz: "Fotimaxon va Mehribon Buvijonisi", titleEn: "Fotima and Loving Grandmother" },
  { id: 'yusuf-cover', url: '/stories/yusuf/cover.jpeg', titleUz: "Aqlli Yusufjonning Odobi", titleEn: "Smart Yusuf's Noble Character" },
  { id: 'ramazon-cover', url: '/stories/ramazon/cover.jpeg', titleUz: "Muborak Ramazon Oyi", titleEn: "Blessed Ramadan Moon" },
  { id: 'fotima-4', url: '/stories/fotima/page_4.jpeg', titleUz: "Nurli Bog' va Saxovat", titleEn: "Radiant Garden and Sharing" },
  { id: 'yusuf-4', url: '/stories/yusuf/page_4.jpeg', titleUz: "Buvijon bilan Kitobxonlik", titleEn: "Reading with Grandmother" },
  { id: 'haj-1', url: '/stories/haj/page_1.jpeg', titleUz: "Nurli Ka'ba Ziyorati", titleEn: "Blessed Pilgrimage Journey" },
];

export default function StoryPuzzleGame({ initialImageUrl, storyTitle, onGameComplete }: StoryPuzzleGameProps) {
  const { locale, addNurCoins } = useAppStore();
  const isUz = locale === 'uz';

  const [activeTab, setActiveTab] = useState<'puzzle' | 'maze' | 'coloring'>('puzzle');
  const [selectedImage, setSelectedImage] = useState<string>(initialImageUrl || SAMPLE_PUZZLE_IMAGES[0].url);
  const [gridSize, setGridSize] = useState<3 | 4>(3); // 3x3 or 4x4
  const [pieces, setPieces] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);

  // Maze State
  const [mazePlayerPos, setMazePlayerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mazeTargetPos] = useState<{ x: number; y: number }>({ x: 4, y: 4 });
  const [collectedStars, setCollectedStars] = useState<string[]>([]);
  const [mazeWon, setMazeWon] = useState<boolean>(false);

  const totalTiles = gridSize * gridSize;

  // Initialize Puzzle
  const startNewPuzzle = (size: 3 | 4 = gridSize) => {
    setGridSize(size);
    const count = size * size;
    // Create solvable shuffled array
    let arr = Array.from({ length: count }, (_, i) => i);
    // Shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setPieces(arr);
    setMoves(0);
    setTimeSeconds(0);
    setIsPlaying(true);
    setIsWon(false);
  };

  useEffect(() => {
    startNewPuzzle(3);
  }, [selectedImage]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isWon) {
      interval = setInterval(() => {
        setTimeSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isWon]);

  // Swap two tiles
  const handleTileClick = (index: number) => {
    if (!isPlaying || isWon) return;

    // Check if clicked tile is adjacent to another piece or can swap with an empty/adjacent slot
    // For easy kid-friendly gameplay, swap clicked piece with the one next to it or let them click two pieces
    if (selectedTileIndex === null) {
      setSelectedTileIndex(index);
    } else {
      // Swap selectedTileIndex and index
      const newPieces = [...pieces];
      [newPieces[selectedTileIndex], newPieces[index]] = [newPieces[index], newPieces[selectedTileIndex]];
      setPieces(newPieces);
      setMoves((m) => m + 1);
      setSelectedTileIndex(null);

      // Check win condition
      const won = newPieces.every((val, idx) => val === idx);
      if (won) {
        setIsWon(true);
        setIsPlaying(false);
        addNurCoins(35);
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
        });
        if (onGameComplete) onGameComplete();
      }
    }
  };

  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);

  // Maze Logic
  const MAZE_GRID = [
    [0, 0, 1, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ];

  const MAZE_STARS = [
    { id: 's1', x: 1, y: 1 },
    { id: 's2', x: 3, y: 0 },
    { id: 's3', x: 0, y: 4 },
    { id: 's4', x: 3, y: 2 },
  ];

  const movePlayer = (dx: number, dy: number) => {
    if (mazeWon) return;
    const newX = mazePlayerPos.x + dx;
    const newY = mazePlayerPos.y + dy;

    if (newX >= 0 && newX < 5 && newY >= 0 && newY < 5) {
      if (MAZE_GRID[newY][newX] === 0) {
        setMazePlayerPos({ x: newX, y: newY });

        // Collect star if any
        const star = MAZE_STARS.find((s) => s.x === newX && s.y === newY);
        if (star && !collectedStars.includes(star.id)) {
          setCollectedStars((prev) => [...prev, star.id]);
          addNurCoins(10);
        }

        // Check if reached goal
        if (newX === mazeTargetPos.x && newY === mazeTargetPos.y) {
          setMazeWon(true);
          addNurCoins(30);
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.5 },
          });
        }
      }
    }
  };

  const resetMaze = () => {
    setMazePlayerPos({ x: 0, y: 0 });
    setCollectedStars([]);
    setMazeWon(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative w-full rounded-3xl bg-[#FFFDF5] dark:bg-[#002621] border-2 border-pine-800/40 dark:border-butter-200/40 shadow-2xl p-6 sm:p-8 overflow-hidden">
      
      {/* Header with Game Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-pine-800/20 dark:border-butter-200/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-800 dark:text-amber-200 text-xs font-black uppercase tracking-wider mb-2 border border-amber-400/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isUz ? "Diqqat & Mantiq O'yinlari" : "Logic & Memory Games"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-pine-900 dark:text-butter-100 font-display">
            {activeTab === 'puzzle' ? (isUz ? "🧩 Hikmatli Mozaika" : "🧩 Story Jigsaw Puzzle") : (isUz ? "🧭 Ezgu Qahramon Labirinti" : "🧭 Hero Path Labyrinth")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            {activeTab === 'puzzle' 
              ? (isUz ? "Ertak rasmini bo'laklardan yig'ing va farzandingiz diqqatini charxlang!" : "Assemble the story picture and train child's visual memory!") 
              : (isUz ? "Qahramonimizga ezgulik yo'lidan adashmasdan maqsadga yetishga yordam bering!" : "Guide the hero to reach the destination collecting wisdom stars!")}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-pine-900 p-1.5 rounded-2xl border border-slate-300 dark:border-pine-700">
          <button
            onClick={() => setActiveTab('puzzle')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'puzzle'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <span>🧩 {isUz ? "Mozaika" : "Puzzle"}</span>
          </button>
          <button
            onClick={() => setActiveTab('maze')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'maze'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <span>🧭 {isUz ? "Labirint" : "Maze"}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: STORY PUZZLE GAME */}
      {activeTab === 'puzzle' && (
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Controls & Image Picker */}
          <div className="lg:col-span-5 space-y-4">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-pine-900 border border-slate-200 dark:border-pine-700 shadow-sm flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">{isUz ? "Vaqt" : "Time"}</span>
                  <span className="text-base font-black text-pine-900 dark:text-butter-200">{formatTime(timeSeconds)}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-pine-900 border border-slate-200 dark:border-pine-700 shadow-sm flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-emerald-500" />
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">{isUz ? "Harakatlar" : "Moves"}</span>
                  <span className="text-base font-black text-pine-900 dark:text-butter-200">{moves}</span>
                </div>
              </div>
            </div>

            {/* Grid Size Switcher */}
            <div className="p-4 rounded-2xl bg-white dark:bg-pine-900 border border-slate-200 dark:border-pine-700">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-2">{isUz ? "Qiyinlik darajasi:" : "Difficulty:"}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startNewPuzzle(3)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    gridSize === 3 
                      ? 'bg-amber-500 text-white border-amber-500 font-black shadow-sm' 
                      : 'bg-slate-50 dark:bg-pine-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-pine-800'
                  }`}
                >
                  3x3 ({isUz ? "Oson" : "Easy"})
                </button>
                <button
                  onClick={() => startNewPuzzle(4)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    gridSize === 4 
                      ? 'bg-amber-500 text-white border-amber-500 font-black shadow-sm' 
                      : 'bg-slate-50 dark:bg-pine-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-pine-800'
                  }`}
                >
                  4x4 ({isUz ? "Zakovatli" : "Smart"})
                </button>
              </div>
            </div>

            {/* Image Selector Thumbnails */}
            <div className="p-4 rounded-2xl bg-white dark:bg-pine-900 border border-slate-200 dark:border-pine-700">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-2">{isUz ? "Ertak rasmini tanlang:" : "Pick story artwork:"}</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {SAMPLE_PUZZLE_IMAGES.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                      selectedImage === img.url 
                        ? 'border-amber-500 scale-105 shadow-md' 
                        : 'border-slate-200 dark:border-pine-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.titleUz} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => startNewPuzzle(gridSize)}
              className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-pine-800 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isUz ? "Qaytadan aralashtirish" : "Shuffle Again"}</span>
            </button>
          </div>

          {/* Right Puzzle Grid Arena */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            
            {/* Winning Banner */}
            {isWon && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="mb-4 p-4 rounded-2xl bg-emerald-500 text-white text-center shadow-xl w-full max-w-md animate-bounce"
              >
                <div className="flex items-center justify-center gap-2 text-lg font-black">
                  <Trophy className="w-6 h-6 text-amber-300" />
                  <span>{isUz ? "MashaAlloh! Mozaika to'liq yig'ildi! 🎉" : "MashaAllah! Puzzle Completed! 🎉"}</span>
                </div>
                <p className="text-xs text-emerald-100 mt-1 font-semibold">
                  {isUz ? `Siz ${moves} ta harakat va ${formatTime(timeSeconds)} da yig'dingiz. +35 Nur tangasi berildi!` : `Solved in ${moves} moves and ${formatTime(timeSeconds)}. +35 Nur coins earned!`}
                </p>
              </motion.div>
            )}

            {/* The Puzzle Frame */}
            <div 
              className="relative w-full max-w-sm sm:max-w-md aspect-square bg-slate-200 dark:bg-pine-950 rounded-3xl p-3 shadow-2xl border-4 border-pine-800/60 dark:border-butter-300/60"
            >
              <div 
                className="w-full h-full grid gap-1.5 rounded-2xl overflow-hidden bg-slate-800"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`
                }}
              >
                {pieces.map((pieceIdx, tilePosition) => {
                  const isSelected = selectedTileIndex === tilePosition;
                  const row = Math.floor(pieceIdx / gridSize);
                  const col = pieceIdx % gridSize;
                  const isCorrect = pieceIdx === tilePosition;

                  return (
                    <motion.div
                      key={tilePosition}
                      layout
                      onClick={() => handleTileClick(tilePosition)}
                      whileHover={{ scale: 0.98 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-amber-400 ring-4 ring-amber-400/50 z-20 scale-105' 
                          : isCorrect 
                            ? 'border-emerald-500/60' 
                            : 'border-white/40 hover:border-amber-300'
                      }`}
                    >
                      {/* Background Slice using CSS background positioning */}
                      <div
                        className="w-full h-full bg-cover"
                        style={{
                          backgroundImage: `url(${selectedImage})`,
                          backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                          backgroundPosition: `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`
                        }}
                      />

                      {/* Tile Number Indicator */}
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/50 text-[10px] font-bold text-white/90 backdrop-blur-sm pointer-events-none">
                        {pieceIdx + 1}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 italic text-center">
              {isUz ? "💡 Ikkita bo'lakni ketma-ket bosing va ularning o'rnini almashtirib, rasmni tiklang." : "💡 Click two pieces in turn to swap their positions and complete the picture."}
            </p>
          </div>

        </div>
      )}

      {/* TAB 2: HERO LABYRINTH / MAZE GAME */}
      {activeTab === 'maze' && (
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Instructions & Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-pine-900 border border-slate-200 dark:border-pine-700 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                <Compass className="w-4 h-4" />
                <span>{isUz ? "Ezgulik Maqsadi:" : "Hero Quest:"}</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
                {isUz 
                  ? "Qahramonimizga adashmasdan yulduzlarni yig'ib, ezgulik manziliga (masjid/uy) yetib borishiga yo'l ko'rsating!" 
                  : "Help the hero navigate through the path, collect glowing stars, and reach the blessed sanctuary!"}
              </p>

              <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                <span>⭐ {isUz ? "Yig'ilgan yulduzlar:" : "Stars:"}</span>
                <span className="text-amber-500 font-black">{collectedStars.length} / {MAZE_STARS.length}</span>
              </div>
            </div>

            {/* Virtual Arrow Controller for touch/mouse */}
            <div className="p-4 rounded-2xl bg-white dark:bg-pine-900 border border-slate-200 dark:border-pine-700 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-500 mb-2">{isUz ? "Harakatlantirish tugmalari:" : "Navigation Controls:"}</span>
              
              <div className="grid grid-cols-3 gap-2 w-48">
                <div />
                <button
                  onClick={() => movePlayer(0, -1)}
                  className="p-3.5 rounded-xl bg-slate-100 dark:bg-pine-800 hover:bg-amber-400 dark:hover:bg-amber-500 text-slate-800 hover:text-white font-black text-sm shadow-sm transition-all"
                >
                  ⬆️
                </button>
                <div />

                <button
                  onClick={() => movePlayer(-1, 0)}
                  className="p-3.5 rounded-xl bg-slate-100 dark:bg-pine-800 hover:bg-amber-400 dark:hover:bg-amber-500 text-slate-800 hover:text-white font-black text-sm shadow-sm transition-all"
                >
                  ⬅️
                </button>
                <button
                  onClick={() => movePlayer(0, 1)}
                  className="p-3.5 rounded-xl bg-slate-100 dark:bg-pine-800 hover:bg-amber-400 dark:hover:bg-amber-500 text-slate-800 hover:text-white font-black text-sm shadow-sm transition-all"
                >
                  ⬇️
                </button>
                <button
                  onClick={() => movePlayer(1, 0)}
                  className="p-3.5 rounded-xl bg-slate-100 dark:bg-pine-800 hover:bg-amber-400 dark:hover:bg-amber-500 text-slate-800 hover:text-white font-black text-sm shadow-sm transition-all"
                >
                  ➡️
                </button>
              </div>
            </div>

            <button
              onClick={resetMaze}
              className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-pine-800 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isUz ? "Boshidan boshlash" : "Restart Path"}</span>
            </button>
          </div>

          {/* Right Maze Arena Grid */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            
            {mazeWon && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="mb-4 p-4 rounded-2xl bg-emerald-500 text-white text-center shadow-xl w-full max-w-md animate-bounce"
              >
                <div className="flex items-center justify-center gap-2 text-lg font-black">
                  <Trophy className="w-6 h-6 text-amber-300" />
                  <span>{isUz ? "MashaAlloh! Manzilga yetib keldingiz! 🎉" : "MashaAllah! Goal Reached! 🎉"}</span>
                </div>
                <p className="text-xs text-emerald-100 mt-1 font-semibold">
                  {isUz ? `Barcha hikmat yulduzlari yig'ildi! +30 Nur tangasi berildi.` : `All stars collected! +30 Nur coins added.`}
                </p>
              </motion.div>
            )}

            {/* Maze Grid (5x5) */}
            <div className="relative w-full max-w-sm sm:max-w-md aspect-square bg-[#01352E] rounded-3xl p-4 shadow-2xl border-4 border-pine-800/60 dark:border-butter-300/60">
              <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-2 rounded-2xl overflow-hidden bg-pine-950 p-2">
                {MAZE_GRID.map((row, rIdx) =>
                  row.map((cell, cIdx) => {
                    const isWall = cell === 1;
                    const isPlayer = mazePlayerPos.x === cIdx && mazePlayerPos.y === rIdx;
                    const isGoal = mazeTargetPos.x === cIdx && mazeTargetPos.y === rIdx;
                    const isStar = MAZE_STARS.some((s) => s.x === cIdx && s.y === rIdx && !collectedStars.includes(s.id));

                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`relative rounded-xl flex items-center justify-center transition-all ${
                          isWall 
                            ? 'bg-pine-800/90 border border-pine-700 shadow-inner' 
                            : 'bg-emerald-900/40 border border-emerald-500/20'
                        }`}
                      >
                        {isWall && <span className="text-xs opacity-40">🧱</span>}

                        {isPlayer && (
                          <motion.div 
                            layoutId="player"
                            className="w-10 h-10 rounded-full bg-amber-400 border-2 border-white shadow-lg flex items-center justify-center text-xl z-20 animate-bounce"
                          >
                            👧
                          </motion.div>
                        )}

                        {isStar && !isPlayer && (
                          <div className="text-lg animate-pulse">
                            ⭐
                          </div>
                        )}

                        {isGoal && !isPlayer && (
                          <div className="text-2xl animate-pulse">
                            🕌
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 italic text-center">
              {isUz ? "💡 Yo'nalish tugmalari yoki klaviatura strelkalari bilan qahramonni harakatlantiring." : "💡 Use directional arrow buttons to navigate the hero to the sanctuary."}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
