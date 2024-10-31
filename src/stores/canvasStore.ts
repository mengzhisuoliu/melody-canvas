import { Canvas, FabricObject } from "fabric";
import { create } from "zustand";

interface CanvasState {
  canvasInstance: Canvas | null;
  activeObject: FabricObject | null;
}

interface CanvasAction {
  createCanvas: (value: Canvas) => void;
  disposeCanvas: () => void;
}

type CanvasStore = CanvasState & CanvasAction;

const useCanvasStore = create<CanvasStore>((set, get) => ({
  canvasInstance: null,
  activeObject: null,
  createCanvas: (value) => {
    set({ canvasInstance: value });

    const updateActiveObject = () => {
      set({ activeObject: value.getActiveObject() });
    };
    value.on("selection:created", updateActiveObject);
    value.on("selection:updated", updateActiveObject);
    value.on("selection:cleared", () => {
      set({ activeObject: null });
    });
  },
  disposeCanvas: () => {
    get().canvasInstance?.dispose();
  }
}));

export default useCanvasStore;
