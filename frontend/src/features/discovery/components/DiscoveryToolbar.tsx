import { useState } from "react";
import { Search, SlidersHorizontal, X, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { id: "all", label: "Tất cả", icon: "🏠" },
  { id: "cafe", label: "Cà phê", icon: "☕" },
  { id: "food", label: "Quán ăn", icon: "🍱" },
  { id: "date", label: "Hẹn hò", icon: "🕯️" },
  { id: "work", label: "Làm việc", icon: "💻" },
];

const RADIUS_OPTIONS = [
  { label: "500m", value: 500 },
  { label: "1km", value: 1000 },
  { label: "3km", value: 3000 },
  { label: "5km", value: 5000 },
  { label: "10km", value: 10000 },
];

const RATING_OPTIONS = [
  { label: "Tất cả", value: 0 },
  { label: "3+", value: 3 },
  { label: "4+", value: 4 },
  { label: "4.5+", value: 4.5 },
];

export default function DiscoveryToolbar() {
  const { 
    category: selectedCategory, 
    setCategory: setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    radius,
    setRadius,
    minRating,
    setMinRating
  } = useAppStore();

  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4 md:px-6 bg-canvas/80 backdrop-blur-md sticky top-[56px] z-40 border-b">
      {/* Search & Filter Toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30 group-focus-within:text-ink transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Tìm tên quán..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-surface-soft border border-transparent focus:border-ink/10 focus:bg-white outline-none transition-all text-sm font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-ink/5 text-ink/30"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <Button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          variant={showAdvanced ? "default" : "outline"}
          className={cn(
            "h-12 w-12 rounded-2xl p-0",
            showAdvanced ? "bg-ink text-canvas" : "bg-white border-ink/5"
          )}
        >
          <SlidersHorizontal size={20} />
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 pt-2 pb-4">
              {/* Distance Filter */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/40">
                  <MapPin size={12} />
                  Khoảng cách tối đa
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setRadius(null)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                      radius === null ? "bg-ink text-canvas border-ink" : "bg-white border-ink/5 hover:border-ink/20"
                    )}
                  >
                    Bất kỳ
                  </button>
                  {RADIUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setRadius(opt.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                        radius === opt.value ? "bg-ink text-canvas border-ink" : "bg-white border-ink/5 hover:border-ink/20"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/40">
                  <Star size={12} />
                  Đánh giá tối thiểu
                </div>
                <div className="flex flex-wrap gap-2">
                  {RATING_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setMinRating(opt.value)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                        minRating === opt.value ? "bg-ink text-canvas border-ink" : "bg-white border-ink/5 hover:border-ink/20"
                      )}
                    >
                      {opt.value > 0 && <Star size={10} fill="currentColor" />}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border",
              selectedCategory === cat.id 
                ? "bg-ink text-canvas border-ink shadow-lg scale-105" 
                : "bg-white text-ink/60 border-ink/5 hover:border-ink/20"
            )}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
