import { Canvas, FabricObject } from "fabric";
import { create } from "zustand";

type ThemeMode = "light" | "dark";

type Backdrop = {
  ratio: string;
  color: string;
};

interface CanvasState {
  themeMode: ThemeMode;
  canvasInstance: Canvas | null;
  activeObjects: FabricObject[];
  backdrop: Backdrop;
}

interface CanvasAction {
  setThemeMode: (value: ThemeMode) => void;
  createCanvas: (value: Canvas) => void;
  disposeCanvas: () => void;
  setBackdrop: (value: Backdrop) => void;
}

type CanvasStore = CanvasState & CanvasAction;

const useCanvasStore = create<CanvasStore>((set, get) => ({
  themeMode: "light",
  setThemeMode: (value) => {
    set({ themeMode: value });
    document.documentElement.setAttribute("theme-mode", value);
  },
  canvasInstance: null,
  activeObjects: [],
  createCanvas: (value) => {
    set({ canvasInstance: value });

    const updateActiveObjects = () => {
      set({ activeObjects: value.getActiveObjects() });
    };
    value.on("selection:created", updateActiveObjects);
    value.on("selection:updated", updateActiveObjects);
    value.on("selection:cleared", () => {
      set({ activeObjects: [] });
    });
  },
  disposeCanvas: () => {
    get().canvasInstance?.dispose();
  },
  backdrop: {
    ratio: "16:9",
    color: "#000000"
  },
  setBackdrop: (value) => {
    set({ backdrop: value });
  }
}));

export default useCanvasStore;
