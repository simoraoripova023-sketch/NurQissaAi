'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, User, LogOut, Heart } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import confetti from 'canvas-confetti';

export default function MagicOwlAuthButton() {
  const { locale, setIsAuthModalOpen, currentUser, logoutUser } = useAppStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isWinking, setIsWinking] = useState(false);

  const handleClick = () => {
    setIsWinking(true);
    setTimeout(() => setIsWinking(false), 800);

    // Sparkle burst
    confetti({
      particleCount: 20,
      spread: 45,
      origin: { y: 0.15, x: 0.82 },
      colors: ['#FFEFB3', '#013E37', '#F59E0B'],
    });

    setIsAuthModalOpen(true);
  };

  return (
    <div className="relative inline-flex items-center select-none">
      
      {/* Interactive Cute Fairy Owl Button */}
      <motion.button
        type="button"
        onClick={handleClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-butter-200 hover:bg-butter-300 border-2 border-pine-800 text-pine-950 font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all group focus:outline-none"
        title={currentUser ? currentUser.name : (locale === 'uz' ? "Dono Boyqushcha orqali ro'yxatdan o'tish" : "Fairy Owl Sign In")}
      >
        
        {/* The Cute Bedtime Owl SVG */}
        <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
          
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Owl Body */}
            <ellipse cx="16" cy="18" rx="11" ry="12" fill="#013E37" />
            
            {/* Owl Belly (Butter Cream) */}
            <ellipse cx="16" cy="20" rx="7" ry="8" fill="#FFEFB3" />
            
            {/* Belly Feather Patterns */}
            <path d="M14 17C14.5 18 15.5 18 16 17" stroke="#013E37" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M16 17C16.5 18 17.5 18 18 17" stroke="#013E37" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M15 21C15.5 22 16.5 22 17 21" stroke="#013E37" strokeWidth="1.2" strokeLinecap="round" />

            {/* Owl Feather Ears */}
            <path d="M7 10L11 13L9 6L7 10Z" fill="#013E37" />
            <path d="M25 10L21 13L23 6L25 10Z" fill="#013E37" />

            {/* Left Eye (Big and Cute) */}
            <circle cx="11.5" cy="13.5" r="4.5" fill="#FFEFB3" stroke="#013E37" strokeWidth="1.2" />
            {isWinking ? (
              <path d="M9.5 14C10.5 12.5 12.5 12.5 13.5 14" stroke="#013E37" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <>
                <circle cx="11.5" cy="13.5" r="2.3" fill="#013E37" />
                <circle cx="12.3" cy="12.5" r="0.8" fill="#FFFDF5" />
              </>
            )}

            {/* Right Eye (Big and Cute) */}
            <circle cx="20.5" cy="13.5" r="4.5" fill="#FFEFB3" stroke="#013E37" strokeWidth="1.2" />
            <circle cx="20.5" cy="13.5" r="2.3" fill="#013E37" />
            <circle cx="21.3" cy="12.5" r="0.8" fill="#FFFDF5" />

            {/* Beak */}
            <polygon points="16,15 14,18 18,18" fill="#F59E0B" />

            {/* Tiny Wings */}
            <path d="M5 16C5 21 7 24 9 24" stroke="#013E37" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M27 16C27 21 25 24 23 24" stroke="#013E37" strokeWidth="2.2" strokeLinecap="round" fill="none" />

            {/* Little Nightcap */}
            <path d="M12 7C14 4 18 4 20 7L24 9C24 9 23 5 18 5C14 5 12 7 12 7Z" fill="#F59E0B" />
            <circle cx="24.5" cy="9.5" r="1.8" fill="#FFEFB3" stroke="#013E37" strokeWidth="0.8" />

            {/* Feet */}
            <ellipse cx="13" cy="29" rx="2" ry="1" fill="#F59E0B" />
            <ellipse cx="19" cy="29" rx="2" ry="1" fill="#F59E0B" />
          </svg>

          {/* Tiny Scroll in Wing */}
          <div className="absolute -bottom-1 -right-1.5 w-3.5 h-3 bg-amber-100 border border-pine-800 rounded-sm shadow-xs flex items-center justify-center">
            <span className="text-[7px] leading-none">📜</span>
          </div>

        </div>

        {/* Text Label */}
        <div className="flex flex-col text-left pr-1">
          <span className="text-[11px] sm:text-xs font-black leading-tight text-pine-950">
            {currentUser ? currentUser.name : (locale === 'uz' ? "Ro'yxatdan o'tish" : "Sign Up")}
          </span>
          <span className="text-[9px] font-bold text-pine-700 leading-none">
            {currentUser ? (locale === 'uz' ? "Hisobim 🌟" : "My Account 🌟") : (locale === 'uz' ? "Dono Boyqushcha 🦉" : "Fairy Owl 🦉")}
          </span>
        </div>

      </motion.button>

    </div>
  );
}
