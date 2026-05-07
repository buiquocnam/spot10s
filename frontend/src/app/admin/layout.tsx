"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/features/admin/components/AdminSidebar";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-surface-soft">
      <AdminSidebar />
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="p-10 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
