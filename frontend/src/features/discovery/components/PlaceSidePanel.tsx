"use client";

import { usePlaceDetail } from "@/features/places/hooks/usePlaceDetail";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Navigation, Clock, CreditCard, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlaceSidePanel() {
  const { selectedPlaceId, setSelectedPlaceId } = useAppStore();
  const { data: place, isLoading } = usePlaceDetail(selectedPlaceId || "");

  if (!selectedPlaceId) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 z-50 h-full w-full sm:w-[400px] bg-canvas border-l border-ink/10 shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-ink/5 bg-canvas/80 backdrop-blur-md sticky top-0 z-10">
        <span className="font-bold text-sm uppercase tracking-widest text-ink/40">Thông tin chi tiết</span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSelectedPlaceId(null)}
          className="rounded-full hover:bg-ink/5"
        >
          <X size={20} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 pb-32">
        {isLoading ? (
          <div className="flex flex-col gap-6">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : place ? (
          <>
            {/* Images */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-inner bg-surface-soft">
              {place.images && place.images.length > 0 ? (
                <img 
                  src={place.images[0]} 
                  className="h-full w-full object-cover" 
                  alt={place.name} 
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-ink/20">
                  <Globe size={48} />
                </div>
              )}
              <Badge className="absolute top-4 right-4 bg-ink text-canvas font-bold">
                {place.rating} ★
              </Badge>
            </div>

            {/* Title & One-liner */}
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-serif font-medium text-ink">{place.name}</h2>
              <p className="text-lg text-ink/60 font-light">{place.oneLiner}</p>
            </div>

            {/* Quick Info */}
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-ink/5 text-ink/40">
                  <MapPin size={18} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink/30">Địa chỉ</span>
                  <p className="text-sm text-ink/80 leading-snug">{place.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-ink/5 text-ink/40">
                    <Clock size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink/30">Giờ mở cửa</span>
                    <p className="text-sm text-ink/80">{place.openHours || "08:00 - 22:00"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-ink/5 text-ink/40">
                    <CreditCard size={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink/30">Giá cả</span>
                    <p className="text-sm text-ink/80">{place.priceRange || "Chưa cập nhật"}</p>
                  </div>
                </div>
              </div>

              {place.distance !== undefined && (
                <div className="mt-2 p-4 rounded-2xl bg-block-lime/30 border border-block-lime/50 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Khoảng cách từ bạn</span>
                  <p className="text-2xl font-black text-ink">{Math.round(place.distance)}m</p>
                </div>
              )}
            </div>

            {/* Action */}
            <div className="mt-4">
              <Button 
                onClick={() => {
                  let url = place.googleMapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.address)}`;
                  window.open(url, '_blank');
                }}
                className="w-full h-14 bg-ink text-canvas font-bold tracking-widest rounded-xl shadow-lg active:scale-95 transition-transform"
              >
                <Navigation size={18} className="mr-2" />
                DẪN ĐƯỜNG NGAY
              </Button>
            </div>
          </>
        ) : (
          <p className="text-center text-ink/40 py-20">Không tìm thấy thông tin quán.</p>
        )}
      </div>
    </motion.div>
  );
}
