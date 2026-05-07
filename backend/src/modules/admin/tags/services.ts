import { db } from "../../../db";
import { tags } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const tagsAdminService = {
  async getTags() {
    return await db.select().from(tags).orderBy(tags.name);
  },

  async createTag(name: string) {
    return await db.insert(tags).values({ name }).returning();
  },

  async deleteTag(id: string) {
    return await db.delete(tags).where(eq(tags.id, id));
  }
};
