import { useQuery } from "@tanstack/react-query";
import { placesApi } from "../../places/api/places.api";

export function useNearbyPlaces(lat: number | null, lng: number | null) {
  return useQuery({
    queryKey: ["places", "nearby", lat, lng],
    queryFn: async () => {
      if (lat === null || lng === null) return [];
      return placesApi.getNearby(lat, lng);
    },
    enabled: lat !== null && lng !== null,
  });
}
