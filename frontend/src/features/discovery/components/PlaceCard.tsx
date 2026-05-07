import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
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
          <MapPin size={12} className="text-ink/40" />
          {distance}
        </div>
      </div>
    </motion.div>
    </Link>
  );
}


