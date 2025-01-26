import type { Canvas, FabricObject } from "fabric";
import { create } from "zustand";

interface CanvasState {
  canvasInstance: Canvas | null;
  activeObjects: FabricObject[];
  ratio: string;
}

interface CanvasAction {
  createCanvas: (value: Canvas) => void;
  disposeCanvas: () => void;
  setRatio: (value: string) => void;
}

type CanvasStore = CanvasState & CanvasAction;

const useCanvasStore = create<CanvasStore>((set, get) => ({
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
  ratio: "16:9",
  setRatio: (value) => {
    set({ ratio: value });
  }
}));

export default useCanvasStore;
