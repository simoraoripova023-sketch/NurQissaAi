/**
 * High-Definition Clean Islamic Storybook Illustration Engine for NurQissa AI
 * Provides crisp, clean, 100% text-free illustrations perfectly matched to story scenes.
 */

// Girl Storybook Scene Artwork (Clean 2K Fairytale Illustrations)
export const GIRL_SCENE_ARTWORK = [
  "/stories/fotima/page_1.jpeg", // 1. Greeting loving grandmother in courtyard
  "/stories/fotima/page_2.jpeg", // 2. Receiving the mysterious golden gift
  "/stories/fotima/page_3.jpeg", // 3. Opening illuminated Quran / book together
  "/stories/fotima/page_4.jpeg", // 4. Speaking with Allah through prayer & love
  "/stories/fotima/page_5.jpeg", // 5. Practicing letters and noble virtues
  "/stories/fotima/page_6.jpeg", // 6. Proudly sharing with loving mom and dad
  "/stories/fotima/page_7.jpeg", // 7. Heartfelt bedtime prayer with grandmother
  "/stories/fotima/page_8.jpeg", // 8. Sleeping peacefully under crescent moon
];

// Boy Storybook Scene Artwork (Clean High-Definition Fairytale Illustrations)
export const BOY_SCENE_ARTWORK = [
  "/stories/yusuf/page_1.jpeg", // 1. Coming home thoughtfully, garden & family
  "/stories/yusuf/page_2.jpeg", // 2. Warm cozy home, grandmother reciting story
  "/stories/yusuf/page_3.jpeg", // 3. Learning Quran, glowing lanterns
  "/stories/yusuf/page_4.jpeg", // 4. Family wisdom, love for parents
  "/stories/yusuf/page_5.jpeg", // 5. Practicing good deeds, kindness
  "/stories/yusuf/page_6.jpeg", // 6. Family dinner, gratitude with Bismillah
  "/stories/yusuf/page_7.jpeg", // 7. Sincere bedtime prayer with open palms
  "/stories/yusuf/page_8.jpeg", // 8. Peaceful sleep under stars with Alhamdulillah
];

export function getStorySceneImage(gender: string, pageNumber: number): string {
  const list = gender === 'boy' ? BOY_SCENE_ARTWORK : GIRL_SCENE_ARTWORK;
  const index = Math.max(0, Math.min(pageNumber - 1, list.length - 1));
  return list[index];
}

// Authentic Islamic Storybook Avatar Character Portraits from Uploaded Literature
export const PIXAR_AVATARS = [
  {
    id: "char-yusuf",
    gender: "boy",
    url: "/stories/yusuf_scene_0.png",
    label_uz: "Yusufjon (Aqlli bola)",
    label_en: "Yusuf (Wise boy)",
    desc: "Odobli, ziyoli, go'zal sabr va qalb xotirjamligi sohibi 6 yoshli o'g'il bola",
    defaultName: "Yusufjon",
    defaultAge: 6
  },
  {
    id: "char-fotima",
    gender: "girl",
    url: "/stories/fotima/page_1.jpeg",
    label_uz: "Fotimaxon (Erka qizaloq)",
    label_en: "Fatima (Sweet girl)",
    desc: "Qur'on harflarini sevuvchi, shirin tabassumli 5 yoshli nuryuzli qizaloq",
    defaultName: "Fotimaxon",
    defaultAge: 5
  },
  {
    id: "char-ibrohim",
    gender: "boy",
    url: "/stories/yusuf_scene_1.png",
    label_uz: "Ibrohim (Tafakkurli)",
    label_en: "Ibrahim (Thinker)",
    desc: "Yulduzlar va tabiat mo'jizalarini tafakkur qiluvchi, saxovatli 7 yoshli o'g'il bola",
    defaultName: "Ibrohim",
    defaultAge: 7
  },
  {
    id: "char-maryam",
    gender: "girl",
    url: "/stories/fotima/page_5.jpeg",
    label_uz: "Maryam (Shirin singilcha)",
    label_en: "Maryam (Little sister)",
    desc: "Ota-onasi va buvisiga mehr ulashuvchi, quvnoq 4 yoshli jajji qizaloq",
    defaultName: "Maryamxon",
    defaultAge: 4
  },
];

import { IllustrationStyle } from './types';

export interface IllustrationStyleOption {
  id: IllustrationStyle;
  label_uz: string;
  label_en: string;
  desc_uz: string;
  desc_en: string;
  icon: string;
  badge: string;
  colorGradient: string;
  promptModifier: string;
}

export const ILLUSTRATION_STYLES: IllustrationStyleOption[] = [
  {
    id: 'pixar_3d',
    label_uz: '3D Pixar & Disney',
    label_en: '3D Pixar Animation',
    desc_uz: 'Yumshoq yoritilgan, jozibali 3D multfilm qahramoni uslubi',
    desc_en: 'Softly lit, charming 3D cartoon character animation',
    icon: '🎬',
    badge: '3D Pixar',
    colorGradient: 'from-amber-500 to-orange-600',
    promptModifier: '3D Disney Pixar animation storybook style, soft glowing golden bedtime lighting, vibrant cozy colors, high resolution 3D render, masterpiece'
  },
  {
    id: 'watercolor',
    label_uz: 'Nafis Akvarel',
    label_en: 'Fairytale Watercolor',
    desc_uz: 'Yumshoq bo\'yoqli, ertakmonand mayin akvarel va qalam chizgilari',
    desc_en: 'Gentle washes of fairytale watercolor and delicate pencil art',
    icon: '🎨',
    badge: 'Akvarel',
    colorGradient: 'from-sky-400 to-indigo-500',
    promptModifier: 'gentle fairytale watercolor illustration, soft dreamy watercolor washes, delicate pencil line art, charming children storybook aesthetic'
  },
  {
    id: 'classic_storybook',
    label_uz: 'Klassik Kitobiy San\'at',
    label_en: 'Classic Storybook',
    desc_uz: 'Klassik bolalar kitoblari kabi iliq guash va yog\'li bo\'yoq jozibasi',
    desc_en: 'Warm gouache and rich oil painting vintage storybook art',
    icon: '📖',
    badge: 'Klassik Kitob',
    colorGradient: 'from-emerald-500 to-teal-700',
    promptModifier: 'classic vintage children\'s book illustration, rich oil and gouache painting style, warm cozy bedtime texture, heartwarming fairytale art'
  },
  {
    id: 'disney_2d',
    label_uz: 'Disney 2D Sehrli Multfilm',
    label_en: 'Disney 2D Classic',
    desc_uz: 'Klassik qo\'lda chizilgan 2D multfilm va tiniq yorqin ranglar',
    desc_en: 'Classic hand-drawn 2D animation style with vivid storybook colors',
    icon: '✨',
    badge: 'Disney 2D',
    colorGradient: 'from-rose-400 to-pink-600',
    promptModifier: 'classic Disney 2D hand-drawn animation style, expressive lively lines, bright fairytale colors, charming cartoon art'
  },
  {
    id: 'ghibli_anime',
    label_uz: 'Ghibli Osoyishta Uslubi',
    label_en: 'Ghibli Dreamy Anime',
    desc_uz: 'Hayao Miyazaki kabi tabiatga boy, osoyishta va nafis anime san\'ati',
    desc_en: 'Peaceful Studio Ghibli inspired anime art with lush magical nature',
    icon: '🌸',
    badge: 'Ghibli Uslub',
    colorGradient: 'from-teal-400 to-emerald-600',
    promptModifier: 'Studio Ghibli aesthetic, Hayao Miyazaki inspired whimsical anime art, lush vibrant background, gentle emotive lighting'
  }
];

