import { db } from "../db/index";
import { places, reviews } from "../db/schema";

const ALL_PLACES = [
  // --- CAFE & WORK ---
  {
    name: 'The Barn Coffee & Eatery',
    address: '189 Nguyễn Chí Thanh, Đà Nẵng',
    oneLiner: 'Không gian công xưởng hiện đại, cà phê đặc sản.',
    lat: 16.0648,
    lng: 108.2215,
    rating: 4.8,
    tags: ['cafe', 'specialty', 'work', 'modern'],
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
    tags: ['cafe', 'retro', 'korean', 'cozy'],
    imageUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec41b501?auto=format&fit=crop&q=80&w=1000',
    priceRange: '35.000đ - 65.000đ',
    openHours: '08:00 - 22:00',
  },
  {
    name: '43 Factory Coffee Roaster',
    address: 'Lot 422 Ngô Thì Sỹ, Đà Nẵng',
    oneLiner: 'Trải nghiệm cà phê nguyên bản trong không gian kính.',
    lat: 16.0465,
    lng: 108.2455,
    rating: 4.9,
    tags: ['cafe', 'roastery', 'glass-house', 'premium'],
    imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d744264?auto=format&fit=crop&q=80&w=1000',
    priceRange: '60.000đ - 150.000đ',
    openHours: '08:00 - 22:00',
  },

  // --- FOOD ---
  {
    name: 'Bánh Xèo Bà Dưỡng',
    address: 'K280/23 Hoàng Diệu, Đà Nẵng',
    oneLiner: 'Địa điểm bánh xèo nổi tiếng nhất Đà Nẵng.',
    lat: 16.0594,
    lng: 108.2162,
    rating: 4.3,
    tags: ['food', 'local', 'traditional'],
    imageUrl: 'https://images.unsplash.com/photo-1583032015879-e50d2320ca38?auto=format&fit=crop&q=80&w=1000',
    priceRange: '20.000đ - 50.000đ',
    openHours: '09:00 - 21:30',
  },
  {
    name: 'Mì Quảng Bà Mua',
    address: '95A Nguyễn Tri Phương, Đà Nẵng',
    oneLiner: 'Mì Quảng chuẩn vị với nhiều loại topping.',
    lat: 16.0712,
    lng: 108.2235,
    rating: 4.4,
    tags: ['food', 'local', 'mi-quang'],
    imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=1000',
    priceRange: '30.000đ - 55.000đ',
    openHours: '06:30 - 21:30',
  },

  // --- DATE ---
  {
    name: 'The Top Bar - À La Carte',
    address: 'Tầng 23, 200 Võ Nguyên Giáp, Đà Nẵng',
    oneLiner: 'Tầm nhìn vô cực bao trọn bãi biển Mỹ Khê.',
    lat: 16.0695,
    lng: 108.2465,
    rating: 4.6,
    tags: ['date', 'cafe', 'rooftop', 'view'],
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000',
    priceRange: '100.000đ - 500.000đ',
    openHours: '07:00 - 23:00',
  },
  {
    name: 'Le Rendez Vous',
    address: '20 Lý Thường Kiệt, Đà Nẵng',
    oneLiner: 'Nhà hàng Pháp lãng mạn cho những buổi tối đặc biệt.',
    lat: 16.0754,
    lng: 108.2212,
    rating: 4.8,
    tags: ['date', 'food', 'french', 'romantic'],
    imageUrl: 'https://images.unsplash.com/photo-1550966841-3ee7adac1668?auto=format&fit=crop&q=80&w=1000',
    priceRange: '200.000đ - 1.000.000đ',
    openHours: '11:30 - 22:30',
  }
];

async function seedPlaces() {
  console.log("🌱 Đang làm sạch và nhập dữ liệu Spot 10S mới...");

  try {
    // Xóa dữ liệu cũ
    await db.delete(reviews);
    await db.delete(places);
    
    for (const data of ALL_PLACES) {
      const [insertedPlace] = await db.insert(places).values({
        name: data.name,
        address: data.address,
        oneLiner: data.oneLiner,
        lat: data.lat,
        lng: data.lng,
        location: [data.lng, data.lat],
        rating: data.rating,
        tags: data.tags,
        images: [data.imageUrl],
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
          comment: "Chất lượng tuyệt vời, đúng phong cách Spot 10S!",
        }
      ]);

      console.log(`✅ Đã thêm: ${data.name}`);
    }

    console.log("✨ Hoàn tất! Hệ thống đã có dữ liệu mẫu phong phú.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi nhập dữ liệu:", error);
    process.exit(1);
  }
}

seedPlaces();
