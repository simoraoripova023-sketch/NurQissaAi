import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  ChildProfile, StoryBook, Locale, DailyMission, 
  AchievementBadge, FamilyDiscussionNote, QuizQuestion 
} from './types';
import { SAMPLE_STORIES } from './sampleStories';
import { INITIAL_DAILY_MISSIONS, INITIAL_ACHIEVEMENT_BADGES } from './missionsData';

interface AppState {
  locale: Locale;
  setLocale: (locale: Locale) => void;

  // Theme: night / day
  theme: 'night' | 'day';
  toggleTheme: () => void;
  setTheme: (theme: 'night' | 'day') => void;
  
  // Gamification & Rewards
  nurCoins: number;
  userXP: number;
  userLevel: number;
  dailyStreak: number;
  setDailyStreak: (streak: number) => void;
  resetStreakAndTree: () => void;
  addNurCoins: (amount: number) => void;
  addXP: (amount: number) => void;
  
  // Missions & Habit Tracker
  dailyMissions: DailyMission[];
  toggleMissionComplete: (missionId: string) => void;
  approveMissionByParent: (missionId: string) => void;
  
  // Badges & Achievements
  badges: AchievementBadge[];
  unlockBadge: (badgeId: string) => void;

  // Hidden Objects found
  foundHiddenObjects: string[];
  markHiddenObjectFound: (objectId: string) => void;

  // Family Voice / Text Notes for Bedtime Discussion
  familyNotes: FamilyDiscussionNote[];
  saveFamilyNote: (note: FamilyDiscussionNote) => void;

  // Wizard State
  wizardStep: number;
  setWizardStep: (step: number) => void;
  childProfile: ChildProfile;
  updateChildProfile: (profile: Partial<ChildProfile>) => void;
  resetChildProfile: () => void;
  
  // Stories Library
  stories: StoryBook[];
  activeStory: StoryBook | null;
  setActiveStory: (story: StoryBook | null) => void;
  addStoryToLibrary: (story: StoryBook) => void;
  removeStoryFromLibrary: (id: string) => void;
  toggleFavorite: (id: string) => void;
  
  // Audio Narrator State
  isPlayingAudio: boolean;
  setIsPlayingAudio: (isPlaying: boolean) => void;
  audioCurrentPage: number;
  setAudioCurrentPage: (page: number) => void;
  
  // Modals
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (open: boolean) => void;
  isReflectionOpen: boolean;
  setIsReflectionOpen: (open: boolean) => void;
  
  // Parent Approval Modal
  isParentApprovalOpen: boolean;
  setIsParentApprovalOpen: (open: boolean) => void;
  activeMissionToApprove: DailyMission | null;
  setActiveMissionToApprove: (mission: DailyMission | null) => void;

  // Story Quiz Modal
  isQuizOpen: boolean;
  setIsQuizOpen: (open: boolean) => void;
  activeQuizStory: StoryBook | null;
  setActiveQuizStory: (story: StoryBook | null) => void;

  // Voice Note Recorder Modal
  isVoiceNoteOpen: boolean;
  setIsVoiceNoteOpen: (open: boolean) => void;
  activeQuestionIndex: number;
  setActiveQuestionIndex: (index: number) => void;

  // Auth / Registration Modal
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  currentUser: { name: string; phone: string; childName: string; isLoggedIn: boolean } | null;
  loginUser: (data: { name: string; phone: string; childName?: string }) => void;
  logoutUser: () => void;

  // Paid System & Story Credit Limits (Freemium: 2 Free Stories)
  freeStoriesLeft: number;
  hasPaidSubscription: boolean;
  isPricingModalOpen: boolean;
  setIsPricingModalOpen: (open: boolean) => void;
  useStoryCredit: () => boolean;
  addStoryCredits: (amount: number) => void;
  setHasPaidSubscription: (val: boolean) => void;
}

const initialChildProfile: ChildProfile = {
  child_name: '',
  age: 6,
  gender: 'boy',
  daily_activity: '',
  emotional_state: 'happy',
  reading_time_context: 'daytime',
  parent_goal: 'kindness',
  favorite_animal: 'Quyoncha 🐰',
  favorite_color: 'Zumrad yashil 🟢',
  story_setting: 'blessed_garden',
  illustration_style: 'pixar_3d',
  child_photo_url: '',
  character_appearance_description: '',
  page_count: 6,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      locale: 'uz',
      setLocale: (locale) => set({ locale }),

      // Theme
      theme: 'night',
      toggleTheme: () =>
        set((state) => {
          const nextTheme = state.theme === 'night' ? 'day' : 'night';
          if (typeof window !== 'undefined') {
            if (nextTheme === 'night') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
          return { theme: nextTheme };
        }),
      setTheme: (theme) =>
        set(() => {
          if (typeof window !== 'undefined') {
            if (theme === 'night') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
          return { theme };
        }),

      // Gamification & Rewards
      nurCoins: 180,
      userXP: 340,
      userLevel: 2,
      dailyStreak: 1,

      setDailyStreak: (streak) => set({ dailyStreak: streak }),
      resetStreakAndTree: () => set({ dailyStreak: 0, nurCoins: 0 }),
      addNurCoins: (amount) => set((state) => ({ nurCoins: Math.max(0, state.nurCoins + amount) })),
      addXP: (amount) =>
        set((state) => {
          const newXP = state.userXP + amount;
          const newLevel = Math.floor(newXP / 200) + 1;
          return { userXP: newXP, userLevel: newLevel };
        }),

      // Daily Missions
      dailyMissions: INITIAL_DAILY_MISSIONS,
      toggleMissionComplete: (missionId) =>
        set((state) => ({
          dailyMissions: state.dailyMissions.map((m) => {
            if (m.id === missionId) {
              const isDone = !m.isCompleted;
              return {
                ...m,
                isCompleted: isDone,
                completedAt: isDone ? new Date().toISOString() : undefined,
              };
            }
            return m;
          }),
        })),

      approveMissionByParent: (missionId) =>
        set((state) => {
          let awardedCoins = 0;
          let awardedXP = 0;

          const updated = state.dailyMissions.map((m) => {
            if (m.id === missionId) {
              awardedCoins = m.coin_reward;
              awardedXP = m.xp_reward;
              return { ...m, isCompleted: true, isParentApproved: true };
            }
            return m;
          });

          const newCoins = state.nurCoins + awardedCoins;
          const newXP = state.userXP + awardedXP;
          const newLevel = Math.floor(newXP / 200) + 1;

          return {
            dailyMissions: updated,
            nurCoins: newCoins,
            userXP: newXP,
            userLevel: newLevel,
            isParentApprovalOpen: false,
            activeMissionToApprove: null,
          };
        }),

      // Badges
      badges: INITIAL_ACHIEVEMENT_BADGES,
      unlockBadge: (badgeId) =>
        set((state) => ({
          badges: state.badges.map((b) =>
            b.id === badgeId ? { ...b, isUnlocked: true, unlockedAt: new Date().toISOString() } : b
          ),
        })),

      // Hidden Objects
      foundHiddenObjects: ['ali_p1_star'],
      markHiddenObjectFound: (objectId) =>
        set((state) => {
          if (state.foundHiddenObjects.includes(objectId)) return state;
          return {
            foundHiddenObjects: [...state.foundHiddenObjects, objectId],
            nurCoins: state.nurCoins + 25,
            userXP: state.userXP + 30,
          };
        }),

      // Family Notes
      familyNotes: [],
      saveFamilyNote: (note) =>
        set((state) => {
          const filtered = state.familyNotes.filter(
            (n) => !(n.storyId === note.storyId && n.questionIndex === note.questionIndex)
          );
          return { familyNotes: [note, ...filtered] };
        }),

      // Wizard State
      wizardStep: 1,
      setWizardStep: (wizardStep) => set({ wizardStep }),
      childProfile: initialChildProfile,
      updateChildProfile: (updates) =>
        set((state) => ({
          childProfile: { ...state.childProfile, ...updates },
        })),
      resetChildProfile: () => set({ childProfile: initialChildProfile, wizardStep: 1 }),

      // Stories
      stories: SAMPLE_STORIES,
      activeStory: SAMPLE_STORIES[0],
      setActiveStory: (activeStory) => set({ activeStory }),

      addStoryToLibrary: (story) =>
        set((state) => {
          const exists = state.stories.some((s) => s.id === story.id);
          const newStories = exists
            ? state.stories.map((s) => (s.id === story.id ? story : s))
            : [story, ...state.stories];
          return { stories: newStories, activeStory: story };
        }),

      removeStoryFromLibrary: (id) =>
        set((state) => ({
          stories: state.stories.filter((s) => s.id !== id),
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          stories: state.stories.map((s) =>
            s.id === id ? { ...s, is_favorite: !s.is_favorite } : s
          ),
        })),

      isPlayingAudio: false,
      setIsPlayingAudio: (isPlayingAudio) => set({ isPlayingAudio }),
      
      audioCurrentPage: 1,
      setAudioCurrentPage: (audioCurrentPage) => set({ audioCurrentPage }),

      isOrderModalOpen: false,
      setIsOrderModalOpen: (isOrderModalOpen) => set({ isOrderModalOpen }),

      isReflectionOpen: false,
      setIsReflectionOpen: (isReflectionOpen) => set({ isReflectionOpen }),

      isParentApprovalOpen: false,
      setIsParentApprovalOpen: (isParentApprovalOpen) => set({ isParentApprovalOpen }),
      activeMissionToApprove: null,
      setActiveMissionToApprove: (activeMissionToApprove) => set({ activeMissionToApprove }),

      isQuizOpen: false,
      setIsQuizOpen: (isQuizOpen) => set({ isQuizOpen }),
      activeQuizStory: null,
      setActiveQuizStory: (activeQuizStory) => set({ activeQuizStory }),

      isVoiceNoteOpen: false,
      setIsVoiceNoteOpen: (isVoiceNoteOpen) => set({ isVoiceNoteOpen }),
      activeQuestionIndex: 0,
      setActiveQuestionIndex: (activeQuestionIndex) => set({ activeQuestionIndex }),

      // Auth / Sign Up Modal
      isAuthModalOpen: false,
      setIsAuthModalOpen: (isAuthModalOpen) => set({ isAuthModalOpen }),
      currentUser: null,
      loginUser: (data) =>
        set((state) => ({
          currentUser: {
            name: data.name,
            phone: data.phone,
            childName: data.childName || 'Ali',
            isLoggedIn: true,
          },
          isAuthModalOpen: false,
          nurCoins: state.nurCoins + 50,
        })),
      logoutUser: () =>
        set(() => {
          if (typeof window !== 'undefined') {
            import('@/lib/supabase').then(({ supabase }) => {
              supabase.auth.signOut().catch(() => {});
            }).catch(() => {});
          }
          return { currentUser: null };
        }),

      // Paid System & Story Credit Limits
      freeStoriesLeft: 2,
      hasPaidSubscription: false,
      isPricingModalOpen: false,
      setIsPricingModalOpen: (isPricingModalOpen) => set({ isPricingModalOpen }),

      useStoryCredit: () => {
        const state = get();
        if (state.hasPaidSubscription) return true;
        if (state.freeStoriesLeft > 0) {
          set({ freeStoriesLeft: state.freeStoriesLeft - 1 });
          return true;
        }
        set({ isPricingModalOpen: true });
        return false;
      },

      addStoryCredits: (amount) =>
        set((state) => ({
          freeStoriesLeft: state.freeStoriesLeft + amount,
          isPricingModalOpen: false,
        })),

      setHasPaidSubscription: (val) =>
        set(() => ({
          hasPaidSubscription: val,
          isPricingModalOpen: false,
        })),
    }),
    {
      name: 'nurqissa_store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        locale: state.locale,
        theme: state.theme,
        nurCoins: state.nurCoins,
        userXP: state.userXP,
        userLevel: state.userLevel,
        dailyStreak: state.dailyStreak,
        dailyMissions: state.dailyMissions,
        badges: state.badges,
        foundHiddenObjects: state.foundHiddenObjects,
        familyNotes: state.familyNotes,
        stories: state.stories,
        currentUser: state.currentUser,
        freeStoriesLeft: state.freeStoriesLeft,
        hasPaidSubscription: state.hasPaidSubscription,
      }),
    }
  )
);
