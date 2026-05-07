import { db } from "../db";
import { sql } from "drizzle-orm";

async function checkTables() {
  const result = await db.execute(sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
  console.log("Tables:", result.rows);
  process.exit(0);
}

checkTables();
