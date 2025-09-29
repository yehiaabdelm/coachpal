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

const loginSchema = z.object({
  email: z.email().transform((val) => val.trim().toLowerCase()),
  password: z.string().min(8),
});

const verifyEmailSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

export default function registerChatPost(app: Hono) {
  app.post("/login", zValidator("json", loginSchema), async (c) => {
    const body = c.req.valid("json");
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, body.email),
    });
    if (user) {
      const compare = await bcrypt.compare(body.password, user.hashedPassword);
      if (compare) {
        const token = await sign({ id: user.id, email: user.email });
        setCookie(c, "token", token);
        return c.json({ token });
      }
    }
    return c.json({ message: "Wrong email or password" }, 401);
  });

  app.post(
    "/verify-email",
    zValidator("json", verifyEmailSchema),
    async (c) => {
      const body = c.req.valid("json");
      // return cookie
    }
  );

  app.post(
    "/signup-with-invite",
    zValidator("json", loginSchema),
    async (c) => {
      const body = c.req.valid("json");
      // return cookie
      // redirect to email verification
    }
  );

  app.post(
    "/signup-with-organization",
    zValidator("json", signupWithOrgSchema),
    async (c) => {
      const body = c.req.valid("json");
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const user = await db.transaction(async (tx) => {
        const [org] = await tx
          .insert(schema.organizations)
          .values({
            name: body.organization.name,
          })
          .returning({ id: schema.organizations.id });
        const [user] = await tx
          .insert(schema.users)
          .values({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            hashedPassword,
          })
          .returning({ id: schema.users.id, email: schema.users.email });
        await tx.insert(schema.userOrganization).values({
          organizationId: org.id,
          userId: user.id,
          role: "owner",
        });
        return user;
      });
      // send email verification email
      // redirect to email verification
      // await db.
      const token = await sign(user);
      setCookie(c, "token", token);
      return c.json({ token });
    }
  );
  app.post("/me", jwtAuth(), async (c) => {});
}
