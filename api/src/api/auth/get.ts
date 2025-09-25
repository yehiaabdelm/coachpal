import type { Hono } from "hono";
import db from "../../db/index.js";
import * as schema from "../../db/schema.js";
import { eq, and, desc } from "drizzle-orm";

export default function registerChatGet(app: Hono) {
  app.get("/", async (c) => {
  });
}
