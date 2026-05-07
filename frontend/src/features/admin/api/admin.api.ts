import apiClient from "@/lib/axios";

export const adminApi = {
  login: async (credentials: any) => {
    const { data } = await apiClient.post("/admin/login", credentials);
    return data;
  },
  logout: async () => {
    await apiClient.post("/admin/logout");
  },
  getPlaces: async () => {
    const { data } = await apiClient.get("/places");
    return data.data;
  },
  approvePlace: async (id: string) => {
    await apiClient.patch(`/admin/places/${id}/approve`);
  },
  createPlace: async (data: any) => {
    const response = await apiClient.post("/admin/places", data);
    return response.data;
  },
  updatePlace: async (id: string, data: any) => {
    const response = await apiClient.put(`/admin/places/${id}`, data);
    return response.data;
  },
  deletePlace: async (id: string) => {
    await apiClient.delete(`/admin/places/${id}`);
  },
  getTags: async () => {
    const { data } = await apiClient.get("/admin/tags");
    return data.data;
  },
  createTag: async (name: string) => {
    const { data } = await apiClient.post("/admin/tags", { name });
    return data.data;
  },
  deleteTag: async (id: string) => {
    await apiClient.delete(`/admin/tags/${id}`);
  },
  checkAuth: async () => {
    const { data } = await apiClient.get("/admin/me");
    return data.data;
  },
};
