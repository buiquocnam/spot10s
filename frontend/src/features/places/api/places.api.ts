import apiClient from "@/lib/axios";

export const placesApi = {
  getNearby: async (lat: number, lng: number) => {
    const { data } = await apiClient.get("/places/nearby", {
      params: { lat, lng },
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
