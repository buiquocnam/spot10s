"use client";

import { useAppStore } from "@/store/useAppStore";
import { List, Map as MapIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function ViewToggle() {
  const { viewMode, setViewMode } = useAppStore();

  return (
    <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border bg-canvas p-1 shadow-xl">
      <Button
        variant="ghost"
        onClick={() => setViewMode("list")}
        className={`relative h-10 gap-2 rounded-full px-5 text-sm font-bold transition-all ${
          viewMode === "list" ? "text-canvas hover:text-canvas" : "text-ink hover:bg-surface-soft"
        }`}
      >
        {viewMode === "list" && (
          <motion.div
            layoutId="active-pill"
            className="absolute inset-0 z-0 rounded-full bg-ink"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <List size={16} className="z-10" />
        <span className="z-10">Danh sách</span>
      </Button>

      <Button
        variant="ghost"
        onClick={() => setViewMode("map")}
        className={`relative h-10 gap-2 rounded-full px-5 text-sm font-bold transition-all ${
          viewMode === "map" ? "text-canvas hover:text-canvas" : "text-ink hover:bg-surface-soft"
        }`}
      >
        {viewMode === "map" && (
          <motion.div
            layoutId="active-pill"
            className="absolute inset-0 z-0 rounded-full bg-ink"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <MapIcon size={16} className="z-10" />
        <span className="z-10">Bản đồ</span>
      </Button>
    </div>
  );
}
