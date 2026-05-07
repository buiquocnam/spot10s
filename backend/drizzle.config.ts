import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Thêm cái này để Drizzle không đòi xóa các bảng hệ thống của PostGIS
  tablesFilter: ["admins", "places", "tags", "reviews"],
});
