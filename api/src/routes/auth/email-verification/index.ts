import { Hono } from "hono";
import "dotenv/config";
import db from "../../../db/index.js";
import * as schema from "../../../db/schema.js";
import { eq, and } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { jwtAuth } from "../../../middleware/auth.js";

const emailVerificationSchema = z.object({
  code: z.string().length(6),
});

const app = new Hono();

export const POST = app.post("/auth/email-verification", jwtAuth, zValidator("json", emailVerificationSchema), async (c) => {
      const body = c.req.valid("json");
      const user = c.get("user");
      const verificationCode = await db.query.verificationCodes.findFirst({
        where: and(
          eq(schema.verificationCodes.code, body.code),
          eq(schema.verificationCodes.userId, user.id),
          eq(schema.verificationCodes.type, "email")
        ),
      });

      if (!verificationCode) {
        return c.json(
          {
            message: "Incorrect verification code.",
          },
          404
        );
      } else if (
        verificationCode.expiresAt &&
        new Date(verificationCode.expiresAt) < new Date()
      ) {
        return c.json(
          {
            message: "Code has expired.",
          },
          400
        );
      } else if (verificationCode.consumedAt) {
        return c.json(
          {
            message: "Code already used.",
          },
          400
        );
      }

      await db.transaction(async (tx) => {
        await tx
          .update(schema.users)
          .set({ emailVerifiedAt: new Date() })
          .where(eq(schema.users.id, user.id));
        await db
          .update(schema.verificationCodes)
          .set({ consumedAt: new Date() })
          .where(eq(schema.verificationCodes.id, verificationCode.id));
      });

      return c.json({ message: "Email verified" });
});

