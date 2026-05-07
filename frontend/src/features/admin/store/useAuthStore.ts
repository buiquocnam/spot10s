import { create } from "zustand";

interface AdminUser {
  id: string;
  username: string;
}

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setUser: (user: AdminUser | null) => void;
  setAuthenticated: (status: boolean) => void;
  setLoading: (status: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setLoading: (status) => set({ isLoading: status }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
