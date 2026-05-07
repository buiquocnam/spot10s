"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Navigation, Loader2 } from "lucide-react";
import { usePlaceDetail } from "../hooks/usePlaceDetail";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PlaceDetailView({ id }: { id: string }) {
  const router = useRouter();
  const { data: place, isLoading } = usePlaceDetail(id);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-canvas">
        <Loader2 className="animate-spin text-ink" size={48} />
      </div>
    );
  }

  if (!place) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed inset-0 z-[60] bg-canvas overflow-y-auto"
    >
      <div className="max-w-[1200px] mx-auto min-h-screen flex flex-col md:flex-row bg-white shadow-2xl">
        
        {/* Left Side: Visuals (Sticky on Desktop) */}
        <div className="w-full md:w-1/2 md:sticky md:top-0 md:h-screen bg-surface-soft overflow-hidden border-r border-ink/5">
          <Button 
            variant="secondary"
            size="icon"
            onClick={() => router.back()}
            className="absolute top-6 left-6 z-20 rounded-full bg-white/80 backdrop-blur-md border border-ink/10 text-ink hover:bg-white transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Button>
          
          <div className="h-full w-full">
            {place.images && place.images.length > 0 ? (
              <div className="h-full w-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar">
                {place.images.map((img: string, idx: number) => (
                  <img 
                    key={idx} 
                    src={img} 
                    className="h-full min-w-full object-cover snap-center" 
                    alt={place.name} 
                  />
                ))}
              </div>
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1000" 
                className="h-full w-full object-cover"
                alt={place.name}
              />
            )}
          </div>
        </div>

        {/* Right Side: Information */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col gap-12 relative pb-40">
          
          {/* Title Section */}
          <div className="flex flex-col gap-4 border-b border-ink/5 pb-10">
            <div className="flex items-center gap-3">
              <Badge className="bg-ink text-canvas font-bold rounded-sm px-2 py-0.5 hover:bg-ink">
                {place.rating} ★
              </Badge>
              <div className="flex gap-2">
                {(Array.isArray(place?.tags) ? place.tags : place?.tags?.split(",")).slice(0, 2).map((tag: string) => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-ink/40">
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>

            {place.distance !== undefined && (
              <div className="flex items-center gap-2 text-ink/30 font-bold text-[10px] uppercase tracking-[0.2em]">
                <Navigation size={10} className="fill-current" />
                <span>Cách bạn {Math.round(place.distance)}m — {Math.ceil(place.distance / 80)} phút đi bộ</span>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-serif font-medium text-ink leading-tight">
              {place.name}
            </h1>
            <p className="text-xl text-ink/60 font-light leading-relaxed">
              {place.oneLiner}
            </p>
          </div>

          {/* Quick Details Table */}
          <div className="grid gap-8">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Vị trí</span>
              <p className="text-lg text-ink/80">{place.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 border-t border-ink/5 pt-8">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Giờ hoạt động</span>
                <p className="text-lg text-ink/80">{place.openHours || "08:00 - 22:00"}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Chi phí</span>
                <p className="text-lg text-ink/80">{place.priceRange || "Chưa cập nhật"}</p>
              </div>
            </div>
          </div>

          {/* Action Footer - Professional CTA */}
          <div className="fixed bottom-0 left-0 right-0 md:relative md:mt-auto p-6 md:p-0 bg-white md:bg-transparent border-t md:border-none border-ink/5">
            <Button 
              onClick={() => {
                let url = "";
                if (place.googleMapsLink) {
                  url = place.googleMapsLink;
                } else {
                  const lat = place.location?.y || place.lat;
                  const lng = place.location?.x || place.lng;
                  // Nếu không có link gốc, ưu tiên search theo địa chỉ để Google Maps tự định vị lại chính xác nhất
                  url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.address)}`;
                }
                window.open(url, '_blank');
              }}
              className="w-full h-14 bg-ink text-canvas text-sm font-bold tracking-widest hover:bg-ink/90 transition-colors rounded-none"
            >
              <Navigation size={18} className="mr-2" />
              XEM ĐƯỜNG ĐI TRÊN GOOGLE MAPS
            </Button>
          </div>

          {/* User Reviews Section - Per Docs */}
          <div className="flex flex-col gap-8 border-t border-ink/5 pt-12">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/30">Cộng đồng chia sẻ</h3>
            <div className="flex flex-col gap-10">
              {place.reviews && place.reviews.length > 0 ? (
                place.reviews.map((review: any) => (
                  <div key={review.id} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{review.author}</span>
                      <div className="flex text-ink/20">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-ink" : ""} />
                        ))}
                      </div>
                    </div>
                    <p className="text-lg text-ink/70 leading-relaxed font-light">
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-ink/40 italic">Chưa có đánh giá nào cho quán này.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
