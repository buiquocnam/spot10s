import { db } from "../../../db";
import { places } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const placesAdminService = {
  async approvePlace(id: string) {
    return await db.update(places)
      .set({ status: 'published' })
      .where(eq(places.id, id));
  },

  async createPlace(data: any) {
    return await db.insert(places).values({
      ...data,
      location: [data.lng, data.lat],
      status: data.status || 'published',
    }).returning();
  },

  async updatePlace(id: string, data: any) {
    const updateData = { ...data };
    if (data.lat !== undefined && data.lng !== undefined) {
      updateData.location = [data.lng, data.lat];
    }
    return await db.update(places)
      .set(updateData)
      .where(eq(places.id, id))
      .returning();
  },

  async deletePlace(id: string) {
    return await db.delete(places)
      .where(eq(places.id, id));
  }
};
