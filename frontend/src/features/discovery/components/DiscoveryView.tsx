"use client";

import Header from "./Header";
import ViewToggle from "./ViewToggle";
import MapView from "./MapView";
import PlaceSidePanel from "./PlaceSidePanel";
import DiscoveryToolbar from "./DiscoveryToolbar";
import PlaceCard from "./PlaceCard";
import { useAppStore } from "@/store/useAppStore";
import { useNearbyPlaces } from "../hooks/usePlaces";
import { AnimatePresence, motion } from "framer-motion";

export default function DiscoveryView() {
  const { viewMode, location, category, searchQuery, radius, minRating } = useAppStore();
  
  // Lấy danh sách quán từ server kèm lọc
  const { data: places, isLoading } = useNearbyPlaces(
    location.lat || 16.0544, 
    location.lng || 108.2022,
    category,
    searchQuery,
    radius,
    minRating
  );

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-canvas">
      <Header />
      <DiscoveryToolbar />
      
      <main className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4 md:p-6 pb-24 h-full overflow-y-auto"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tighter italic">Quán gần bạn</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {isLoading ? (
                  [1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col gap-3">
                      <div className="aspect-square rounded-[24px] bg-surface-soft animate-pulse" />
                      <div className="h-6 w-3/4 rounded-md bg-surface-soft animate-pulse" />
                    </div>
                  ))
                ) : (
                  places?.map((place: any) => (
                    <PlaceCard 
                      key={place.id} 
                      {...place} 
                      distance={Math.round(place.distance) + "m"}
                    />
                  ))
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <MapView places={places} />
              <PlaceSidePanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ViewToggle />
    </div>
  );
}
