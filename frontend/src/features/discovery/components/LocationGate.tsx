"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Search, Loader2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

export function LocationGate({ children }: { children: React.ReactNode }) {
  const { location, setLocation } = useAppStore();
  const [showGate, setShowGate] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [addressInput, setAddressInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Xử lý Hydration cho Zustand Persist
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!location.lat || !location.lng) {
      setShowGate(true);
      document.body.style.overflow = "hidden"; // Chặn scroll body
    } else {
      setShowGate(false);
      document.body.style.overflow = "unset"; // Trả lại scroll body
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [location.lat, location.lng, mounted]);

  // OpenStreetMap (Nominatim) Autocomplete Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (addressInput.length > 2) {
        setSearching(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressInput)}&format=json&addressdetails=1&limit=5&countrycodes=vn&viewbox=108.0,15.9,108.4,16.2&bounded=1`
          );
          const data = await res.json();
          const formatted = data.map((item: any) => ({
            id: item.place_id,
            text: item.display_name.split(',')[0],
            place_name: item.display_name,
            center: [parseFloat(item.lon), parseFloat(item.lat)]
          }));
          setSuggestions(formatted);
        } catch (error) {
          console.error("Search error:", error);
          setSuggestions([]);
        } finally {
          setSearching(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [addressInput]);

  const handleSelectLocation = (feature: any) => {
    const [lng, lat] = feature.center;
    setLocation({
      lat,
      lng,
      address: feature.place_name,
    });
    toast.success(`Đã xác định: ${feature.text}`);
  };

  const handleGetGPS = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      toast.error("Trình duyệt của bạn không hỗ trợ định vị");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: "Vị trí của bạn",
        });
        toast.success("Đã xác định được vị trí!");
      },
      (err) => {
        toast.error("Không thể lấy vị trí. Vui lòng tự nhập địa chỉ.");
        setIsManual(true);
      }
    );
  };

  if (!mounted) return null;

  return (
    <>
      <div className={showGate ? "blur-2xl pointer-events-none transition-all duration-1000 grayscale select-none h-screen overflow-hidden" : "transition-all duration-500"}>
        {children}
      </div>

      <AnimatePresence>
        {showGate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-white/30 backdrop-blur-3xl p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-block-lime rounded-[40px] p-8 sm:p-10 shadow-2xl flex flex-col gap-8 text-center relative overflow-hidden max-h-[90vh]"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-ink/10" />
              
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white mx-auto shadow-sm shrink-0">
                <MapPin size={32} className="text-ink" />
              </div>

              {!isManual ? (
                <>
                  <div className="flex flex-col gap-3 text-center">
                    <h2 className="text-2xl sm:text-3xl font-black leading-tight text-ink">
                      Tìm quán gần bạn nhất?
                    </h2>
                    <p className="text-base sm:text-lg font-medium text-ink/60">
                      Bật định vị để chúng mình tính toán 10s đi bộ chính xác tuyệt đối nhé.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 shrink-0">
                    <button 
                      onClick={handleGetGPS}
                      className="h-14 sm:h-16 rounded-full bg-ink text-canvas font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-transform"
                    >
                      <Navigation size={20} fill="currentColor" />
                      Tìm quanh đây (GPS)
                    </button>
                    <button 
                      onClick={() => setIsManual(true)}
                      className="h-14 sm:h-16 rounded-full bg-white/40 border border-ink/5 text-ink font-bold text-lg active:scale-95 transition-transform"
                    >
                      Tôi sẽ tự nhập địa chỉ
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-6 w-full text-left overflow-hidden">
                  <div className="flex flex-col gap-4 overflow-hidden">
                    <h2 className="text-2xl font-black text-ink text-center">Nhập địa chỉ của bạn</h2>
                    <div className="relative shrink-0">
                      <input 
                        type="text" 
                        placeholder="VD: Cầu Rồng, Đà Nẵng..."
                        value={addressInput}
                        onChange={(e) => setAddressInput(e.target.value)}
                        className="w-full h-14 sm:h-16 rounded-2xl bg-white px-6 pr-14 text-lg font-bold outline-none border-2 border-transparent focus:border-ink transition-all shadow-sm"
                        autoFocus
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        {searching ? <Loader2 className="animate-spin text-ink/30" /> : <Search className="text-ink/30" />}
                      </div>
                    </div>

                    {/* Suggestions List */}
                    <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar pb-2">
                      {suggestions.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleSelectLocation(s)}
                          className="w-full text-left p-4 rounded-xl bg-white/60 hover:bg-white border border-transparent hover:border-ink/10 transition-all flex flex-col gap-0.5 shrink-0"
                        >
                          <span className="font-bold text-ink leading-tight">{s.text}</span>
                          <span className="text-[10px] text-ink/40 line-clamp-1">{s.place_name}</span>
                        </button>
                      ))}
                      {addressInput.length > 2 && suggestions.length === 0 && !searching && (
                        <p className="text-center text-xs text-ink/30 py-4">Không tìm thấy địa điểm nào</p>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsManual(false)}
                    className="text-xs font-bold uppercase tracking-widest text-ink/40 text-center hover:text-ink transition-colors shrink-0"
                  >
                    Dùng định vị GPS thay thế
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
