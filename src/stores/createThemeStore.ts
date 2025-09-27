import type { BoundStateCreator } from "~/hooks/useBoundStore";

export type ThemeSlice = {
  darkMode: boolean;
  setDarkMode: (isDark: boolean) => void;
  toggleDarkMode: () => void;
};

export const createThemeSlice: BoundStateCreator<ThemeSlice> = (set, get) => ({
  darkMode: false,
  setDarkMode: (isDark: boolean) => set({ darkMode: isDark }),
  toggleDarkMode: () => set((state: any) => ({ darkMode: !state.darkMode })),
});
