import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Vui lòng nhập tài khoản hoặc email"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
