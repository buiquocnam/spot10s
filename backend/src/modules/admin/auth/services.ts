import { db } from "../../../db";
import { admins } from "../../../db/schema";
import { sql } from "drizzle-orm";

export const authService = {
  async getAdminByIdentifier(identifier: string) {
    const result = await db
      .select()
      .from(admins)
      .where(
        sql`${admins.username} = ${identifier} OR ${admins.email} = ${identifier}`
      )
      .limit(1);
    return result[0];
  },

  async createAdmin(username: string, email: string, passwordHash: string) {
    return await db.insert(admins).values({
      username,
      email,
      passwordHash,
    }).returning();
  }
};
