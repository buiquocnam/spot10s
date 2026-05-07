import { useQuery } from "@tanstack/react-query";
import { placesApi } from "../api/places.api";
import { useAppStore } from "@/store/useAppStore";

export function usePlaceDetail(id: string) {
  const { location } = useAppStore();
  
  return useQuery({
    queryKey: ["places", id, location.lat, location.lng],
    queryFn: () => placesApi.getDetail(id, location.lat || undefined, location.lng || undefined),
    enabled: !!id,
  });
}
