import type { Canvas, FabricObject } from "fabric";
import { create } from "zustand";

import { BuilderFactory } from "@/visualizers";
import { BREAK_POINTS } from "@/libs/common";

interface CanvasState {
  canvasInstance: Canvas | null;
  activeObjects: FabricObject[];
  builderFactory: BuilderFactory | null;
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
  builderFactory: null,
  ratio: window.matchMedia(BREAK_POINTS['max-lg']).matches ? "9:16" : "16:9",
  createCanvas: (canvasInstance) => {
    set({ canvasInstance });
    set({ builderFactory: new BuilderFactory(canvasInstance) });

    const updateActiveObjects = () => {
      set({ activeObjects: canvasInstance.getActiveObjects() });
    };
    canvasInstance.on("selection:created", updateActiveObjects);
    canvasInstance.on("selection:updated", updateActiveObjects);
    canvasInstance.on("selection:cleared", () => {
      set({ activeObjects: [] });
    });
  },
  disposeCanvas: () => {
    get().canvasInstance?.dispose();
  },
  setRatio: (ratio) => {
    set({ ratio });
  }
}));

export default useCanvasStore;
