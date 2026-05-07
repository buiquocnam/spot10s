"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Tag, 
  LogOut, 
  Coffee, 
  Settings,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "../hooks/useAdmin";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Duyệt & Quản lý bài đăng"
  },
  {
    title: "Danh mục / Tags",
    href: "/admin/tags",
    icon: Tag,
    description: "Hệ thống phân loại"
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
    description: "Cấu hình hệ thống"
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  return (
    <aside className="w-80 h-screen bg-white border-r-2 border-black/5 flex flex-col sticky top-0">
      {/* Brand Header */}
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-ink flex items-center justify-center shadow-lg shadow-ink/20">
            <Coffee className="text-canvas" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter italic leading-none uppercase">Cafe 10s</h1>
            <span className="text-[10px] font-bold text-ink/30 uppercase tracking-widest">Admin Control</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        <div className="px-4 mb-4">
          <p className="text-[10px] font-bold text-ink/30 uppercase tracking-widest">Menu chính</p>
        </div>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-4 p-4 rounded-3xl transition-all duration-300",
                isActive 
                  ? "bg-ink text-canvas shadow-xl shadow-ink/10" 
                  : "text-ink/60 hover:bg-surface-soft hover:text-ink"
              )}
            >
              <div className={cn(
                "h-10 w-10 rounded-2xl flex items-center justify-center transition-colors",
                isActive ? "bg-white/10" : "bg-surface-soft group-hover:bg-white"
              )}>
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm leading-tight">{item.title}</p>
                <p className={cn(
                  "text-[10px] font-medium leading-tight mt-0.5",
                  isActive ? "text-canvas/50" : "text-ink/30"
                )}>
                  {item.description}
                </p>
              </div>
              {isActive && <ChevronRight size={16} className="text-canvas/30" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-6 mt-auto">
        <div className="rounded-3xl bg-surface-soft p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-block-mint" />
            <div>
              <p className="text-xs font-bold uppercase">Administrator</p>
              <p className="text-[10px] text-ink/40">Quản trị hệ thống</p>
            </div>
          </div>
          <Link 
            href="/" 
            target="_blank"
            className="flex items-center justify-between p-3 rounded-2xl bg-white text-[10px] font-bold uppercase tracking-wider hover:bg-ink hover:text-canvas transition-all shadow-sm"
          >
            Xem trang chủ
            <ExternalLink size={12} />
          </Link>
        </div>

        <Button 
          variant="ghost" 
          onClick={() => {
            if(confirm("Bạn có chắc chắn muốn đăng xuất?")) {
              logout();
            }
          }}
          className="w-full h-12 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 font-bold gap-3 flex items-center justify-center"
        >
          <LogOut size={18} />
          Đăng xuất
        </Button>
      </div>
    </aside>
  );
}
