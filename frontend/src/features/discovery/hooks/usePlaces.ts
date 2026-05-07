import { useQuery } from "@tanstack/react-query";
import { placesApi } from "../../places/api/places.api";

export function useNearbyPlaces(
  lat: number | null, 
  lng: number | null, 
  category?: string, 
  search?: string,
  radius?: number | null,
  minRating?: number
) {
  return useQuery({
    queryKey: ["places", "nearby", lat, lng, category, search, radius, minRating],
    queryFn: async () => {
      if (lat === null || lng === null) return [];
      return placesApi.getNearby(lat, lng, category, search, radius, minRating);
    },
    enabled: lat !== null && lng !== null,
  });
}
