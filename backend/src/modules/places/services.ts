import { db } from "../../db";
import { places, reviews } from "../../db/schema";
import { eq, sql, and, desc, getTableColumns } from "drizzle-orm";

export const placesService = {
  // Lấy tất cả quán (có lọc status nếu cần)
  async getAllPlaces(status?: string) {
    const query = db.select().from(places);
    if (status) {
      return await query.where(eq(places.status, status));
    }
    return await query;
  },

  // Lấy chi tiết một quán
  getPlaceById: async (id: string, lat?: number, lng?: number) => {
    let query;
    if (lat !== undefined && lng !== undefined) {
      query = db.select({
        ...getTableColumns(places),
        distance: sql<number>`ST_Distance(
          ${places.location},
          ST_SetSRID(ST_Point(${lng}, ${lat}), 4326)
        ) * 111320`
      })
      .from(places)
      .where(eq(places.id, id));
    } else {
      query = db.select().from(places).where(eq(places.id, id));
    }

    const place = await query;
    if (!place[0]) return null;
    
    const placeReviews = await db.select().from(reviews).where(eq(reviews.placeId, id)).orderBy(desc(reviews.createdAt));
    
    return {
      ...place[0],
      reviews: placeReviews
    };
  },

  // Lấy danh sách quán kèm tính khoảng cách bằng PostGIS
  async getNearbyPlaces(userLat: number, userLng: number, limit = 20) {
    const distanceSql = sql<number>`ST_DistanceSphere(
      location, 
      ST_GeomFromText(${`POINT(${userLng} ${userLat})`}, 4326)
    )`;

    return await db
      .select({
        id: places.id,
        name: places.name,
        address: places.address,
        lat: places.lat,
        lng: places.lng,
        tags: places.tags,
        rating: places.rating,
        priceRange: places.priceRange,
        openHours: places.openHours,
        oneLiner: places.oneLiner,
        images: places.images,
        distance: distanceSql,
      })
      .from(places)
      .where(eq(places.status, "published"))
      .orderBy(distanceSql)
      .limit(limit);
  },

  // Tạo địa điểm mới (đóng góp)
  async contributePlace(data: any) {
    return await db.insert(places).values({
      ...data,
      location: [data.lng, data.lat], 
      status: "pending",
    }).returning();
  }
};
