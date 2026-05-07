import { z } from "zod";

export const contributeSchema = z.object({
  name: z.string().min(2, "Tên quán phải có ít nhất 2 ký tự"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  oneLiner: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  googleMapsLink: z.string().optional(),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type ContributeFormData = z.infer<typeof contributeSchema>;
