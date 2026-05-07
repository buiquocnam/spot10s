import { db } from "../db";
import { admins } from "../db/schema";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

async function seed() {
  console.log("🌱 Đang tạo tài khoản Admin mặc định...");
  
  const passwordHash = await bcrypt.hash("admin123", 10);
  
  try {
    await db.insert(admins).values({
      username: "admin",
      email: "admin@cafe10s.com",
      passwordHash: passwordHash,
    });
    console.log("✅ Đã tạo Admin: admin / admin123");
  } catch (error) {
    console.log("ℹ️ Admin đã tồn tại hoặc có lỗi xảy ra.");
  }
  
  process.exit();
}

seed();
