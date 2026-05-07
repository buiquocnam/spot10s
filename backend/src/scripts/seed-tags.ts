import { db } from "../db";
import { tags } from "../db/schema";

const initialTags = [
  "💑 Đi date",
  "👫 Bạn bè",
  "🌙 Chill tối",
  "💻 Làm việc",
  "☕ Cafe",
  "🍰 Bánh ngọt",
  "🍃 Yên tĩnh",
  "📸 Check-in",
  "🐶 Thú cưng",
  "🧊 Điều hòa",
  "🌳 Ngoài trời"
];

async function seedTags() {
  console.log("🚀 Đang seed tags...");
  
  for (const tagName of initialTags) {
    try {
      await db.insert(tags).values({ name: tagName }).onConflictDoNothing();
    } catch (e) {
      console.error(`Lỗi khi seed tag ${tagName}:`, e);
    }
  }

  console.log("✅ Hoàn tất seed tags.");
  process.exit(0);
}

seedTags();
