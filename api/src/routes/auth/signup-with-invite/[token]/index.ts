import { Hono } from "hono";
import "dotenv/config";
import db from "../../../../db/index.js";
import * as schema from "../../../../db/schema.js";
import { eq, and } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import bcrypt from "bcrypt";
import { setCookie } from "hono/cookie";
import { sign } from "../../../../middleware/auth.js";

const app = new Hono();

const signupWithInviteSchema = z.object({
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const POST = app.post(
  "/auth/signup-with-invite/:token",
  zValidator("json", signupWithInviteSchema),
  async (c) => {
    const token = c.req.param("token");
    const { firstName, lastName, password } = c.req.valid("json");

    const invite = await db.query.invitations.findFirst({
      where: eq(schema.invitations.token, token),
    });

    if (!invite) {
      return c.json(
        {
          message:
            "This invite doesn't exist. Ask your administrator for a new one.",
        },
        404
      );
    }

    if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
      return c.json(
        {
          message:
            "This invite has expired. Ask your administrator for a new one.",
        },
        410
      );
    }

    if (invite.acceptedAt) {
      return c.json(
        {
          message:
            "This invite has already been used. You may need to log in instead.",
        },
        410
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(schema.users)
        .values({
          firstName,
          lastName,
          email: invite.email,
          hashedPassword,
          // No need to verify email in this case
          emailVerifiedAt: new Date(),
        })
        .returning({ id: schema.users.id, email: schema.users.email });
      if (invite.type === "organization") {
        await tx.insert(schema.userOrganization).values({
          userId: user.id,
          organizationId: invite.organizationId,
          role: invite.role as string,
        });
      } else if (invite.type === "athlete") {
        await tx.insert(schema.coachAthlete).values({
          coachUserId: invite.invitedByUserId,
          athleteUserId: user.id,
          organizationId: invite.organizationId,
        });
      }
      await tx
        .update(schema.invitations)
        .set({
          acceptedByUserId: user.id,
          status: "accepted",
          acceptedAt: new Date(),
        })
        .where(eq(schema.invitations.token, token));
      return user;
    });

    const authToken = await sign(user);
    setCookie(c, "token", authToken);
    return c.json({ token: authToken });
  }
);
