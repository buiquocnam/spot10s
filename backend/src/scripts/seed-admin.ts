import { db } from "../db";
import { admins } from "../db/schema";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  console.log("🚀 Đang tạo tài khoản Admin...");
  const passwordHash = await bcrypt.hash("admin123", 10);
  
  await db.insert(admins).values({
    username: "admin",
    email: "admin@cafe10s.com",
    passwordHash: passwordHash,
  }).onConflictDoUpdate({
    target: admins.username,
    set: { passwordHash: passwordHash }
  });

  console.log("✅ Đã tạo tài khoản Admin: admin / admin123");
  process.exit(0);
}

seedAdmin();
