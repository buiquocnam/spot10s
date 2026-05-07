import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../api/admin.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";

export function useAdminPlaces() {
  return useQuery({
    queryKey: ["admin", "places"],
    queryFn: adminApi.getPlaces,
  });
}

export function useAdminActions() {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: adminApi.approvePlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "places"] });
      toast.success("Đã duyệt quán thành công!");
    },
  });

  const createPlaceMutation = useMutation({
    mutationFn: adminApi.createPlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "places"] });
      toast.success("Đã thêm quán mới thành công!");
    },
  });

  const updatePlaceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.updatePlace(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "places"] });
      toast.success("Đã cập nhật quán thành công!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deletePlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "places"] });
      toast.warning("Đã xóa quán khỏi hệ thống.");
    },
  });

  return {
    approvePlace: approveMutation.mutate,
    createPlace: createPlaceMutation.mutate,
    updatePlace: updatePlaceMutation.mutate,
    deletePlace: deleteMutation.mutate,
    isProcessing: approveMutation.isPending || createPlaceMutation.isPending || updatePlaceMutation.isPending || deleteMutation.isPending,
  };
}

export function useAdminTags() {
  const queryClient = useQueryClient();

  const tagsQuery = useQuery({
    queryKey: ["admin", "tags"],
    queryFn: adminApi.getTags,
  });

  const createTagMutation = useMutation({
    mutationFn: adminApi.createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tags"] });
      toast.success("Đã tạo tag mới!");
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: adminApi.deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tags"] });
      toast.success("Đã xóa tag.");
    },
  });

  return {
    tags: tagsQuery.data || [],
    isLoading: tagsQuery.isLoading,
    createTag: createTagMutation.mutate,
    deleteTag: deleteTagMutation.mutate,
    isProcessing: createTagMutation.isPending || deleteTagMutation.isPending,
  };
}

export function useAdminAuth() {
  const router = useRouter();
  const { setUser, logout: clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: adminApi.login,
    onSuccess: (data) => {
      setUser(data.data);
      toast.success("Chào mừng Admin quay trở lại!");
      router.push("/admin/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Đăng nhập thất bại");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: adminApi.logout,
    onSuccess: () => {
      clearAuth();
      router.push("/admin/login");
    },
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
  };
}

export function useCheckAuth() {
  const { setUser, setLoading, setAuthenticated } = useAuthStore();
  const isAdminRoute = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
  
  return useQuery({
    queryKey: ["admin", "me"],
    queryFn: async () => {
      try {
        const user = await adminApi.checkAuth();
        setUser(user);
        return user;
      } catch (error) {
        setUser(null);
        setAuthenticated(false);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    retry: false,
    enabled: isAdminRoute, // Chỉ tự động chạy nếu đang ở route admin
  });
}
