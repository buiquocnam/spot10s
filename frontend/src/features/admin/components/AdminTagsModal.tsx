"use client";

import { useState } from "react";
import { useAdminTags } from "../hooks/useAdmin";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdminTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminTagsModal({ isOpen, onClose }: AdminTagsModalProps) {
  const { tags, createTag, deleteTag, isLoading, isProcessing } = useAdminTags();
  const [newTagName, setNewTagName] = useState("");

  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    createTag(newTagName.trim(), {
      onSuccess: () => setNewTagName(""),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-3xl p-6 border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Quản lý Tags</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Thêm Tag mới</Label>
            <div className="flex gap-2">
              <Input 
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="VD: 📸 Check-in đẹp"
                className="h-12 rounded-xl bg-surface-soft border-none font-bold"
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Button 
                onClick={handleAddTag} 
                disabled={isProcessing || !newTagName.trim()}
                className="h-12 w-12 rounded-xl bg-ink text-canvas p-0 shadow-md"
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus size={20} />}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Danh sách Tags</Label>
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
              {isLoading ? (
                <div className="flex items-center justify-center h-20 text-ink/20">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : tags.length === 0 ? (
                <p className="text-sm text-ink/40 text-center py-8 italic">Chưa có tag nào.</p>
              ) : (
                tags.map((tag: any) => (
                  <div key={tag.id} className="flex items-center justify-between p-3 rounded-2xl bg-surface-soft group hover:bg-surface-soft/80 transition-colors">
                    <span className="font-bold text-ink">{tag.name}</span>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => deleteTag(tag.id)}
                      className="h-8 w-8 rounded-full text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full h-12 rounded-xl bg-ink text-canvas font-bold shadow-lg mt-2">
            Hoàn tất
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
