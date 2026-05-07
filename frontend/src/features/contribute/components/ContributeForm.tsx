"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, ImagePlus, X, Wand2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useContribute } from "../hooks/useContribute";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contributeSchema, ContributeFormData } from "../lib/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { contributeApi } from "../api/contribute.api";

export default function ContributeForm() {
  const router = useRouter();
  const contributeMutation = useContribute();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [smartInput, setSmartInput] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContributeFormData>({
    resolver: zodResolver(contributeSchema),
    defaultValues: {
      lat: 16.0544,
      lng: 108.2022,
    },
  });

  const handleSmartParse = async () => {
    if (!smartInput) return;
    
    try {
      toast.info("Đang bóc tách dữ liệu...");
      const result = await contributeApi.crawlLink(smartInput);
      
      if (result.success && result.data) {
        const { name, address, lat, lng } = result.data;
        
        if (name) setValue("name", name);
        if (address) setValue("address", address);
        if (lat) setValue("lat", lat);
        if (lng) setValue("lng", lng);
        setValue("googleMapsLink", smartInput);
        
        toast.success("Tuyệt vời! Đã tự động lấy thông tin từ link.");
      } else {
        toast.error("Không thể bóc tách dữ liệu từ link này. Hãy thử dán link Chia sẻ nhé!");
      }
    } catch (error) {
      toast.error("Lỗi khi bóc tách link");
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
        toast.success("Đã tìm thấy tọa độ địa điểm!");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
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
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ContributeFormData) => {
    setIsUploading(true);
    try {
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        imageUrls = await contributeApi.uploadImages(selectedImages);
      }
      await contributeMutation.mutateAsync({
        ...data,
        images: imageUrls,
      });
      toast.success("Tuyệt vời! Quán đã được gửi cho Admin duyệt.");
      router.push("/");
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng kiểm tra lại kết nối.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-[60] flex flex-col bg-block-cream overflow-y-auto"
    >
      <div className="sticky top-0 z-10 flex h-[56px] items-center gap-4 bg-block-cream/80 px-4 backdrop-blur-md">
        <Button 
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft size={20} />
        </Button>
        <span className="font-bold">Đóng góp quán mới</span>
      </div>

      <div className="flex flex-col gap-8 p-6 max-w-2xl mx-auto w-full pb-32">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tighter leading-tight">
            Chia sẻ quán cafe <br /> mà bạn yêu thích.
          </h1>
          <p className="text-ink/60 font-medium">Chúng mình sẽ duyệt và đưa lên bản đồ sớm nhất.</p>
        </div>

        <Card className="rounded-3xl border-2 border-black/5 shadow-sm overflow-hidden">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Wand2 size={20} />
              <span>Nhập liệu thông minh</span>
            </div>
            <p className="text-sm text-ink/60">Dán link Google Maps vào đây để tự động lấy tọa độ và địa chỉ.</p>
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
              <Button 
                type="button"
                onClick={handleSmartParse}
                className="h-12 rounded-xl bg-ink px-6 text-canvas font-bold transition-transform active:scale-95"
              >
                Bóc tách
              </Button>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-bold uppercase tracking-widest text-ink/40">Tên quán</Label>
              <Input 
                {...register("name")}
                placeholder="VD: The Workshop Coffee"
                className="h-14 rounded-2xl bg-white border-2 border-transparent focus-visible:border-ink p-4 text-lg font-bold transition-all shadow-sm"
              />
              {errors.name && <p className="text-xs text-red-500 font-bold">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-bold uppercase tracking-widest text-ink/40">Mô tả ngắn</Label>
              <Input 
                {...register("oneLiner")}
                placeholder="VD: View hồ siêu chill..."
                className="h-14 rounded-2xl bg-white border-2 border-transparent focus-visible:border-ink p-4 text-lg font-bold transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-bold uppercase tracking-widest text-ink/40">Địa chỉ</Label>
              <div className="flex gap-2">
                <Input 
                  {...register("address")}
                  onBlur={handleGeocodeAddress}
                  placeholder="Địa chỉ hoặc bóc tách từ link"
                  className="h-14 rounded-2xl bg-white border-2 border-transparent focus-visible:border-ink p-4 text-lg font-bold transition-all shadow-sm flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleGeocodeAddress}
                  className="h-14 rounded-2xl bg-canvas border-2 border-ink/10 text-ink px-4 font-bold"
                >
                  <Wand2 size={20} />
                </Button>
              </div>
              {errors.address && <p className="text-xs text-red-500 font-bold">{errors.address.message}</p>}
            </div>

            <div className="flex flex-col gap-4">
              <Label className="text-sm font-bold uppercase tracking-widest text-ink/40">Hình ảnh (Nhiều ảnh)</Label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <AnimatePresence>
                  {previews.map((src, idx) => (
                    <motion.div 
                      key={src}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm"
                    >
                      <img src={src} className="h-full w-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 backdrop-blur-sm"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-ink/20 hover:border-ink/40 transition-colors"
                >
                  <ImagePlus size={24} className="text-ink/40" />
                  <span className="text-[10px] font-bold uppercase text-ink/40">Thêm ảnh</span>
                </button>
              </div>
              <input type="file" multiple hidden ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
            </div>
          </div>

          <Button 
            type="submit"
            disabled={isUploading || contributeMutation.isPending}
            className="w-full h-[72px] rounded-full bg-ink text-canvas text-xl font-bold shadow-2xl transition-all active:scale-95 disabled:opacity-50"
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                Đang xử lý ảnh...
              </span>
            ) : (
              <>
                <Send size={24} className="mr-2" />
                Gửi đóng góp ngay
              </>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
