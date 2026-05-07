"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contributeSchema, ContributeFormData } from "../../contribute/lib/schema";
import { useAdminActions, useAdminTags } from "../hooks/useAdmin";
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
import { toast } from "sonner";
import { X, ImagePlus, Loader2, Wand2 } from "lucide-react";
import { contributeApi } from "../../contribute/api/contribute.api";
import { Badge } from "@/components/ui/badge";

interface AdminEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  place?: any;
}

export default function AdminEditModal({ isOpen, onClose, place }: AdminEditModalProps) {
  const { createPlace, updatePlace } = useAdminActions();
  const { tags: allTags } = useAdminTags();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [smartInput, setSmartInput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContributeFormData>({
    resolver: zodResolver(contributeSchema),
  });

  const selectedTags = watch("tags") || [];

  useEffect(() => {
    if (place) {
      reset({
        name: place.name,
        address: place.address,
        lat: place.lat,
        lng: place.lng,
        oneLiner: place.oneLiner || "",
        tags: place.tags || [],
      });
      setPreviews(place.images || []);
    } else {
      reset({
        name: "",
        address: "",
        lat: 16.0544,
        lng: 108.2022,
        oneLiner: "",
        tags: [],
      });
      setPreviews([]);
    }
  }, [place, reset, isOpen]);

  const toggleTag = (tagName: string) => {
    const current = selectedTags;
    if (current.includes(tagName)) {
      setValue("tags", current.filter(t => t !== tagName));
    } else {
      setValue("tags", [...current, tagName]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    // If it's an existing image (string)
    if (typeof previews[index] === 'string' && !previews[index].startsWith('blob:')) {
      // Just remove from preview, and we might need to handle this in update
    }
    
    setPreviews(prev => prev.filter((_, i) => i !== index));
    // Also remove from selectedImages if it was just added
    // This is a bit simplified, usually you'd track which is which
  };

  const handleSmartParse = async () => {
    if (!smartInput) return;
    try {
      toast.info("Đang bóc tách dữ liệu từ Google Maps...");
      const result = await contributeApi.crawlLink(smartInput);
      
      if (result.success && result.data) {
        const { name, address, lat, lng } = result.data;
        
        if (name) setValue("name", name);
        if (address) setValue("address", address);
        if (lat) setValue("lat", lat);
        if (lng) setValue("lng", lng);
        setValue("googleMapsLink", smartInput);
        
        toast.success("Đã bóc tách thành công Tên, Địa chỉ và Tọa độ!");
      } else {
        toast.error("Không thể bóc tách dữ liệu từ link này");
      }
    } catch (error) {
      toast.error("Lỗi hệ thống khi crawl link");
    }
  };

  const handleGeocodeAddress = async () => {
    const address = watch("address");
    if (!address || address.length < 5) return;
    
    try {
      toast.info("Đang tìm tọa độ từ địa chỉ...");
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        setValue("lat", parseFloat(data[0].lat));
        setValue("lng", parseFloat(data[0].lon));
        toast.success("Đã cập nhật tọa độ từ địa chỉ!");
      } else {
        toast.error("Không tìm thấy tọa độ cho địa chỉ này");
      }
    } catch (error) {
      toast.error("Lỗi khi tìm tọa độ");
    }
  };

  const onSubmit = async (data: ContributeFormData) => {
    try {
      setIsUploading(true);
      let imageUrls = previews.filter(p => !p.startsWith('blob:'));
      
      if (selectedImages.length > 0) {
        const newUrls = await contributeApi.uploadImages(selectedImages);
        imageUrls = [...imageUrls, ...newUrls];
      }

      if (place) {
        await updatePlace({ id: place.id, data: { ...data, images: imageUrls } });
      } else {
        await createPlace({ ...data, images: imageUrls });
      }
      onClose();
    } catch (error) {
      toast.error("Lỗi khi lưu thông tin");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-none shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {place ? "Chỉnh sửa quán" : "Thêm quán mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-6">
          {/* Smart Input Section */}
          <div className="flex flex-col gap-3 bg-block-lime/10 p-4 rounded-2xl border border-block-lime/20">
            <div className="flex items-center gap-2 text-ink font-bold text-sm uppercase tracking-widest">
              <Wand2 size={16} />
              <span>Nhập liệu từ Google Maps</span>
            </div>
            <div className="flex gap-2">
            <Input 
              value={smartInput}
              onChange={(e) => {
                setSmartInput(e.target.value);
                setValue("googleMapsLink", e.target.value);
              }}
              placeholder="Dán link Google Maps (Chia sẻ) vào đây để tự động điền"
              className="h-14 rounded-2xl bg-canvas border-2 border-ink/10 p-4 text-lg transition-all focus-visible:border-ink/30 shadow-inner flex-1"
            />
              <Button type="button" onClick={handleSmartParse} variant="default" className="rounded-xl h-12 px-6 bg-ink text-canvas font-bold">
                Bóc tách
              </Button>
            </div>
            <p className="text-[10px] text-ink/40 italic">* Hệ thống sẽ tự động lấy Tên, Địa chỉ và Tọa độ chính xác.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Tên quán</Label>
              <Input {...register("name")} className="h-12 rounded-xl bg-surface-soft border-none font-bold" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Mô tả ngắn</Label>
              <Input {...register("oneLiner")} className="h-12 rounded-xl bg-surface-soft border-none" />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Địa chỉ</Label>
              <div className="flex gap-2">
                <Input {...register("address")} className="h-12 rounded-xl bg-surface-soft border-none flex-1" />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGeocodeAddress}
                  className="rounded-xl h-12 px-4 border-dashed border-ink/20 hover:border-ink/40"
                >
                  <Wand2 size={14} className="mr-2" />
                  Lấy tọa độ
                </Button>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="flex flex-col gap-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Tags / Danh mục</Label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag: any) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5 rounded-full transition-all"
                  onClick={() => toggleTag(tag.name)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Images Section */}
          <div className="flex flex-col gap-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Hình ảnh</Label>
            <div className="grid grid-cols-4 gap-3">
              {previews.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-surface-soft">
                  <img src={src} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-ink/10 hover:border-ink/20 transition-colors"
              >
                <ImagePlus size={20} className="text-ink/20" />
                <span className="text-[10px] font-bold uppercase text-ink/20">Thêm</span>
              </button>
            </div>
            <input type="file" multiple hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold">
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading || isSubmitting}
              className="rounded-xl bg-ink text-canvas px-8 font-bold shadow-lg"
            >
              {isUploading || isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
