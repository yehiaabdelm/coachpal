import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { Handler } from "hono";
import { z } from "zod";
import bcrypt from "bcrypt";
import { setCookie } from "hono/cookie";
import db from "../../../db/index.js";
import * as schema from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { sign } from "../../../middleware/auth.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const app = new Hono();

export const middleware = [zValidator("json", loginSchema)];

export const POST = app.post("/auth/login", ...middleware, async (c) => {
  const body = c.req.valid("json");

  const user = await db.query.users.findFirst({
    where: eq(schema.users.email, body.email),
  });

  if (user) {
    const compare = await bcrypt.compare(body.password, user.hashedPassword);
    if (compare) {
      const token = await sign({ id: user.id, email: user.email });
      setCookie(c, "token", token, {
        path: "/",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
      });
      return c.json({ token });
    }
  }

  return c.json({ message: "Wrong email or password" }, 401);
});
