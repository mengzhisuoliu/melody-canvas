import { create } from "zustand";

interface AudioState {
  audioFile: File | null;
}

interface AudioAction {
  setAudioFile: (value: File) => void;
}

type AudioStore = AudioState & AudioAction;

const useAudioStore = create<AudioStore>((set) => ({
  audioFile: null,
  setAudioFile: (value) => set({ audioFile: value })
}));

export default useAudioStore;
