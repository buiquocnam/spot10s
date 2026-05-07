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
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  category: string;
  setCategory: (category: string) => void;
  radius: number | null;
  setRadius: (radius: number | null) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
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
      category: "all",
      searchQuery: "",
      radius: null,
      minRating: 0,
      selectedPlaceId: null,
      setViewMode: (mode) => set({ viewMode: mode }),
      setLocation: (location) => set({ location }),
      setCategory: (category) => set({ category }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setRadius: (radius) => set({ radius }),
      setMinRating: (rating) => set({ minRating: rating }),
      setSelectedPlaceId: (id) => set({ selectedPlaceId: id }),
    }),
    {
      name: "cafe-10s-location",
    }
  )
);
