import { create } from "zustand";

type ThemeMode = "light" | "dark";

interface SettingState {
  themeMode: ThemeMode;
}

interface SettingAction {
  setThemeMode: (value: ThemeMode) => void;
}

type SettingStore = SettingState & SettingAction;

const updateThemeAttr = (value: ThemeMode) => {
  document.documentElement.setAttribute("theme-mode", value);
  localStorage.setItem("theme-mode", value);
};

const initThemeMode = () => {
  const localTheme = localStorage.getItem("theme-mode");

  if (localTheme === "light" || localTheme === "dark") {
    updateThemeAttr(localTheme);
    return localTheme;
  }

  const preferTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  updateThemeAttr(preferTheme);
  return preferTheme;
};

const useSettingStore = create<SettingStore>((set) => ({
  themeMode: initThemeMode(),
  setThemeMode: (value) => {
    set({ themeMode: value });
    updateThemeAttr(value);
  }
}));

export default useSettingStore;
