'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Trophy, CheckCircle2, RotateCcw, 
  Heart, Star, ArrowRight, Check, Award, Compass, Search, HelpCircle, ShieldCheck,
  Scissors, Volume2, Sparkle, VolumeX, Hand
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import confetti from 'canvas-confetti';

type GameMode = 'cleanliness' | 'animalFood' | 'animalHabitats' | 'ispy';

// Web Audio API Sound Synthesizer for cheerful kid-friendly sounds
const playKidSound = (type: 'pop' | 'chime' | 'water' | 'munch' | 'success') => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'water') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'munch') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(250, ctx.currentTime);
      osc.frequency.setValueAtTime(450, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } else if (type === 'chime' || type === 'success') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.3);
      });
    }
  } catch {}
};

// Play cheerful voice guidance in Uzbek for 3-5 year old kindergarten kids
const speakKidVoice = (textUz: string, textEn: string, isUz: boolean) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(isUz ? textUz : textEn);
  utterance.rate = 0.92; // Clear, slower tempo for toddlers
  utterance.pitch = 1.25; // Warm, friendly tone
  utterance.lang = isUz ? 'uz-UZ' : 'en-US';
  window.speechSynthesis.speak(utterance);
};

export default function MontessoriLearningGames() {
  const { locale, addNurCoins } = useAppStore();
  const isUz = locale === 'uz';

  const [activeGame, setActiveGame] = useState<GameMode>('cleanliness');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Helper to trigger voice if enabled
  const triggerVoice = (uz: string, en: string) => {
    if (voiceEnabled) {
      speakKidVoice(uz, en, isUz);
    }
  };

  // Welcome prompt on game change
  useEffect(() => {
    if (activeGame === 'cleanliness') {
      triggerVoice(
        "Keling, tozalik o'yinini o'ynaymiz! Iflos kiyimlarni kir yuvish mashinasiga, toza kiyimlarni esa shkafga taxlaymiz!",
        "Let's play the cleaning game! Put dirty clothes in the washing machine and clean clothes in the wardrobe!"
      );
    } else if (activeGame === 'animalFood') {
      triggerVoice(
        "Jonivorlarimiz och qolibdi! Qani, har biriga sevimli ovqatini beramiz!",
        "The animals are hungry! Let's feed them their favorite food!"
      );
    } else if (activeGame === 'animalHabitats') {
      triggerVoice(
        "Jonivorlar o'z uyini qidiryapti! Pingvin, sher va tuyaga o'z vatanini topishga yordam bering!",
        "Animals are looking for their homes! Help them find their natural habitat!"
      );
    } else if (activeGame === 'ispy') {
      triggerVoice(
        "Moviy dengiz tubidagi toshbaqa, delfin va baliqchalarni barmog'ingiz bilan bosing va sanang!",
        "Tap the turtles, dolphins, and clownfish in the ocean to count them!"
      );
    }
  }, [activeGame]);

  // ==========================================
  // GAME 1: POKLIK VA TARTIBXON (CLEANLINESS WORKSHEET)
  // ==========================================
  type ClothesCard = {
    id: string;
    icon: string;
    isDirty: boolean;
    voiceUz: string;
    voiceEn: string;
    color: string;
  };

  const CLOTHES_CARDS: ClothesCard[] = [
    { id: 'cc1', icon: "👕💥", isDirty: true, voiceUz: "Voy, bu futbolkaga dog' tegibdi! Uni kir yuvish mashinasiga solamiz!", voiceEn: "This shirt is stained! Put it in the washing machine!", color: "bg-amber-100 border-amber-400" },
    { id: 'cc2', icon: "🩳✨", isDirty: false, voiceUz: "Bu toza yashil shortik! Uni shkafga taxlaymiz!", voiceEn: "These green shorts are clean! Put them in the closet!", color: "bg-emerald-100 border-emerald-400" },
    { id: 'cc3', icon: "🩳🟤", isDirty: true, voiceUz: "Bu shimcha loy bo'lib qolibdi! Uni yuvish kerak!", voiceEn: "These pants are muddy! Let's wash them!", color: "bg-blue-100 border-blue-400" },
    { id: 'cc4', icon: "👚🎨", isDirty: true, voiceUz: "Pushti ko'ylakka bo'yoq tegibdi! Kir mashinaga solamiz!", voiceEn: "Paint on the pink dress! Put it in the washer!", color: "bg-pink-100 border-pink-400" },
    { id: 'cc5', icon: "👕🟤", isDirty: true, voiceUz: "Oq ko'ylak kir bo'libdi! Yuvish mashinasiga yuboramiz!", voiceEn: "Dirty white shirt! Send to washing machine!", color: "bg-slate-100 border-slate-400" },
    { id: 'cc6', icon: "🩳✨", isDirty: false, voiceUz: "Toza moviy shortik! Shkafga chiroyli qo'yamiz!", voiceEn: "Clean blue shorts! Put into the wardrobe!", color: "bg-sky-100 border-sky-400" },
    { id: 'cc7', icon: "👕✨", isDirty: false, voiceUz: "Yaltiragan oppoq futbolka! Shkafga taxlaymiz!", voiceEn: "Sparkling clean white tee! Place in wardrobe!", color: "bg-white border-slate-300" },
    { id: 'cc8', icon: "👕✨", isDirty: false, voiceUz: "Toza sariq futbolka! Shkafimizga solamiz!", voiceEn: "Clean yellow shirt! Place in closet!", color: "bg-yellow-100 border-yellow-400" },
  ];

  type DishesCard = {
    id: string;
    icon: string;
    isDirty: boolean;
    voiceUz: string;
    voiceEn: string;
    color: string;
  };

  const DISHES_CARDS: DishesCard[] = [
    { id: 'dc1', icon: "🍽️🍛", isDirty: true, voiceUz: "Likopchada ovqat qolibdi, uni rakovinada yuvamiz!", voiceEn: "Dirty plate with food, let's wash it in the sink!", color: "bg-amber-50 border-amber-400" },
    { id: 'dc2', icon: "🥣✨", isDirty: false, voiceUz: "Toza yaltiragan kosa! Oshxona javoniga qo'yamiz!", voiceEn: "Clean bowl! Put it on the kitchen shelf!", color: "bg-blue-50 border-blue-400" },
    { id: 'dc3', icon: "🥄🍲", isDirty: true, voiceUz: "Iflos qoshiqcha! Yuvish uchun rakovinaga solamiz!", voiceEn: "Dirty spoon! Put it in the sink to wash!", color: "bg-slate-50 border-slate-400" },
    { id: 'dc4', icon: "🍽️✨", isDirty: false, voiceUz: "Billurdek toza likopcha! Javonga taxlaymiz!", voiceEn: "Clean plate! Place on shelf!", color: "bg-emerald-50 border-emerald-400" },
    { id: 'dc5', icon: "☕🤎", isDirty: true, voiceUz: "Finjonda choy qolibdi! Yuvishga yuboramiz!", voiceEn: "Dirty mug! Send to the sink!", color: "bg-orange-50 border-orange-400" },
    { id: 'dc6', icon: "🍵✨", isDirty: false, voiceUz: "Toza yashil piyola! Shkafga chiroyli qo'yamiz!", voiceEn: "Clean green cup! Place in cupboard!", color: "bg-teal-50 border-teal-400" },
  ];

  const [cleaningCategory, setCleaningCategory] = useState<'clothes' | 'dishes'>('clothes');
  const [sortedClothes, setSortedClothes] = useState<{ [id: string]: 'machine' | 'closet' }>({});
  const [sortedDishes, setSortedDishes] = useState<{ [id: string]: 'sink' | 'shelf' }>({});
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleSelectCard = (card: ClothesCard | DishesCard) => {
    setSelectedCardId(card.id);
    playKidSound('pop');
    triggerVoice(card.voiceUz, card.voiceEn);
  };

  const handleSortCard = (target: 'machine' | 'closet' | 'sink' | 'shelf') => {
    if (!selectedCardId) {
      triggerVoice("Avval pastdagi kiyimchani tanlang!", "First tap a clothing card below!");
      return;
    }

    if (cleaningCategory === 'clothes') {
      const card = CLOTHES_CARDS.find(c => c.id === selectedCardId);
      if (!card) return;

      const isCorrect = (card.isDirty && target === 'machine') || (!card.isDirty && target === 'closet');
      if (isCorrect) {
        playKidSound('water');
        const updated = { ...sortedClothes, [card.id]: target };
        setSortedClothes(updated);
        setSelectedCardId(null);

        if (card.isDirty) {
          triggerVoice("Barakalla! Kir yuvish mashinasiga soldik! 🫧", "Great! Put in the washer! 🫧");
        } else {
          triggerVoice("Ofarin! Shkafga taxladik! ✨", "Awesome! Placed in the closet! ✨");
        }

        if (Object.keys(updated).length === CLOTHES_CARDS.length) {
          playKidSound('success');
          addNurCoins(30);
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
          triggerVoice("MashaAlloh! Hamma kiyimlar saranjom bo'ldi! Siz eng chaqqon yordamchisiz! 🎉", "MashaAllah! All clothes sorted perfectly! 🎉");
        }
      } else {
        playKidSound('pop');
        triggerVoice("Yo'q, bu boshqa joyga ketadi! Qaytadan urinib ko'ring.", "Oops, try putting it in the other place!");
      }
    } else {
      const card = DISHES_CARDS.find(c => c.id === selectedCardId);
      if (!card) return;

      const isCorrect = (card.isDirty && target === 'sink') || (!card.isDirty && target === 'shelf');
      if (isCorrect) {
        playKidSound('water');
        const updated = { ...sortedDishes, [card.id]: target };
        setSortedDishes(updated);
        setSelectedCardId(null);

        if (card.isDirty) {
          triggerVoice("To'g'ri! Rakovinada ko'pirtirib yuvamiz! 🚰", "Right! Let's wash it in the sink! 🚰");
        } else {
          triggerVoice("Ofarin! Toza idish javonga qo'yildi! 🍽️", "Good job! Clean dish on the shelf! 🍽️");
        }

        if (Object.keys(updated).length === DISHES_CARDS.length) {
          playKidSound('success');
          addNurCoins(30);
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
          triggerVoice("Ajoyib! Barcha idishlar yaltirab toza bo'ldi! 🎉", "Wonderful! All dishes are sparkling clean! 🎉");
        }
      } else {
        playKidSound('pop');
        triggerVoice("Qayta urinib ko'ring!", "Try again!");
      }
    }
  };

  // ==========================================
  // GAME 2: HAYVONLAR NIMA YEYDI? (ANIMAL FOOD MATCHING)
  // ==========================================
  type AnimalFoodSlot = {
    id: string;
    icon: string;
    correctFoodId: string;
    voiceUz: string;
    voiceEn: string;
    thankUz: string;
    thankEn: string;
    xPercent: number;
    yPercent: number;
  };

  const ANIMAL_SLOTS: AnimalFoodSlot[] = [
    { id: 'mouse', icon: "🐭", correctFoodId: 'cheese', voiceUz: "Mitti sichqoncha: Pi-pi-pi! Menga pishloq ber! 🧀", voiceEn: "Squeak! Give me cheese! 🧀", thankUz: "Rahmat! Pishloq juda mazali ekan! 🧀", thankEn: "Thank you for the cheese! 🧀", xPercent: 23, yPercent: 36 },
    { id: 'cow', icon: "🐮", correctFoodId: 'grass', voiceUz: "Sigirvoy: Mooo! Menga shira yashil maysa ber! 🌿", voiceEn: "Mooo! Give me fresh green grass! 🌿", thankUz: "Moo! Rahmat, to'yib yedim! 🌿", thankEn: "Moo! Thank you for the grass! 🌿", xPercent: 55, yPercent: 36 },
    { id: 'monkey', icon: "🐵", correctFoodId: 'banana', voiceUz: "Maymunjon: U-u-a-a! Menga shirin banan ber! 🍌", voiceEn: "Ooh-aah! Give me a sweet banana! 🍌", thankUz: "U-a-a! Banan juda shirin ekan! 🍌", thankEn: "Yum! Sweet banana! 🍌", xPercent: 87, yPercent: 36 },
    { id: 'bunny', icon: "🐰", correctFoodId: 'carrot', voiceUz: "Quyoncha: Xur-xur! Menga qarsildoq sabzi ber! 🥕", voiceEn: "Hop hop! Give me a crunchy carrot! 🥕", thankUz: "Qars-qars! Sabzi juda shirin ekan! 🥕", thankEn: "Crunchy carrot, thank you! 🥕", xPercent: 23, yPercent: 77 },
    { id: 'kitten', icon: "🐱", correctFoodId: 'fish', voiceUz: "Mushukcha: Miyov! Menga baliqcha va sut ber! 🐟", voiceEn: "Meow! Give me fish and milk! 🐟", thankUz: "Miyov! Rahmat, qornim to'ydi! 🐟", thankEn: "Meow! Thank you! 🐟", xPercent: 55, yPercent: 77 },
    { id: 'puppy', icon: "🐶", correctFoodId: 'bone', voiceUz: "Kuchukcha: Vov-vov! Menga mazali suyak ber! 🦴", voiceEn: "Woof woof! Give me a bone! 🦴", thankUz: "Vov! Rahmat mehribon do'stim! 🦴", thankEn: "Woof! Thank you best friend! 🦴", xPercent: 87, yPercent: 77 },
  ];

  type FoodCutout = {
    id: string;
    icon: string;
    voiceUz: string;
    voiceEn: string;
  };

  const FOOD_CUTOUTS: FoodCutout[] = [
    { id: 'cheese', icon: "🧀", voiceUz: "Bu sariq pishloq! Sichqonchaga beramiz!", voiceEn: "Yellow cheese! Give it to the mouse!" },
    { id: 'grass', icon: "🌿", voiceUz: "Bu shira yashil maysa! Sigirvoyga beramiz!", voiceEn: "Fresh grass! Give it to the cow!" },
    { id: 'banana', icon: "🍌", voiceUz: "Bu shirin banan! Maymunchaga beramiz!", voiceEn: "Sweet banana! Give it to the monkey!" },
    { id: 'carrot', icon: "🥕", voiceUz: "Bu qarsildoq sabzi! Quyonchaga beramiz!", voiceEn: "Crunchy carrot! Give it to the bunny!" },
    { id: 'fish', icon: "🐟", voiceUz: "Bu mayda baliqcha! Mushukchaga beramiz!", voiceEn: "Little fish! Give it to the kitten!" },
    { id: 'bone', icon: "🦴", voiceUz: "Bu mazali suyak! Kuchukchaga beramiz!", voiceEn: "Yummy bone! Give it to the puppy!" },
  ];

  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const [animalFedMap, setAnimalFedMap] = useState<{ [animalId: string]: string }>({});

  const handleSelectFood = (food: FoodCutout) => {
    setSelectedFoodId(food.id);
    playKidSound('pop');
    triggerVoice(food.voiceUz, food.voiceEn);
  };

  const handlePlaceFoodOnAnimal = (slot: AnimalFoodSlot) => {
    if (!selectedFoodId) {
      triggerVoice(slot.voiceUz, slot.voiceEn);
      return;
    }

    if (slot.correctFoodId === selectedFoodId) {
      playKidSound('munch');
      const updated = { ...animalFedMap, [slot.id]: selectedFoodId };
      setAnimalFedMap(updated);
      setSelectedFoodId(null);
      triggerVoice(slot.thankUz, slot.thankEn);

      if (Object.keys(updated).length === ANIMAL_SLOTS.length) {
        playKidSound('success');
        addNurCoins(35);
        confetti({ particleCount: 160, spread: 90 });
        triggerVoice("MashaAlloh! Barcha jonivorlarning qorni to'ydi va ular sizdan juda xursand! 🎉", "MashaAllah! All animals are fed and happy! 🎉");
      }
    } else {
      playKidSound('pop');
      triggerVoice("Voy, bu hayvon bu ovqatni yemaydi! Boshqa hayvonchaga berib ko'ring!", "Oops, this animal doesn't eat that! Try another animal!");
    }
  };

  // ==========================================
  // GAME 3: YASHASH MUHITI (HABITAT MATCHING)
  // ==========================================
  type HabitatPair = {
    id: string;
    icon: string;
    habitatIcon: string;
    habitatIndex: number;
    voiceUz: string;
    voiceEn: string;
    matchUz: string;
    matchEn: string;
  };

  const HABITAT_PAIRS: HabitatPair[] = [
    { id: 'penguin', icon: "🐧", habitatIcon: "❄️", habitatIndex: 1, voiceUz: "Men sovuqni yaxshi ko'raman! Mening uyim muzlik va igloo! ❄️", voiceEn: "I love cold! My home is the arctic ice! ❄️", matchUz: "To'g'ri! Pingvin qor va muzlikda yashaydi!", matchEn: "Correct! Penguin lives in the ice!" },
    { id: 'lion', icon: "🦁", habitatIcon: "🌾", habitatIndex: 2, voiceUz: "Rrr! Men o'rmonlar podshosiman! Mening uyim yashil savanna! 🌾", voiceEn: "Roar! My home is the African savanna! 🌾", matchUz: "Ofarin! Sher keng dalalarda yashaydi!", matchEn: "Awesome! Lion lives in savanna!" },
    { id: 'camel', icon: "🐪", habitatIcon: "🏜️", habitatIndex: 0, voiceUz: "Men sahro kemasiman! Mening uyim issiq oltin qumlik! 🏜️", voiceEn: "I am the ship of the desert! My home is the golden sand! 🏜️", matchUz: "Barakalla! Tuya sahroda yashaydi!", matchEn: "Bravo! Camel lives in the desert!" },
    { id: 'sloth', icon: "🦥", habitatIcon: "🌴", habitatIndex: 4, voiceUz: "Men shoshmasdan daraxtda osilib yotaman! Mening uyim tropik changalzor! 🌴", voiceEn: "I love hanging in trees! My home is the jungle! 🌴", matchUz: "To'g'ri! Yalqovvoy changalzor daraxtlarida yashaydi!", matchEn: "Correct! Sloth lives in the rainforest!" },
    { id: 'dolphin', icon: "🐬", habitatIcon: "🌊", habitatIndex: 3, voiceUz: "Men sho'ng'ib suzaman! Mening uyim moviy ummon va dengiz! 🌊", voiceEn: "I love jumping in waves! My home is the ocean! 🌊", matchUz: "Ofarin! Delfin moviy dengizda suzadi!", matchEn: "Awesome! Dolphin lives in the sea!" },
  ];

  const [selectedAnimalForHabitat, setSelectedAnimalForHabitat] = useState<HabitatPair | null>(null);
  const [matchedHabitats, setMatchedHabitats] = useState<{ [animalId: string]: number }>({});

  const handleSelectAnimalHabitat = (pair: HabitatPair) => {
    setSelectedAnimalForHabitat(pair);
    playKidSound('pop');
    triggerVoice(pair.voiceUz, pair.voiceEn);
  };

  const handleMatchHabitat = (habitatIndex: number) => {
    if (!selectedAnimalForHabitat) {
      triggerVoice("Avval chapdagi hayvonchani bosing!", "First tap an animal on the left!");
      return;
    }

    if (selectedAnimalForHabitat.habitatIndex === habitatIndex) {
      playKidSound('chime');
      const updated = { ...matchedHabitats, [selectedAnimalForHabitat.id]: habitatIndex };
      setMatchedHabitats(updated);
      triggerVoice(selectedAnimalForHabitat.matchUz, selectedAnimalForHabitat.matchEn);
      setSelectedAnimalForHabitat(null);

      if (Object.keys(updated).length === HABITAT_PAIRS.length) {
        playKidSound('success');
        addNurCoins(35);
        confetti({ particleCount: 160, spread: 90 });
        triggerVoice("MashaAlloh! Barcha jonivorlar o'z vatanini topdi! 🎉", "MashaAllah! All animals found their homes! 🎉");
      }
    } else {
      playKidSound('pop');
      triggerVoice("Bu uning uyi emas! Boshqa tabiat manzarachasini tanlang!", "Not this home! Try another landscape!");
    }
  };

  // ==========================================
  // GAME 4: I SPY — DENGIZ TUBI (UNDERWATER COUNTING WITH DIRECT TOUCH)
  // ==========================================
  type OceanCreatureHotspot = {
    id: string;
    type: 'turtle' | 'octopus' | 'dolphin' | 'clownfish';
    icon: string;
    nameUz: string;
    nameEn: string;
    xPercent: number;
    yPercent: number;
  };

  const OCEAN_CREATURES: OceanCreatureHotspot[] = [
    // 4 Turtles
    { id: 't1', type: 'turtle', icon: '🐢', nameUz: "Toshbaqa", nameEn: "Turtle", xPercent: 20, yPercent: 25 },
    { id: 't2', type: 'turtle', icon: '🐢', nameUz: "Toshbaqa", nameEn: "Turtle", xPercent: 36, yPercent: 39 },
    { id: 't3', type: 'turtle', icon: '🐢', nameUz: "Toshbaqa", nameEn: "Turtle", xPercent: 54, yPercent: 49 },
    { id: 't4', type: 'turtle', icon: '🐢', nameUz: "Toshbaqa", nameEn: "Turtle", xPercent: 57, yPercent: 68 },
    // 4 Octopuses
    { id: 'o1', type: 'octopus', icon: '🐙', nameUz: "Sakkizoyoq", nameEn: "Octopus", xPercent: 39, yPercent: 23 },
    { id: 'o2', type: 'octopus', icon: '🐙', nameUz: "Sakkizoyoq", nameEn: "Octopus", xPercent: 17, yPercent: 60 },
    { id: 'o3', type: 'octopus', icon: '🐙', nameUz: "Sakkizoyoq", nameEn: "Octopus", xPercent: 66, yPercent: 41 },
    { id: 'o4', type: 'octopus', icon: '🐙', nameUz: "Sakkizoyoq", nameEn: "Octopus", xPercent: 33, yPercent: 64 },
    // 4 Dolphins
    { id: 'd1', type: 'dolphin', icon: '🐬', nameUz: "Delfin", nameEn: "Dolphin", xPercent: 57, yPercent: 25 },
    { id: 'd2', type: 'dolphin', icon: '🐬', nameUz: "Delfin", nameEn: "Dolphin", xPercent: 82, yPercent: 18 },
    { id: 'd3', type: 'dolphin', icon: '🐬', nameUz: "Delfin", nameEn: "Dolphin", xPercent: 74, yPercent: 31 },
    { id: 'd4', type: 'dolphin', icon: '🐬', nameUz: "Delfin", nameEn: "Dolphin", xPercent: 20, yPercent: 15 },
    // 5 Clownfishes
    { id: 'c1', type: 'clownfish', icon: '🐠', nameUz: "Baliqcha", nameEn: "Clownfish", xPercent: 83, yPercent: 48 },
    { id: 'c2', type: 'clownfish', icon: '🐠', nameUz: "Baliqcha", nameEn: "Clownfish", xPercent: 77, yPercent: 54 },
    { id: 'c3', type: 'clownfish', icon: '🐠', nameUz: "Baliqcha", nameEn: "Clownfish", xPercent: 69, yPercent: 59 },
    { id: 'c4', type: 'clownfish', icon: '🐠', nameUz: "Baliqcha", nameEn: "Clownfish", xPercent: 86, yPercent: 58 },
    { id: 'c5', type: 'clownfish', icon: '🐠', nameUz: "Baliqcha", nameEn: "Clownfish", xPercent: 68, yPercent: 68 },
  ];

  const [tappedCreatureIds, setTappedCreatureIds] = useState<string[]>([]);

  const handleTapCreatureInOcean = (creature: OceanCreatureHotspot) => {
    if (tappedCreatureIds.includes(creature.id)) {
      triggerVoice("Buni sanab bo'ldik! Boshqasini toping!", "Already counted! Find another one!");
      return;
    }

    playKidSound('water');
    const updated = [...tappedCreatureIds, creature.id];
    setTappedCreatureIds(updated);

    const typeCount = updated.filter(id => OCEAN_CREATURES.find(c => c.id === id)?.type === creature.type).length;
    const totalForType = creature.type === 'clownfish' ? 5 : 4;

    triggerVoice(
      `${typeCount}-chi ${creature.nameUz}! Qani, davom etamiz!`,
      `Found ${typeCount} ${creature.nameEn}!`
    );

    if (updated.length === OCEAN_CREATURES.length) {
      playKidSound('success');
      addNurCoins(35);
      confetti({ particleCount: 160, spread: 95 });
      triggerVoice("Aqlvoy! Dengizdagi barcha 17 ta jonivorni topib sanadingiz! 🎉", "Brilliant! You found all creatures! 🎉");
    }
  };

  return (
    <div className="w-full rounded-3xl bg-[#FFFDF5] dark:bg-[#002621] border-2 border-pine-800/40 dark:border-butter-200/40 shadow-2xl p-4 sm:p-8 overflow-hidden">
      
      {/* Header & Big Mode Switcher with Audio Toggle */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-pine-800/20 dark:border-butter-200/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/30 text-pine-900 dark:text-amber-200 text-xs font-black uppercase tracking-wider mb-2 border border-amber-400/50 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>{isUz ? "👶 Bog'cha yoshidagi bolalar uchun (Ovozli & Matnsiz)" : "👶 Kindergarten Toddler Mode (Voice Guided)"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-pine-900 dark:text-butter-100 font-display flex items-center gap-2">
            {activeGame === 'cleanliness' && (isUz ? "🧼 Poklik va Tartibxon" : "🧼 Cleanliness Master")}
            {activeGame === 'animalFood' && (isUz ? "🐾 Hayvonlar Nima Yeydi?" : "🐾 Animal Feeder")}
            {activeGame === 'animalHabitats' && (isUz ? "🌍 Jonivorlarning Vatanlari" : "🌍 Animal Habitats")}
            {activeGame === 'ispy' && (isUz ? "🔍 Dengizdagi Jonivorlarni Sanash" : "🔍 Ocean Counting")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            {isUz 
              ? "💡 O'qishni bilish shart emas — har bir rasm va tugma bola uchun ovozli gapiradi va nurlar bilan ko'rsatadi!" 
              : "💡 Fully voice-narrated and visual — no reading required for toddlers!"}
          </p>
        </div>

        {/* Big Kid-Friendly Navigation Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2.5 rounded-2xl border-2 transition-all flex items-center gap-1.5 text-xs font-black ${
              voiceEnabled ? 'bg-amber-400 border-amber-500 text-pine-950 shadow-sm' : 'bg-slate-200 dark:bg-pine-900 text-slate-600 border-slate-300'
            }`}
            title="Ovozli yo'riqnoma"
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-pine-950 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span>{voiceEnabled ? (isUz ? "Ovoz Yoqiq" : "Voice On") : (isUz ? "Ovozsiz" : "Mute")}</span>
          </button>

          {/* Game Selectors */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-pine-900 p-1.5 rounded-2xl border border-slate-300 dark:border-pine-700">
            <button
              onClick={() => setActiveGame('cleanliness')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeGame === 'cleanliness' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <span className="text-base">🧼</span>
              <span className="hidden sm:inline">{isUz ? "Poklik" : "Clean"}</span>
            </button>
            <button
              onClick={() => setActiveGame('animalFood')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeGame === 'animalFood' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <span className="text-base">🐾</span>
              <span className="hidden sm:inline">{isUz ? "Ozuqasi" : "Food"}</span>
            </button>
            <button
              onClick={() => setActiveGame('animalHabitats')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeGame === 'animalHabitats' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <span className="text-base">🌍</span>
              <span className="hidden sm:inline">{isUz ? "Vatani" : "Habitats"}</span>
            </button>
            <button
              onClick={() => setActiveGame('ispy')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeGame === 'ispy' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <span className="text-base">🔍</span>
              <span className="hidden sm:inline">{isUz ? "Sanash" : "Count"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. GAME: POKLIK VA TARTIBXON */}
      {/* ========================================================================= */}
      {activeGame === 'cleanliness' && (
        <div className="pt-6 space-y-6">
          {/* Big Visual Category Tabs with Audio */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setCleaningCategory('clothes'); setSelectedCardId(null); triggerVoice("Kiyim-kechaklarni tozalaymiz!", "Let's clean clothes!"); }}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
                  cleaningCategory === 'clothes' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white dark:bg-pine-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-pine-800'
                }`}
              >
                <span className="text-xl">🧺 👕</span>
                <span>{isUz ? "Kiyimlar" : "Clothes"}</span>
              </button>
              <button
                onClick={() => { setCleaningCategory('dishes'); setSelectedCardId(null); triggerVoice("Endi idishlarni yuvamiz!", "Now let's clean dishes!"); }}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
                  cleaningCategory === 'dishes' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white dark:bg-pine-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-pine-800'
                }`}
              >
                <span className="text-xl">🍽️ 🚰</span>
                <span>{isUz ? "Idishlar" : "Dishes"}</span>
              </button>
            </div>

            <button
              onClick={() => { setSortedClothes({}); setSortedDishes({}); setSelectedCardId(null); }}
              className="px-4 py-2 rounded-2xl bg-slate-200 dark:bg-pine-900 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-300"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isUz ? "Qaytadan" : "Reset"}</span>
            </button>
          </div>

          {/* MAIN ILLUSTRATED WORKSHEET WITH GLOWING TARGETS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Interactive Illustrated Canvas */}
            <div className="lg:col-span-8 flex flex-col items-center">
              <div className="relative w-full max-w-[650px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-pine-800/80 dark:border-butter-300/80 bg-white">
                
                <img
                  src={cleaningCategory === 'clothes' ? "/games/worksheets/clean_clothes.jpg" : "/games/worksheets/clean_dishes.jpg"}
                  alt="Worksheet Background"
                  className="w-full h-full object-cover select-none"
                />

                {/* Target 1: Red Box (Left / Dirty zone) */}
                <button
                  onClick={() => handleSortCard(cleaningCategory === 'clothes' ? 'machine' : 'sink')}
                  className={`absolute left-[5%] bottom-[5%] w-[42%] h-[28%] rounded-2xl border-4 border-dashed transition-all flex flex-col items-center justify-center p-2 backdrop-blur-xs ${
                    selectedCardId 
                      ? 'border-red-500 bg-red-500/30 ring-4 ring-red-400/60 animate-bounce cursor-pointer shadow-xl' 
                      : 'border-red-400/40 bg-red-500/5'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-black text-red-900 bg-white/95 px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 mb-1">
                    <span className="text-base">{cleaningCategory === 'clothes' ? '🧺 🫧' : '🚰 🧼'}</span>
                    <span>{cleaningCategory === 'clothes' ? (isUz ? "Kir Yuvish" : "Wash") : (isUz ? "Rakovina" : "Sink")}</span>
                  </span>
                  
                  {/* Render placed items inside the box */}
                  <div className="flex flex-wrap gap-1 justify-center overflow-hidden max-h-[60%]">
                    {cleaningCategory === 'clothes' 
                      ? Object.keys(sortedClothes).filter(k => sortedClothes[k] === 'machine').map(k => (
                        <span key={k} className="text-2xl sm:text-3xl animate-fade-in drop-shadow-md">
                          {CLOTHES_CARDS.find(c => c.id === k)?.icon.split('')[0]}
                        </span>
                      ))
                      : Object.keys(sortedDishes).filter(k => sortedDishes[k] === 'sink').map(k => (
                        <span key={k} className="text-2xl sm:text-3xl animate-fade-in drop-shadow-md">
                          {DISHES_CARDS.find(c => c.id === k)?.icon.split('')[0]}
                        </span>
                      ))}
                  </div>
                </button>

                {/* Target 2: Green Box (Right / Clean zone) */}
                <button
                  onClick={() => handleSortCard(cleaningCategory === 'clothes' ? 'closet' : 'shelf')}
                  className={`absolute right-[5%] bottom-[5%] w-[42%] h-[28%] rounded-2xl border-4 border-dashed transition-all flex flex-col items-center justify-center p-2 backdrop-blur-xs ${
                    selectedCardId 
                      ? 'border-emerald-500 bg-emerald-500/30 ring-4 ring-emerald-400/60 animate-bounce cursor-pointer shadow-xl' 
                      : 'border-emerald-400/40 bg-emerald-500/5'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-black text-emerald-900 bg-white/95 px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 mb-1">
                    <span className="text-base">{cleaningCategory === 'clothes' ? '🚪 ✨' : '🍽️ ✨'}</span>
                    <span>{cleaningCategory === 'clothes' ? (isUz ? "Shkafga" : "Wardrobe") : (isUz ? "Javonga" : "Cupboard")}</span>
                  </span>

                  {/* Render placed items inside the box */}
                  <div className="flex flex-wrap gap-1 justify-center overflow-hidden max-h-[60%]">
                    {cleaningCategory === 'clothes'
                      ? Object.keys(sortedClothes).filter(k => sortedClothes[k] === 'closet').map(k => (
                        <span key={k} className="text-2xl sm:text-3xl animate-fade-in drop-shadow-md">
                          {CLOTHES_CARDS.find(c => c.id === k)?.icon.split('')[0]}
                        </span>
                      ))
                      : Object.keys(sortedDishes).filter(k => sortedDishes[k] === 'shelf').map(k => (
                        <span key={k} className="text-2xl sm:text-3xl animate-fade-in drop-shadow-md">
                          {DISHES_CARDS.find(c => c.id === k)?.icon.split('')[0]}
                        </span>
                      ))}
                  </div>
                </button>

              </div>
            </div>

            {/* Right: Big Touch Cards Tray (No Reading Needed!) */}
            <div className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-pine-900 border-2 border-slate-200 dark:border-pine-800 shadow-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-pine-700">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-butter-200 flex items-center gap-1.5">
                  <Hand className="w-4 h-4 text-amber-500 animate-bounce" />
                  <span>{isUz ? "Barmog'ingiz bilan bosing:" : "Tap to pick:"}</span>
                </span>
                <span className="text-xs font-black text-emerald-600">
                  {cleaningCategory === 'clothes' 
                    ? `${Object.keys(sortedClothes).length} / ${CLOTHES_CARDS.length}`
                    : `${Object.keys(sortedDishes).length} / ${DISHES_CARDS.length}`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(cleaningCategory === 'clothes' ? CLOTHES_CARDS : DISHES_CARDS).map(card => {
                  const isSorted = cleaningCategory === 'clothes' ? !!sortedClothes[card.id] : !!sortedDishes[card.id];
                  const isSelected = selectedCardId === card.id;

                  if (isSorted) return null;

                  return (
                    <motion.button
                      key={card.id}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleSelectCard(card)}
                      className={`p-4 rounded-3xl border-3 border-dashed transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-200 dark:bg-pine-800 ring-4 ring-amber-400 shadow-xl scale-110' 
                          : `${card.color} dark:bg-pine-950 shadow-sm hover:shadow-md`
                      }`}
                    >
                      <span className="text-4xl sm:text-5xl">{card.icon}</span>
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md animate-pulse">
                          <Volume2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. GAME: HAYVONLAR NIMA YEYDI? */}
      {/* ========================================================================= */}
      {activeGame === 'animalFood' && (
        <div className="pt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Illustrated Animals Canvas */}
            <div className="lg:col-span-8 flex flex-col items-center">
              <div className="relative w-full max-w-[650px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-500/80 dark:border-butter-300/80 bg-white">
                <img
                  src="/games/worksheets/animal_food.jpg"
                  alt="Animal Food Worksheet"
                  className="w-full h-full object-cover select-none"
                />

                {/* 6 Interactive Animal Slots */}
                {ANIMAL_SLOTS.map(slot => {
                  const isFed = !!animalFedMap[slot.id];
                  const isSelectedForDrop = selectedFoodId === slot.correctFoodId;

                  return (
                    <button
                      key={slot.id}
                      onClick={() => handlePlaceFoodOnAnimal(slot)}
                      style={{
                        left: `${slot.xPercent}%`,
                        top: `${slot.yPercent}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className={`absolute w-[20%] h-[22%] rounded-3xl border-4 border-dashed transition-all flex flex-col items-center justify-center p-1 backdrop-blur-xs ${
                        isFed 
                          ? 'border-emerald-500 bg-emerald-500/40 shadow-inner' 
                          : isSelectedForDrop 
                            ? 'border-amber-500 bg-amber-400/40 ring-4 ring-amber-400 animate-bounce cursor-pointer' 
                            : 'border-blue-400/60 bg-blue-500/10 hover:border-amber-400 hover:scale-105'
                      }`}
                    >
                      {isFed ? (
                        <div className="text-center animate-fade-in">
                          <span className="text-4xl block drop-shadow-md">
                            {FOOD_CUTOUTS.find(f => f.id === animalFedMap[slot.id])?.icon}
                          </span>
                          <span className="text-[11px] font-black text-emerald-950 bg-white/95 px-2 py-0.5 rounded-full shadow-xs">
                            😋 {isUz ? "To'ydi!" : "Yum!"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-3xl opacity-80 animate-pulse">
                          {slot.icon}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Big Food Basket (Touch & Hear) */}
            <div className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-pine-900 border-2 border-slate-200 dark:border-pine-800 shadow-md space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-butter-200 block pb-2 border-b border-slate-200 dark:border-pine-700">
                🧺 {isUz ? "Ozuqani tanlang:" : "Pick food:"}
              </span>

              <div className="grid grid-cols-2 gap-3">
                {FOOD_CUTOUTS.map(food => {
                  const isUsed = Object.values(animalFedMap).includes(food.id);
                  const isSelected = selectedFoodId === food.id;

                  if (isUsed) return null;

                  return (
                    <motion.button
                      key={food.id}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleSelectFood(food)}
                      className={`p-4 rounded-3xl border-3 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-100 dark:bg-pine-800 ring-4 ring-amber-400 shadow-xl scale-110' 
                          : 'border-slate-300 dark:border-pine-700 bg-slate-50 dark:bg-pine-950 hover:bg-amber-50'
                      }`}
                    >
                      <span className="text-5xl">{food.icon}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. GAME: YASHASH MUHITI */}
      {/* ========================================================================= */}
      {activeGame === 'animalHabitats' && (
        <div className="pt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Interactive Habitat Worksheet */}
            <div className="lg:col-span-8 flex flex-col items-center">
              <div className="relative w-full max-w-[650px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-600/80 dark:border-butter-300/80 bg-white">
                <img
                  src="/games/worksheets/animal_habitats.jpg"
                  alt="Animal Habitats Worksheet"
                  className="w-full h-full object-cover select-none"
                />

                {/* Left Animal Clickable Dots */}
                {HABITAT_PAIRS.map((pair, idx) => {
                  const isSelected = selectedAnimalForHabitat?.id === pair.id;
                  const isMatched = matchedHabitats[pair.id] !== undefined;

                  return (
                    <button
                      key={pair.id}
                      onClick={() => handleSelectAnimalHabitat(pair)}
                      style={{
                        left: '18%',
                        top: `${21 + idx * 16.5}%`,
                      }}
                      className={`absolute w-10 h-10 rounded-full border-4 transition-all -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer ${
                        isMatched 
                          ? 'border-emerald-500 bg-emerald-500 shadow-md text-white text-sm' 
                          : isSelected 
                            ? 'border-amber-400 bg-amber-400 ring-6 ring-amber-300 animate-pulse scale-130' 
                            : 'border-slate-800 bg-black/80 hover:scale-115'
                      }`}
                    >
                      {isMatched ? '✓' : ''}
                    </button>
                  );
                })}

                {/* Right Habitat Clickable Dots */}
                {[0, 1, 2, 3, 4].map((hIdx) => {
                  const isMatchedByAny = Object.values(matchedHabitats).includes(hIdx);

                  return (
                    <button
                      key={hIdx}
                      onClick={() => handleMatchHabitat(hIdx)}
                      style={{
                        left: '32%',
                        top: `${21 + hIdx * 16.5}%`,
                      }}
                      className={`absolute w-10 h-10 rounded-full border-4 transition-all -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer ${
                        isMatchedByAny 
                          ? 'border-emerald-500 bg-emerald-500 text-white text-sm shadow-md' 
                          : selectedAnimalForHabitat 
                            ? 'border-amber-500 bg-amber-400 ring-6 ring-amber-300 animate-bounce scale-120' 
                            : 'border-slate-800 bg-black/80'
                      }`}
                    >
                      {isMatchedByAny ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Quick Touch Animals List */}
            <div className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-pine-900 border-2 border-slate-200 dark:border-pine-800 shadow-md space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-butter-200 block pb-2 border-b border-slate-200 dark:border-pine-700">
                🐾 {isUz ? "Jonivorni tanlang:" : "Pick animal:"}
              </span>

              <div className="space-y-2">
                {HABITAT_PAIRS.map(pair => {
                  const isDone = matchedHabitats[pair.id] !== undefined;
                  const isSelected = selectedAnimalForHabitat?.id === pair.id;

                  return (
                    <button
                      key={pair.id}
                      onClick={() => handleSelectAnimalHabitat(pair)}
                      className={`w-full p-3 rounded-2xl border-2 flex items-center justify-between transition-all ${
                        isDone 
                          ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-400 opacity-80' 
                          : isSelected 
                            ? 'bg-amber-100 dark:bg-pine-800 border-amber-500 ring-2 ring-amber-400 scale-102' 
                            : 'bg-slate-50 dark:bg-pine-950 border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <span className="text-3xl">{pair.icon}</span>
                      <span className="text-2xl">{pair.habitatIcon}</span>
                      {isDone ? <span className="text-emerald-600 font-black text-base">✓</span> : <span className="text-slate-400">👉</span>}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GAME: I SPY — DENGIZ TUBI (DIRECT TOUCH ON OCEAN PICTURE) */}
      {/* ========================================================================= */}
      {activeGame === 'ispy' && (
        <div className="pt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Touch-to-Count Ocean Picture Stage */}
            <div className="lg:col-span-8 flex flex-col items-center">
              <div className="relative w-full max-w-[650px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-sky-400 dark:border-blue-900 bg-white select-none">
                
                <img
                  src="/games/worksheets/ispy_underwater.jpg"
                  alt="I SPY Underwater Counting Worksheet"
                  className="w-full h-full object-cover"
                />

                {/* Direct Touch Hotspots on each creature! */}
                {OCEAN_CREATURES.map(creature => {
                  const isTapped = tappedCreatureIds.includes(creature.id);

                  return (
                    <button
                      key={creature.id}
                      onClick={() => handleTapCreatureInOcean(creature)}
                      style={{
                        left: `${creature.xPercent}%`,
                        top: `${creature.yPercent}%`,
                      }}
                      className={`absolute w-12 h-12 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all flex items-center justify-center cursor-pointer ${
                        isTapped 
                          ? 'bg-yellow-300/60 ring-4 ring-yellow-400 border-2 border-white scale-120 shadow-lg' 
                          : 'bg-white/10 hover:bg-white/30 border border-white/40 animate-pulse'
                      }`}
                    >
                      {isTapped && <span className="text-base font-black text-pine-950">✓</span>}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-bold text-center">
                {isUz 
                  ? "💡 Rasmdagi toshbaqa, delfin yoki baliqchalarni to'g'ridan-to'g'ri barmog'ingiz bilan bosing!" 
                  : "💡 Tap directly on any sea creature in the picture to count it!"}
              </p>
            </div>

            {/* Right: Visual Count Meters */}
            <div className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-pine-900 border-2 border-slate-200 dark:border-pine-800 shadow-md space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-butter-200 block pb-2 border-b border-slate-200 dark:border-pine-700">
                🌊 {isUz ? "Topilgan Jonivorlar:" : "Found Creatures:"}
              </span>

              {[
                { type: 'turtle', icon: '🐢', max: 4, nameUz: "Toshbaqa" },
                { type: 'octopus', icon: '🐙', max: 4, nameUz: "Sakkizoyoq" },
                { type: 'dolphin', icon: '🐬', max: 4, nameUz: "Delfin" },
                { type: 'clownfish', icon: '🐠', max: 5, nameUz: "Baliqcha" },
              ].map(item => {
                const found = tappedCreatureIds.filter(id => OCEAN_CREATURES.find(c => c.id === id)?.type === item.type).length;
                const isFull = found === item.max;

                return (
                  <div
                    key={item.type}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                      isFull ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-400' : 'bg-slate-50 dark:bg-pine-950 border-slate-200'
                    }`}
                  >
                    <span className="text-4xl">{item.icon}</span>
                    <span className={`text-xl font-black ${isFull ? 'text-emerald-600' : 'text-slate-700 dark:text-butter-200'}`}>
                      {found} / {item.max}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
