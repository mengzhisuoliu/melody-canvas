import { create } from "zustand";

type AudioMeta = { name: string; url: string; };

interface MediaState {
  audioMeta: AudioMeta | null;
}

interface MediaAction {
  setAudioMeta: (value: AudioMeta) => void;
}

type MediaStore = MediaState & MediaAction;

const useMediaStore = create<MediaStore>((set) => ({
  audioMeta: null,
  setAudioMeta: (value) => set({ audioMeta: value })
}));

export default useMediaStore;
