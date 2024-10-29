import { Canvas, FabricObject } from "fabric";
import { create } from "zustand";

interface CanvasState {
  canvasInstance: Canvas | null;
}

interface CanvasAction {
  createCanvas: (value: Canvas) => void;
  disposeCanvas: () => void;
}

type CanvasStore = CanvasState & CanvasAction;

const useCanvasStore = create<CanvasStore>((set, get) => ({
  canvasInstance: null,
  createCanvas: (value) => set({ canvasInstance: value }),
  disposeCanvas: () => {
    get().canvasInstance?.dispose();
  }
}));

export default useCanvasStore;
