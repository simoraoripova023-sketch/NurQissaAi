export type Locale = 'uz' | 'en';

export type Gender = 'boy' | 'girl';

export type MoralVirtue = 
  | 'patience'      // Sabr
  | 'gratitude'     // Shukur / Shukronalik
  | 'kindness'      // Mehribonlik / Rahmdillik
  | 'honesty'       // Rostgo'ylik / Halollik
  | 'respect_parents' // Ota-onaga hurmat
  | 'generosity'    // Saxovat / Bo'lishish
  | 'courage'       // Jasorat / Botirlik
  | 'cleanliness';  // Poklik va ozodalik

export type StorySetting = 
  | 'cozy_home'          // Fayzli xonadon va oila davrasi
  | 'ancient_city'       // Qadimiy Sharq va muqaddas shaharlar
  | 'blessed_garden'     // Gullagan ibratli bog' va tabiat
  | 'starry_reflection'  // Tafakkurli oydin kecha va yulduzlar
  | 'wisdom_library'     // Hikmatlar o'lkasi va kutubxona
  | 'peaceful_river';    // Sokin daryo va ummon kengliklari

export type IllustrationStyle = 
  | 'pixar_3d'          // 3D Pixar & Disney Animation
  | 'watercolor'        // Nafis Akvarel (Fairytale Watercolor)
  | 'classic_storybook' // Klassik Kitobiy San'at (Classic Storybook)
  | 'disney_2d'         // Disney 2D Sehrli Multfilm (Disney 2D Classic)
  | 'ghibli_anime';     // Ghibli Osoyishta Uslubi (Dreamy Anime Art)

export type ReadingTimeContext = 
  | 'daytime'  // Kunduzgi sarguzasht & Ilhom
  | 'bedtime'  // Oqshomgi orom & Shirin uyqu
  | 'travel'   // Sayohat & Yo'ldagi sarguzasht
  | 'family';  // Oila davrasidagi shirin suhbat

export interface ChildProfile {
  child_name: string;
  age: number;
  gender: Gender;
  daily_activity: string;
  emotional_state: string;
  reading_time_context?: ReadingTimeContext;
  parent_goal: MoralVirtue;
  favorite_animal: string;
  favorite_color: string;
  story_setting: StorySetting;
  illustration_style?: IllustrationStyle;
  child_photo_url?: string;
  character_appearance_description?: string;
  page_count?: number;
}

export interface HiddenObject {
  id: string;
  name_uz: string;
  name_en: string;
  icon: string;
  topPercent: number;  // e.g. 35 (%)
  leftPercent: number; // e.g. 70 (%)
  hint_uz: string;
  hint_en: string;
}

export interface StoryPage {
  page_number: number;
  text_uz: string;
  text_en: string;
  image_prompt: string;
  image_url: string;
  audio_url?: string;
  scene_summary?: string;
  hidden_object?: HiddenObject;
}

export interface QuizOption {
  id: string;
  text_uz: string;
  text_en: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question_uz: string;
  question_en: string;
  options: QuizOption[];
  explanation_uz: string;
  explanation_en: string;
}

export interface StoryReflection {
  todays_lesson_uz: string;
  todays_lesson_en: string;
  little_dua_uz: string;
  little_dua_en: string;
  arabic_dua?: string;
  discussion_questions_uz: string[];
  discussion_questions_en: string[];
  good_deed_task_uz: string;
  good_deed_task_en: string;
}

export interface StoryBook {
  id: string;
  created_at: string;
  child_profile: ChildProfile;
  title_uz: string;
  title_en: string;
  prologue_uz: string;
  prologue_en: string;
  cover_image_url: string;
  theme_color: string;
  pages: StoryPage[]; // exactly 8 pages
  reflection: StoryReflection;
  quiz?: QuizQuestion[];
  is_favorite?: boolean;
}

export type MissionCategory = 'sunnah' | 'good_deed' | 'habit' | 'story_task';

export interface DailyMission {
  id: string;
  title_uz: string;
  title_en: string;
  description_uz: string;
  description_en: string;
  icon: string;
  xp_reward: number;
  coin_reward: number;
  category: MissionCategory;
  isCompleted: boolean;
  isParentApproved: boolean;
  completedAt?: string;
}

export interface AchievementBadge {
  id: string;
  title_uz: string;
  title_en: string;
  description_uz: string;
  description_en: string;
  icon: string;
  category: 'virtue' | 'reader' | 'habit' | 'explorer';
  isUnlocked: boolean;
  unlockedAt?: string;
  requiredCount: number;
  currentCount: number;
}

export interface FamilyDiscussionNote {
  storyId: string;
  questionIndex: number;
  textNote?: string;
  audioBlobUrl?: string;
  createdAt: string;
}
