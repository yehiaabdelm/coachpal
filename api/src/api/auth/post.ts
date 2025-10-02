import type { Hono } from "hono";
import "dotenv/config";
import db from "../../db/index.js";
import * as schema from "../../db/schema.js";
import { eq, and } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import bcrypt from "bcrypt";
import { setCookie } from "hono/cookie";
import { jwtAuth, sign } from "../../middleware/auth.js";
import { resend } from "../../emails/index.js";
import { OTPEmail } from "../../emails/template/otp.js";

const signupWithOrgSchema = z.object({
  email: z.email().transform((val) => val.trim().toLowerCase()),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  organization: z.object({
    name: z.string().min(1),
  }),
});

const signupWithInviteSchema = z.object({
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.email().transform((val) => val.trim().toLowerCase()),
  password: z.string().min(8),
});

const emailVerificationSchema = z.object({
  code: z.string().length(6),
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
    "/email-verification",
    zValidator("json", emailVerificationSchema),
    jwtAuth,
    async (c) => {
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
    }
  );

  app.post(
    "/signup-with-invite/:token",
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

  app.post(
    "/signup-with-organization",
    zValidator("json", signupWithOrgSchema),
    async (c) => {
      const body = c.req.valid("json");
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const { user, verificationCode } = await db.transaction(async (tx) => {
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
        const code = String(Math.floor(100000 + Math.random() * 900000));
        const [verificationCode] = await tx
          .insert(schema.verificationCodes)
          .values({
            userId: user.id,
            type: "email",
            code,
            expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
          })
          .returning();
        return { user, verificationCode };
      });

      await resend.emails.send({
        from: "CoachPal <noreply@coachpal.app>",
        to: user.email,
        subject: "Verify your email",
        react: await OTPEmail({ otp: verificationCode.code }),
      });

      // send email verification email
      const token = await sign(user);
      setCookie(c, "token", token);
      return c.json({ token });
    }
  );
}
