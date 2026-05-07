import { pgTable, uuid, varchar, text, timestamp, integer, doublePrecision, customType } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Khởi tạo Custom Type cho PostGIS Geometry (Point)
const geometry = customType<{ data: [number, number]; driverData: string }>({
  dataType() {
    return 'geometry(Point, 4326)';
  },
  toDriver(value: [number, number]): string {
    // Trả về định dạng EWKT chuẩn cho PostGIS
    return `SRID=4326;POINT(${value[0]} ${value[1]})`;
  },
  fromDriver(value: any): [number, number] {
    // PostGIS trả về định dạng WKB (Hex string) khi select trực tiếp.
    // Vì chúng ta đã có cột lat/lng riêng để hiển thị, nên hàm này có thể trả về giá trị mặc định 
    // hoặc xử lý nếu cần thiết. Ở đây trả về mặc định để tránh crash.
    return [0, 0];
  },
});

export const places = pgTable("places", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  location: geometry("location"), // Dùng để query không gian (PostGIS)
  address: text("address").notNull(),
  plusCode: varchar("plus_code", { length: 50 }),
  tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
  priceRange: varchar("price_range", { length: 50 }),
  rating: doublePrecision("rating").default(0),
  oneLiner: varchar("one_liner", { length: 255 }),
  openHours: varchar("open_hours", { length: 100 }),
  status: varchar("status", { length: 20 }).notNull().default('pending'), // 'pending', 'published', 'rejected'
  contributedBy: varchar("contributed_by", { length: 100 }),
  popularity: integer("popularity").default(0),
  images: text("images").array().notNull().default(sql`'{}'::text[]`),
  googleMapsLink: text("google_maps_link"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const admins = pgTable("admins", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  placeId: uuid("place_id").references(() => places.id, { onDelete: 'cascade' }).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  author: varchar("author", { length: 100 }).default('Người dùng ẩn danh'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
