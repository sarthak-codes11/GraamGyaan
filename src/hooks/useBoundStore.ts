  import type { StateCreator } from "zustand";
  import { create } from "zustand";
  import type { GoalXpSlice } from "~/stores/createGoalXpStore";
  import { createGoalXpSlice } from "~/stores/createGoalXpStore";
  import type { LanguageSlice } from "~/stores/createLanguageStore";
  import { createLanguageSlice } from "~/stores/createLanguageStore";
  import type { LessonSlice } from "~/stores/createLessonStore";
  import { createLessonSlice } from "~/stores/createLessonStore";
  import type { LingotSlice } from "~/stores/createLingotStore";
  import { createLingotSlice } from "~/stores/createLingotStore";
  import type { SoundSettingsSlice } from "~/stores/createSoundSettingsStore";
  import { createSoundSettingsSlice } from "~/stores/createSoundSettingsStore";
  import type { StreakSlice } from "~/stores/createStreakStore";
  import { createStreakSlice } from "~/stores/createStreakStore";
  import type { UserSlice } from "~/stores/createUserStore";
  import { createUserSlice } from "~/stores/createUserStore";
  import type { XpSlice } from "~/stores/createXpStore";
  import { createXpSlice } from "~/stores/createXpStore";
  import type { BadgeSlice } from "~/stores/createBadgeStore";
  import { createBadgeSlice } from "~/stores/createBadgeStore";
  import type { ShopSlice } from "~/stores/createShopStore";
  import { createShopSlice } from "~/stores/createShopStore";
  import type { ThemeSlice } from "~/stores/createThemeStore";
  import { createThemeSlice } from "~/stores/createThemeStore";

  type UISlice = {
    rightbarMobileOpen: boolean;
    openRightbarMobile: () => void;
    closeRightbarMobile: () => void;
    toggleRightbarMobile: () => void;
  };

  type BoundState = GoalXpSlice &
    LanguageSlice &
    LessonSlice &
    LingotSlice &
    SoundSettingsSlice &
    StreakSlice &
    UserSlice &
    XpSlice &
    BadgeSlice &
    ShopSlice &
    ThemeSlice &
    UISlice;

  export type BoundStateCreator<SliceState> = StateCreator<
    BoundState,
    [],
    [],
    SliceState
  >;

export const useBoundStore = create<BoundState>((...args) => ({
  ...createGoalXpSlice(...args),
  ...createLanguageSlice(...args),
  ...createLessonSlice(...args),
  ...createLingotSlice(...args),
  ...createSoundSettingsSlice(...args),
  ...createStreakSlice(...args),
  ...createUserSlice(...args),
  ...createXpSlice(...args),

  ...createBadgeSlice(...args),
  ...createShopSlice(...args),
  ...createThemeSlice(...args),

  // UI: Mobile RightBar control
  rightbarMobileOpen: false,
  openRightbarMobile: () => (args[0] as any)((state: any) => ({ rightbarMobileOpen: true })),
  closeRightbarMobile: () => (args[0] as any)((state: any) => ({ rightbarMobileOpen: false })),
  toggleRightbarMobile: () =>
    (args[0] as any)((state: any) => ({ rightbarMobileOpen: !state.rightbarMobileOpen })),
}));
