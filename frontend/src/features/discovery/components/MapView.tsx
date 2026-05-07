"use client";

import Map, { NavigationControl, Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";
import { Coffee, Utensils, Heart, Briefcase } from "lucide-react";

const getPlaceIcon = (tags: string[]) => {
  if (tags.includes('cafe')) return <Coffee size={18} />;
  if (tags.includes('food')) return <Utensils size={18} />;
  if (tags.includes('date')) return <Heart size={18} />;
  if (tags.includes('work')) return <Briefcase size={18} />;
  return <Coffee size={18} />; // Default
};

// KHÔNG CẦN TOKEN NỮA
// Dùng style miễn phí từ CartoDB (rất đẹp và chuyên nghiệp)
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export default function MapView({ places }: { places?: any[] }) {
  const { location, setLocation, selectedPlaceId, setSelectedPlaceId } = useAppStore();
  const [viewState, setViewState] = useState({
    longitude: 108.2022, // Đà Nẵng
    latitude: 16.0544,
    zoom: 14,
  });

  const handleMarkerClick = (place: any, lat: number, lng: number) => {
    setSelectedPlaceId(place.id);
    setViewState({
      ...viewState,
      longitude: lng,
      latitude: lat,
      zoom: 16,
    });
  };

  return (
    <div className="h-full w-full relative">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle={MAP_STYLE}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-left" />
        
        {/* Markers cho các quán */}
        {places?.map((place) => {
          const lat = place.location?.y || place.lat;
          const lng = place.location?.x || place.lng;
          
          if (!lat || !lng) return null;

          const isSelected = selectedPlaceId === place.id;

          return (
            <Marker key={place.id} longitude={lng} latitude={lat} anchor="bottom">
              <button 
                onClick={() => handleMarkerClick(place, lat, lng)}
                className={`group relative flex h-10 w-10 items-center justify-center rounded-full bg-block-cream border-2 transition-all hover:scale-125 shadow-lg ${
                  isSelected ? "border-primary scale-125 z-50 ring-4 ring-primary/20" : "border-ink"
                }`}
              >
                <div className={isSelected ? "text-primary" : "text-ink"}>
                  {getPlaceIcon(place.tags || [])}
                </div>
                <div className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2 py-1 text-[10px] font-bold shadow-md transition-all ${
                  isSelected ? "bg-primary text-white scale-110" : "bg-ink/90 backdrop-blur-sm text-canvas"
                }`}>
                  {place.name}
                  {/* Small triangle pointer */}
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent ${
                    isSelected ? "border-t-primary" : "border-t-ink/90"
                  }`} />
                </div>
              </button>
            </Marker>
          );
        })}

        {/* Marker vị trí của User */}
        {location.lat && location.lng && (
          <Marker longitude={location.lng} latitude={location.lat} anchor="center">
            <div className="relative flex h-8 w-8 items-center justify-center z-50">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
              <div className="relative h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
            </div>
          </Marker>
        )}
      </Map>

    </div>
  );
}
