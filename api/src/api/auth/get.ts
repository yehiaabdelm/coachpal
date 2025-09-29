import type { Hono } from "hono";
import db from "../../db/index.js";
import * as schema from "../../db/schema.js";
import { eq, and, desc } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";


export default function registerChatGet(app: Hono) {
  app.get("/invite/:token", async (c) => {
    const token = c.req.param("token");
    const invite = await db.query.invitations.findFirst({
      where: eq(schema.invitations.token, token),
      with: {
        
      }
    });
    return c.json(invite)
  });
}
