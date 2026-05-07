import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Cafe 10s - Tìm quán cà phê Đà Nẵng cực nhanh",
  description: "Khám phá không gian làm việc và chill tại Đà Nẵng chỉ trong 10 giây.",
};

import { LocationGate } from "@/features/discovery/components/LocationGate";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <LocationGate>
              {children}
            </LocationGate>
          </AuthProvider>
        </QueryProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
