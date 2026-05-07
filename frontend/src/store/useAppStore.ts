import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocationState {
  lat: number | null;
  lng: number | null;
  address: string | null;
}

interface AppState {
  viewMode: "list" | "map";
  location: LocationState;
  selectedPlaceId: string | null;
  
  // Actions
  setViewMode: (mode: "list" | "map") => void;
  setLocation: (location: LocationState) => void;
  setSelectedPlaceId: (id: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      viewMode: "list",
      location: {
        lat: null,
        lng: null,
        address: null,
      },
      selectedPlaceId: null,
      setViewMode: (mode) => set({ viewMode: mode }),
      setLocation: (location) => set({ location }),
      setSelectedPlaceId: (id) => set({ selectedPlaceId: id }),
    }),
    {
      name: "cafe-10s-location",
    }
  )
);
