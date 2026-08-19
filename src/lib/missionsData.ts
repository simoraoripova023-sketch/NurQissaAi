import { DailyMission, AchievementBadge, QuizQuestion } from './types';

export const INITIAL_DAILY_MISSIONS: DailyMission[] = [
  {
    id: 'mission-bismillah',
    title_uz: "Ovqatdan oldin 'Bismillah' aytish",
    title_en: "Say 'Bismillah' before meals",
    description_uz: "Taom yeyishdan oldin va har bir xayrli ish boshida 'Bismillah' deb boshlash",
    description_en: "Begin your meal and every good action with 'Bismillah'",
    icon: "🍽️",
    xp_reward: 25,
    coin_reward: 15,
    category: 'sunnah',
    isCompleted: true,
    isParentApproved: true,
    completedAt: new Date().toISOString(),
  },
  {
    id: 'mission-salam',
    title_uz: "Kattalarga birinchi bo'lib salom berish",
    title_en: "Greet elders first with Salam",
    description_uz: "Ota-ona, buvi-bobolar yoki ustozlarga tabassum bilan 'Assalomu alaykum' deyish",
    description_en: "Greet parents, grandparents, and elders with a warm smile and 'Assalamu Alaykum'",
    icon: "🤝",
    xp_reward: 30,
    coin_reward: 20,
    category: 'good_deed',
    isCompleted: true,
    isParentApproved: false,
  },
  {
    id: 'mission-cleanup',
    title_uz: "O'yinchoqlarni mustaqil yig'ishtirish",
    title_en: "Clean up toys independently",
    description_uz: "O'ynab bo'lgach, xonani ozoda saqlash va o'yinchoqlarni o'z joyiga qo'yish",
    description_en: "Keep your cozy bedroom tidy by putting away all toys after playtime",
    icon: "🧸",
    xp_reward: 35,
    coin_reward: 25,
    category: 'habit',
    isCompleted: false,
    isParentApproved: false,
  },
  {
    id: 'mission-bedtime-dua',
    title_uz: "Yotishdan oldin 'Alhamdulillah' va duo aytish",
    title_en: "Say bedtime Dua & gratitude",
    description_uz: "Bugungi kun uchun shukr qilib, kechki kichik duoni o'qish",
    description_en: "Recite tonight's gentle bedtime prayer and say 'Alhamdulillah'",
    icon: "🤲",
    xp_reward: 25,
    coin_reward: 15,
    category: 'sunnah',
    isCompleted: false,
    isParentApproved: false,
  },
  {
    id: 'mission-share-joy',
    title_uz: "Do'stlar yoki ukalarga o'yinchoq ulashish",
    title_en: "Share toys with friends & siblings",
    description_uz: "Sevimli o'yinchoq yoki shirinlikni quvonch bilan boshqalar bilan baham ko'rish",
    description_en: "Cheerfully share a favorite toy or treat with a sibling or friend",
    icon: "🎁",
    xp_reward: 40,
    coin_reward: 30,
    category: 'good_deed',
    isCompleted: false,
    isParentApproved: false,
  },
  {
    id: 'mission-read-story',
    title_uz: "Bugungi ertakni to'liq o'qish & viktorina",
    title_en: "Read today's story & solve quiz",
    description_uz: "NurQissa AI ertagini o'qib, oxiridagi 3 ta savolga javob berish",
    description_en: "Read a bedtime adventure and answer the comprehension quiz",
    icon: "📖",
    xp_reward: 50,
    coin_reward: 35,
    category: 'story_task',
    isCompleted: true,
    isParentApproved: true,
    completedAt: new Date().toISOString(),
  },
];

export const INITIAL_ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'badge-kind-heart',
    title_uz: "Mehribon Farzand",
    title_en: "Kind & Loving Heart",
    description_uz: "Ota-onaga mehr ko'rsatish va yordam berish vazifalarini bajargani uchun",
    description_en: "Awarded for honoring parents and showing gentle compassion",
    icon: "💖",
    category: 'virtue',
    isUnlocked: true,
    unlockedAt: "2026-08-14",
    requiredCount: 3,
    currentCount: 3,
  },
  {
    id: 'badge-generous-hero',
    title_uz: "Saxovatli Qahramon",
    title_en: "Generous Hero",
    description_uz: "O'yinchoq va shirinliklarini do'stlari bilan baham ko'rgani uchun",
    description_en: "Awarded for joyfully sharing blessings with others",
    icon: "🌟",
    category: 'virtue',
    isUnlocked: false,
    requiredCount: 3,
    currentCount: 1,
  },
  {
    id: 'badge-super-reader',
    title_uz: "Tirishqoq Kitobxon",
    title_en: "Bookworm Champion",
    description_uz: "3 ta ibratli ertakni to'liq o'qib, viktorinalarini yechgani uchun",
    description_en: "Awarded for completing 3 bedtime storybooks and quizzes",
    icon: "📚",
    category: 'reader',
    isUnlocked: true,
    unlockedAt: "2026-08-14",
    requiredCount: 3,
    currentCount: 3,
  },
  {
    id: 'badge-patient-knight',
    title_uz: "Sabrli Botir",
    title_en: "Knight of Patience",
    description_uz: "Sabr-toqat va shoshmaslik vazifalarini muvaffaqiyatli bajargani uchun",
    description_en: "Awarded for mastering gentle patience and perseverance",
    icon: "⏳",
    category: 'habit',
    isUnlocked: false,
    requiredCount: 5,
    currentCount: 2,
  },
  {
    id: 'badge-gratitude-star',
    title_uz: "Shukronalik Nuri",
    title_en: "Star of Gratitude",
    description_uz: "Har kuni 'Alhamdulillah' deb ne'matlarning qadriga yetgani uchun",
    description_en: "Awarded for daily heartfelt thankfulness and prayer",
    icon: "🤲",
    category: 'habit',
    isUnlocked: true,
    unlockedAt: "2026-08-14",
    requiredCount: 7,
    currentCount: 7,
  },
  {
    id: 'badge-secret-seeker',
    title_uz: "Sehrli Izquvar",
    title_en: "Magic Seeker",
    description_uz: "Ertak rasmlari ichidagi yashiringan sehrli narsalarni topgani uchun",
    description_en: "Awarded for discovering hidden magic objects in story illustrations",
    icon: "🔍",
    category: 'explorer',
    isUnlocked: false,
    requiredCount: 4,
    currentCount: 2,
  },
];

// Sample Quiz for Stories
export const SAMPLE_QUIZZES: Record<string, QuizQuestion[]> = {
  "aqilli-bola-yusuf": [
    {
      id: "q1",
      question_uz: "Farishtalar nimadan yaratilgan?",
      question_en: "What are angels created from?",
      options: [
        { id: "o1", text_uz: "Nurdan (Yorug'likdan)", text_en: "From Light (Noor)", isCorrect: true },
        { id: "o2", text_uz: "Olovdan", text_en: "From Fire", isCorrect: false },
        { id: "o3", text_uz: "Loydan", text_en: "From Clay", isCorrect: false },
        { id: "o4", text_uz: "Suvdan", text_en: "From Water", isCorrect: false }
      ],
      explanation_uz: "Farishtalar Alloh taolo tomonidan nurdan yaratilgan va ular hech qachon gunoh qilmaydilar.",
      explanation_en: "Angels are created by Allah from pure light and they never commit any sins."
    },
    {
      id: "q2",
      question_uz: "Payg'ambarlarga vahiy (Qur'oni Karim) olib kelgan bosh farishta kim?",
      question_en: "Which archangel brought divine revelation to the prophets?",
      options: [
        { id: "o1", text_uz: "Mikoil (alayhissalom)", text_en: "Mikail (a.s.)", isCorrect: false },
        { id: "o2", text_uz: "Jabroil (alayhissalom)", text_en: "Jibril (a.s.)", isCorrect: true },
        { id: "o3", text_uz: "Isrofil (alayhissalom)", text_en: "Israfil (a.s.)", isCorrect: false },
        { id: "o4", text_uz: "Ridvan (alayhissalom)", text_en: "Ridwan (a.s.)", isCorrect: false }
      ],
      explanation_uz: "Jabroil (alayhissalom) — vahiy farishtasi bo'lib, barcha payg'ambarlarga ilohiy xabarlarni yetkazgan.",
      explanation_en: "Archangel Jibril (a.s.) is the angel of revelation who conveyed divine scriptures to prophets."
    },
    {
      id: "q3",
      question_uz: "O'ng va chap yelkamizdagi yaxshi va yomon amallarni yozuvchi farishtalar qanday ataladi?",
      question_en: "What are the recording angels on our right and left shoulders called?",
      options: [
        { id: "o1", text_uz: "Kiroman va Katibin", text_en: "Kiraman and Katibin", isCorrect: true },
        { id: "o2", text_uz: "Munkar va Nakir", text_en: "Munkar and Nakir", isCorrect: false },
        { id: "o3", text_uz: "Hamalatul Arsh", text_en: "Hamalatul Arsh", isCorrect: false },
        { id: "o4", text_uz: "Zaboniya", text_en: "Zabaniyah", isCorrect: false }
      ],
      explanation_uz: "Kiroman va Katibin — hurmatli kotiblar bo'lib, insonlarning yaxshi va yomon ishlarini yozib boradilar.",
      explanation_en: "Kiraman and Katibin are the noble scribes who faithfully record human deeds."
    }
  ],
  "fotima-va-sirli-hadya": [
    {
      id: "q1",
      question_uz: "Buvijonisi Fotimaxonga qanday qimmatli hadya olib keldi?",
      question_en: "What precious gift did grandmother bring for Fatima?",
      options: [
        { id: "o1", text_uz: "Harflar O'lkasidan zarhal Qur'oni Karim harflari kitobini", text_en: "Gilded book of Holy Quran letters from the Land of Letters", isCorrect: true },
        { id: "o2", text_uz: "Oddiy o'yinchoq mashina", text_en: "A simple toy car", isCorrect: false },
        { id: "o3", text_uz: "Kichik qora tosh", text_en: "A small dark stone", isCorrect: false }
      ],
      explanation_uz: "Buvijonisi Fotimaga qalbni nurlantiruvchi eng go'zal so'zlar — Qur'on harflari kitobini hadya qildi.",
      explanation_en: "Grandmother gifted Fatima the noble Quran letters book to illuminate her heart."
    },
    {
      id: "q2",
      question_uz: "Fotimaxon «Alif» va «Ba» harflarini qanday tasavvur qildi?",
      question_en: "How did Fatima imagine the letters 'Alif' and 'Ba'?",
      options: [
        { id: "o1", text_uz: "«Alif» to'g'riso'z bahodirdek, «Ba» jilmaygan jajji do'stdek", text_en: "'Alif' like a noble hero, 'Ba' like a smiling companion", isCorrect: true },
        { id: "o2", text_uz: "Qo'rqinchli devdek", text_en: "Like a scary giant", isCorrect: false },
        { id: "o3", text_uz: "Shunchaki oddiy chiziqdek", text_en: "Just an ordinary line", isCorrect: false }
      ],
      explanation_uz: "Fotimaxon harflarni mehr bilan chizib, ularni xuddi shirin do'stlardek zavq bilan o'rgandi.",
      explanation_en: "Fatima joyfully drew the letters, treating each as a wonderful, cheerful friend."
    },
    {
      id: "q3",
      question_uz: "Biz Qur'oni Karim tilovat qilganimizda nima bo'ladi?",
      question_en: "What happens when we recite the Holy Quran?",
      options: [
        { id: "o1", text_uz: "Mehribon Alloh bilan dildan so'zlashamiz va qalbimiz nurga to'ladi", text_en: "We speak with Loving Allah and our hearts are filled with light", isCorrect: true },
        { id: "o2", text_uz: "Faqat charchab qolamiz", text_en: "We just get tired", isCorrect: false },
        { id: "o3", text_uz: "Hech qanday o'zgarish bo'lmaydi", text_en: "Nothing changes", isCorrect: false }
      ],
      explanation_uz: "Qur'on o'qiganimizda Alloh taolo bilan dildan bog'lanamiz va cheksiz savobga erishamiz.",
      explanation_en: "Reciting the Quran connects us deeply with Allah and blesses us with eternal reward."
    }
  ],
  "zubayr-va-odam-ato-qissasi": [
    {
      id: "q1",
      question_uz: "Dunyodagi eng birinchi inson kim bo'lgan?",
      question_en: "Who was the very first human in the world?",
      options: [
        { id: "o1", text_uz: "Odam Ato (Odam alayhissalom)", text_en: "Prophet Adam (a.s.)", isCorrect: true },
        { id: "o2", text_uz: "Quvnoq qushcha", text_en: "A cheerful bird", isCorrect: false },
        { id: "o3", text_uz: "Mitti mushukcha", text_en: "A little kitten", isCorrect: false }
      ],
      explanation_uz: "Alloh taolo yer yuzidagi eng birinchi inson qilib Odam Atoni yaratgan.",
      explanation_en: "Allah created Prophet Adam as the very first human being."
    },
    {
      id: "q2",
      question_uz: "Mehribon Alloh biror narsani yaratmoqchi bo'lsa, nima deydi?",
      question_en: "What does loving Allah say when He creates something?",
      options: [
        { id: "o1", text_uz: "«BO'L!» («Kun!»)", text_en: "'BE!' ('Kun!')", isCorrect: true },
        { id: "o2", text_uz: "«UXLA!»", text_en: "'SLEEP!'", isCorrect: false },
        { id: "o3", text_uz: "«YUGUR!»", text_en: "'RUN!'", isCorrect: false }
      ],
      explanation_uz: "Alloh faqatgina «BO'L!» deydi va hamma narsa shu zahoti paydo bo'ladi.",
      explanation_en: "Allah simply says 'BE!' and everything appears instantly."
    },
    {
      id: "q3",
      question_uz: "Agar bilmasdan xato qilib qo'ysak, nima deyishimiz kerak?",
      question_en: "What should we say if we make a mistake?",
      options: [
        { id: "o1", text_uz: "Darhol «Kechirasiz» deb uzr so'raymiz", text_en: "Quickly say 'I am sorry'", isCorrect: true },
        { id: "o2", text_uz: "Yig'lab qochib ketamiz", text_en: "Cry and run away", isCorrect: false },
        { id: "o3", text_uz: "Hech narsa demaymiz", text_en: "Say nothing", isCorrect: false }
      ],
      explanation_uz: "Odam Ato kabi, biz ham xato qilsak darhol «Kechirasiz» deb uzr so'rashimiz va tavba qilishimiz kerak.",
      explanation_en: "Like Prophet Adam, whenever we make a mistake, we should sincerely apologize."
    }
  ]
};
