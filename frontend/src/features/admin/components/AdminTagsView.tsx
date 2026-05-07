"use client";

import { useState } from "react";
import { useAdminTags } from "../hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Loader2, ArrowLeft, Hash } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminTagsView() {
  const router = useRouter();
  const { tags, createTag, deleteTag, isLoading, isProcessing } = useAdminTags();
  const [newTagName, setNewTagName] = useState("");

  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    createTag(newTagName.trim(), {
      onSuccess: () => setNewTagName(""),
    });
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter italic leading-none uppercase">Danh mục & Tags</h1>
          <p className="text-sm font-medium text-ink/40 mt-2 italic">Hệ thống phân loại các địa điểm theo phong cách và tiện ích.</p>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Form */}
          <div className="md:col-span-1">
            <div className="rounded-3xl bg-white p-6 shadow-xl border-2 border-black/5 sticky top-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-ink/60 mb-2">
                  <Plus size={18} />
                  <span className="font-bold text-sm uppercase tracking-wider">Thêm mới</span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Tên Tag / Danh mục</Label>
                  <Input 
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="VD: Check-in đẹp"
                    className="h-12 rounded-xl bg-surface-soft border-none font-bold"
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  />
                </div>

                <Button 
                  onClick={handleAddTag} 
                  disabled={isProcessing || !newTagName.trim()}
                  className="h-14 w-full rounded-2xl bg-ink text-canvas font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Tạo danh mục mới"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="md:col-span-2">
            <div className="rounded-3xl bg-white p-6 shadow-xl border-2 border-black/5 min-h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-ink/60">
                  <Hash size={18} />
                  <span className="font-bold text-sm uppercase tracking-wider">Danh sách hiện có</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-surface-soft text-[10px] font-bold text-ink/40">
                  {tags.length} TAGS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-2xl bg-surface-soft animate-pulse" />
                  ))
                ) : tags.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-ink/20">
                    <Hash size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="font-bold">Chưa có danh mục nào được tạo.</p>
                  </div>
                ) : (
                  tags.map((tag: any) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={tag.id} 
                      className="flex items-center justify-between p-4 rounded-2xl bg-surface-soft group hover:bg-ink hover:text-canvas transition-all duration-300"
                    >
                      <span className="font-bold tracking-tight">{tag.name}</span>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => {
                          if (confirm(`Xóa danh mục "${tag.name}"?`)) {
                            deleteTag(tag.id);
                          }
                        }}
                        className="h-8 w-8 rounded-full text-red-500 hover:bg-red-50 group-hover:text-white group-hover:hover:bg-red-500/20"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
