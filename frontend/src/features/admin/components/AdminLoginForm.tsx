"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useState } from "react";
import { loginSchema, LoginFormData } from "../lib/schema";
import { useAdminAuth } from "../hooks/useAdmin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminLoginForm() {
  const { login, isLoggingIn } = useAdminAuth();
  const [loginError, setLoginError] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    setLoginError(false);
    login(data, {
      onError: () => {
        setLoginError(true);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-serif font-medium">Quản trị viên</h1>
          <p className="text-ink/40 text-sm tracking-wide uppercase font-bold">Vui lòng đăng nhập để tiếp tục</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Tài khoản hoặc Email</Label>
            <Input
              {...register("identifier")}
              className="h-12 border-b border-ink/10 focus-visible:border-ink rounded-none bg-transparent px-0"
            />
            {errors.identifier && <p className="text-xs text-red-500 font-bold">{errors.identifier.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Mật khẩu</Label>
            <Input
              type="password"
              {...register("password")}
              className="h-12 border-b border-ink/10 focus-visible:border-ink rounded-none bg-transparent px-0"
            />
            {errors.password && <p className="text-xs text-red-500 font-bold">{errors.password.message}</p>}
          </div>

          {/* General Login Error */}
          {loginError && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 font-bold text-center bg-red-50 p-2 rounded-lg border border-red-100"
            >
              * Sai mật khẩu hoặc tài khoản không tồn tại
            </motion.p>
          )}

          <Button 
            type="submit" 
            disabled={isLoggingIn}
            className="mt-4 h-14 w-full rounded-2xl bg-ink text-lg font-bold text-canvas shadow-2xl transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoggingIn ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-canvas border-t-transparent" />
                Đang xử lý...
              </div>
            ) : (
              "Đăng nhập hệ thống"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
