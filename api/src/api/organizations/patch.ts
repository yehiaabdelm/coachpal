import type { Hono } from "hono";
import "dotenv/config";
import db from "../../db/index.js";
import * as schema from "../../db/schema.js";
import { eq, and, or } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import bcrypt from "bcrypt";
import { setCookie } from "hono/cookie";
import { jwtAuth, sign } from "../../middleware/auth.js";

export default function registerOrganizationPatch(app: Hono) {
  app.patch("/team", jwtAuth, async (c) => {
    return c.json({ success: true });
  });
}
