import { Canvas, FabricObject } from "fabric";
import { create } from "zustand";

interface CanvasState {
  fabricInstance: Canvas | null;
}

interface CanvasAction {
  createFabric: (value: Canvas) => void;
  disposeFabric: () => void;
  updateFabric: (value: FabricObject) => void;
}

type CanvasStore = CanvasState & CanvasAction;

const useCanvasStore = create<CanvasStore>((set, get) => ({
  fabricInstance: null,
  createFabric: (value) => set({ fabricInstance: value }),
  disposeFabric: () => {
    get().fabricInstance?.dispose();
  },
  updateFabric: (value) => {
    get().fabricInstance?.add(value);
  }
}));

export default useCanvasStore;
