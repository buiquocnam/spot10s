"use client";

import { useAdminPlaces, useAdminActions, useAdminAuth } from "../hooks/useAdmin";
import { Check, Trash2, LogOut, Coffee, Loader2, Pencil, Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import AdminEditModal from "@/features/admin/components/AdminEditModal";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: places, isLoading } = useAdminPlaces();
  const { approvePlace, deletePlace } = useAdminActions();
  const { logout } = useAdminAuth();
  const [editingPlace, setEditingPlace] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  return (
    <div className="flex flex-col gap-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter italic leading-none uppercase">Bàn làm việc</h1>
          <p className="text-sm font-medium text-ink/40 mt-2 italic">Kiểm duyệt và quản lý các địa điểm cà phê trong hệ thống.</p>
        </div>
          
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsAddingNew(true)}
            className="rounded-full bg-ink text-canvas h-14 px-8 font-bold shadow-xl shadow-ink/20 hover:scale-105 transition-all active:scale-95 flex gap-2"
          >
            <Plus size={20} />
            Thêm quán mới
          </Button>
        </div>
      </div>

        {/* Content Table */}
        <div className="rounded-3xl bg-white p-6 shadow-xl border-2 border-black/5 overflow-hidden min-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b-2">
                <TableHead className="font-bold text-ink/40 uppercase tracking-widest text-[10px]">Tên Quán</TableHead>
                <TableHead className="font-bold text-ink/40 uppercase tracking-widest text-[10px]">Địa chỉ</TableHead>
                <TableHead className="font-bold text-ink/40 uppercase tracking-widest text-[10px]">Trạng thái</TableHead>
                <TableHead className="text-right font-bold text-ink/40 uppercase tracking-widest text-[10px]">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell><div className="h-6 w-32 bg-surface-soft rounded-md" /></TableCell>
                    <TableCell><div className="h-4 w-48 bg-surface-soft rounded-md" /></TableCell>
                    <TableCell><div className="h-6 w-16 bg-surface-soft rounded-full" /></TableCell>
                    <TableCell className="text-right"><div className="h-9 w-24 bg-surface-soft rounded-full ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                places?.map((place: any) => (
                  <TableRow key={place.id} className="group transition-colors hover:bg-surface-soft/50">
                    <TableCell className="font-bold text-lg">{place.name}</TableCell>
                    <TableCell className="text-sm text-ink/60 max-w-[300px] truncate">{place.address}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={place.status === 'published' ? "default" : "secondary"}
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                          place.status === 'published' ? "bg-block-mint text-ink hover:bg-block-mint" : "bg-block-pink text-ink hover:bg-block-pink"
                        }`}
                      >
                        {place.status === 'published' ? "Đã duyệt" : "Chờ duyệt"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {place.status !== 'published' && (
                          <Button 
                            size="icon"
                            variant="secondary"
                            onClick={() => approvePlace(place.id)}
                            className="h-9 w-9 rounded-full bg-block-mint text-ink hover:scale-110 transition-all shadow-sm border border-black/5"
                            title="Duyệt quán"
                          >
                            <Check size={18} />
                          </Button>
                        )}
                        <Button 
                          size="icon"
                          variant="secondary"
                          onClick={() => setEditingPlace(place)}
                          className="h-9 w-9 rounded-full bg-block-lime text-ink hover:scale-110 transition-all shadow-sm border border-black/5"
                          title="Sửa thông tin"
                        >
                          <Pencil size={18} />
                        </Button>
                        <Button 
                          size="icon"
                          variant="secondary"
                          onClick={() => {
                            if (confirm("Bạn có chắc chắn muốn xóa quán này?")) {
                              deletePlace(place.id);
                            }
                          }}
                          className="h-9 w-9 rounded-full bg-block-pink text-ink hover:scale-110 transition-all shadow-sm border border-black/5"
                          title="Xóa quán"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
      </div>
    </div>
  );
}
