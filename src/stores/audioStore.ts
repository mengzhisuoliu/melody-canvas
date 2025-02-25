import { create } from "zustand";

interface AudioState {
  audioFile: File | null;
  audioBuffer: AudioBuffer | null;
}

interface AudioAction {
  setAudioFile: (value: File) => void;
  setAudioBuffer: (value: AudioBuffer) => void;
}

type AudioStore = AudioState & AudioAction;

const useAudioStore = create<AudioStore>((set) => ({
  audioFile: null,
  audioBuffer: null,
  setAudioFile: (audioFile) => set({ audioFile }),
  setAudioBuffer: (audioBuffer) => set({ audioBuffer })
}));

export default useAudioStore;
