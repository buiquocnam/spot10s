import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";

interface PlaceCardProps {
  id: number | string;
  name: string;
  address: string;
  rating: number;
  distance: string;
  images?: string[];
  tags: string[];
}

export default function PlaceCard({ id, name, address, rating, distance, images, tags }: PlaceCardProps) {
  const displayImage = images && images.length > 0 
    ? images[0] 
    : "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1000";

  return (
    <Link href={`/places/${id}`}>
      <motion.div 
        whileHover={{ y: -4 }}
        className="group cursor-pointer flex flex-col gap-3"
      >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-[24px] bg-surface-soft border">
        <motion.img
          src={displayImage}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute bottom-3 left-3 flex gap-1">
          {tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink backdrop-blur-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 px-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold leading-tight tracking-tight group-hover:underline">
            {name}
          </h3>
          <div className="flex items-center gap-1 rounded-full bg-block-cream px-2 py-0.5 text-xs font-bold">
            <Star size={12} fill="currentColor" />
            {rating}
          </div>
        </div>
        
        <p className="text-sm text-ink/60 line-clamp-1">{address}</p>
        
        <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-ink">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-canvas">
            <Walk size={12} />
          </div>
          {distance} đi bộ
        </div>
      </div>
    </motion.div>
    </Link>
  );
}

// Icon Walk placeholder since Lucide might not have it exactly
function Walk({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 20 3-3 3 3M12 17V11M12 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
      <path d="M17 11c-1 0-2-1-2-2v-.5c0-1.4 1.1-2.5 2.5-2.5S20 7.1 20 8.5V11h-3Z"/>
    </svg>
  );
}
