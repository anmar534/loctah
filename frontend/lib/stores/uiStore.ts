import { create } from 'zustand';

export type ThemePreference = 'light' | 'dark' | 'system';

export type UiState = {
  theme: ThemePreference;
  isSidebarOpen: boolean;
  isCommandPaletteOpen: boolean;
  setTheme: (theme: ThemePreference) => void;
  toggleSidebar: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  theme: 'system',
  isSidebarOpen: false,
  isCommandPaletteOpen: false,
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openCommandPalette: () => set({ isCommandPaletteOpen: true }),
  closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
}));
