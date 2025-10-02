import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js"
import pg from "pg";


const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default drizzle(pool, { schema, casing: "snake_case" });