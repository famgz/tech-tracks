import { Track } from "@prisma/client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface TrackStore {
  currentTrack: Track | null;
  setCurrentTrack: (track: Track) => void;
}

export const useTrackStore = create<TrackStore>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      //
      setCurrentTrack: (track) => set(() => ({ currentTrack: track })),
      //
      removeCurrentTrack: () => set(() => ({ currentTrack: null })),
    }),
    {
      name: "tech-tracks-current-track",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
