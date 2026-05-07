import { db } from "../db/index";
import { places, reviews } from "../db/schema";

const CAFE_DATA = [
  {
    name: 'The Barn Coffee & Eatery',
    address: '189 Nguyễn Chí Thanh, Đà Nẵng',
    oneLiner: 'Không gian công xưởng hiện đại, cà phê đặc sản.',
    lat: 16.0648,
    lng: 108.2215,
    rating: 4.8,
    tags: ['specialty', 'work-friendly', 'modern'],
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1000',
    priceRange: '45.000đ - 95.000đ',
    openHours: '07:30 - 22:30',
  },
  {
    name: 'Reply 1988 Cafe',
    address: '20 Lê Hồng Phong, Đà Nẵng',
    oneLiner: 'Phong cách retro Hàn Quốc, cực kỳ hút mắt.',
    lat: 16.0617,
    lng: 108.2223,
    rating: 4.6,
    tags: ['retro', 'korean', 'cozy'],
    imageUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec41b501?auto=format&fit=crop&q=80&w=1000',
    priceRange: '35.000đ - 65.000đ',
    openHours: '08:00 - 22:00',
  },
  {
    name: 'Wonderlust Danang',
    address: '96 Trần Phú, Đà Nẵng',
    oneLiner: 'Khu phức hợp cafe & shopping phong cách tối giản.',
    lat: 16.0683,
    lng: 108.2232,
    rating: 4.7,
    tags: ['minimalist', 'shopping', 'aesthetic'],
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000',
    priceRange: '40.000đ - 80.000đ',
    openHours: '07:00 - 23:00',
  },
  {
    name: '43 Factory Coffee Roaster',
    address: 'Lot 422 Ngô Thì Sỹ, Đà Nẵng',
    oneLiner: 'Trải nghiệm cà phê nguyên bản trong không gian kính.',
    lat: 16.0465,
    lng: 108.2455,
    rating: 4.9,
    tags: ['roastery', 'glass-house', 'premium'],
    imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d744264?auto=format&fit=crop&q=80&w=1000',
    priceRange: '60.000đ - 150.000đ',
    openHours: '08:00 - 22:00',
  },
  {
    name: 'Boulevard Gelato & Coffee',
    address: '77 Trần Quốc Toản, Đà Nẵng',
    oneLiner: 'Sự kết hợp hoàn hảo giữa kem Ý và cà phê.',
    lat: 16.0664,
    lng: 108.2229,
    rating: 4.5,
    tags: ['gelato', 'dessert', 'european'],
    imageUrl: 'https://images.unsplash.com/photo-1551887196-72e32aff7af0?auto=format&fit=crop&q=80&w=1000',
    priceRange: '30.000đ - 70.000đ',
    openHours: '07:30 - 22:00',
  },
];

async function seedPlaces() {
  console.log("🌱 Đang làm sạch và nhập dữ liệu quán cafe mới...");

  try {
    // Xóa dữ liệu cũ để tránh trùng lặp và cập nhật tọa độ mới
    await db.delete(reviews);
    await db.delete(places);
    for (const data of CAFE_DATA) {
      const [insertedPlace] = await db.insert(places).values({
        name: data.name,
        address: data.address,
        oneLiner: data.oneLiner,
        lat: data.lat,
        lng: data.lng,
        location: [data.lng, data.lat],
        rating: data.rating,
        tags: data.tags,
        images: [data.imageUrl], // Chuyển ảnh đơn lẻ vào mảng images
        priceRange: data.priceRange,
        openHours: data.openHours,
        status: 'published', 
      }).returning();
      
      if (!insertedPlace) continue;

      // Thêm đánh giá mẫu
      await db.insert(reviews).values([
        {
          placeId: insertedPlace.id,
          rating: 5,
          author: "Nam Bùi",
          comment: "Cà phê ngon, không gian cực kỳ chill và yên tĩnh cho ai muốn làm việc.",
        },
        {
          placeId: insertedPlace.id,
          rating: 4,
          author: "Minh Thu",
          comment: "Quán đẹp, decor xịn xò nhưng cuối tuần hơi đông.",
        }
      ]);

      console.log(`✅ Đã thêm: ${data.name} kèm đánh giá mẫu`);
    }

    console.log("✨ Hoàn tất! Bản đồ của bạn đã có dữ liệu thật.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi nhập dữ liệu:", error);
    process.exit(1);
  }
}

seedPlaces();
