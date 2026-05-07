"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCheckAuth } from "@/features/admin/hooks/useAdmin";
import { useAuthStore } from "@/features/admin/store/useAuthStore";
import { Loader2 } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, setLoading } = useAuthStore();
  const pathname = usePathname();
  
  // Hook này sẽ tự động chạy nếu đang ở route admin nhờ thuộc tính 'enabled'
  useCheckAuth();

  useEffect(() => {
    const isAdminRoute = pathname.startsWith("/admin");
    if (!isAdminRoute) {
      setLoading(false); // Nếu không phải admin thì không cần chờ load
    }
  }, [setLoading, pathname]);

  // Chỉ hiện loading cho trang dashboard khi đang check session
  const isDashboard = pathname.startsWith("/admin/dashboard");
  if (isLoading && isDashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <Loader2 className="animate-spin text-ink/20" size={40} />
      </div>
    );
  }

  return <>{children}</>;
}
