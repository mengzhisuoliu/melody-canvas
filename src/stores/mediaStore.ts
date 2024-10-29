import { create } from "zustand";

interface MediaState {
  audioFile: File | null;
}

interface MediaAction {
  setAudioFile: (value: File) => void;
}

type MediaStore = MediaState & MediaAction;

const useMediaStore = create<MediaStore>((set) => ({
  audioFile: null,
  setAudioFile: (value) => set({ audioFile: value }),
}));

export default useMediaStore;
