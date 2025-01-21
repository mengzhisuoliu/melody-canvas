import type { Canvas, FabricObject } from "fabric";
import { create } from "zustand";

type Backdrop = {
  ratio: string;
  color: string;
};

interface CanvasState {
  canvasInstance: Canvas | null;
  activeObjects: FabricObject[];
  backdrop: Backdrop;
}

interface CanvasAction {
  createCanvas: (value: Canvas) => void;
  disposeCanvas: () => void;
  setBackdrop: (value: Partial<Backdrop>) => void;
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
  backdrop: {
    ratio: "16:9",
    color: "#000000"
  },
  setBackdrop: (value) => {
    set({
      backdrop: {
        ...get().backdrop,
        ...value
      }
    });
  }
}));

export default useCanvasStore;
