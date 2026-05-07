import apiClient from "@/lib/axios";

export const contributeApi = {
  crawlLink: async (url: string) => {
    const { data } = await apiClient.get(`/utils/crawl`, {
      params: { url },
    });
    return data;
  },
  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    const { data } = await apiClient.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data.urls;
  },
  submitContribution: async (contributionData: any) => {
    const { data } = await apiClient.post("/places/contribute", contributionData);
    return data;
  },
  reverseGeocode: async (lat: number, lng: number) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`);
    return res.json();
  },
};
