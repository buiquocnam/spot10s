import apiClient from "@/lib/axios";

export const placesApi = {
  getNearby: async (lat: number, lng: number, category?: string, search?: string, radius?: number | null, minRating?: number) => {
    const { data } = await apiClient.get("/places/nearby", {
      params: { 
        lat, 
        lng, 
        category: category === 'all' ? undefined : category, 
        search,
        radius: radius || undefined,
        minRating: minRating || undefined
      },
    });
    return data.data;
  },
  getDetail: async (id: string, lat?: number, lng?: number) => {
    const { data } = await apiClient.get(`/places/${id}`, {
      params: { lat, lng },
    });
    return data.data;
  },
};
