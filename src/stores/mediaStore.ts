import { create } from "zustand";

type AudioMeta = {
  name: string;
  url: string;
};

interface MediaState {
  audioPlaying: boolean
  audioMeta: AudioMeta | null;
}

interface MediaAction {
  setAudioMeta: (value: AudioMeta) => void;
  setAudioPlaying: (value: boolean) => void;
}

type MediaStore = MediaState & MediaAction;

const useMediaStore = create<MediaStore>((set) => ({
  audioMeta: null,
  setAudioMeta: (value) => set({ audioMeta: value }),
  audioPlaying: false,
  setAudioPlaying: (value) => set({ audioPlaying: value }),
}));

export default useMediaStore;
