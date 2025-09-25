import type { Hono } from "hono";
import "dotenv/config";
import db from "../../db/index.js";
import * as schema from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default function registerChatPost(app: Hono) {
  app.post("/", async (c) => {

  });

  app.post("/:id", async (c) => {
  });
}