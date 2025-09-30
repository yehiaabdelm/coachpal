import type { Hono } from "hono";
import "dotenv/config";
import db from "../../db/index.js";
import * as schema from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import bcrypt from "bcrypt";
import { setCookie } from "hono/cookie";
import { jwtAuth, sign } from "../../middleware/auth.js";

const signupWithOrgSchema = z.object({
  email: z.email().transform((val) => val.trim().toLowerCase()),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  organization: z.object({
    name: z.string().min(1),
  }),
});

export default function registerInvitationsPost(app: Hono) {
  app.post(
    "/create-invite",
    zValidator("json", signupWithOrgSchema),
    async (c) => {}
  );
}
