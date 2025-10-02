import { Hono } from "hono";
import "dotenv/config";
import db from "../../../db/index.js";
import * as schema from "../../../db/schema.js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import bcrypt from "bcrypt";
import { setCookie } from "hono/cookie";
import { sign } from "../../../middleware/auth.js";
import { resend } from "../../../emails/index.js";
import { OTPEmail } from "../../../emails/template/otp.js";

const app = new Hono();

const signupWithOrgSchema = z.object({
  email: z.email().transform((val) => val.trim().toLowerCase()),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  organization: z.object({
    name: z.string().min(1),
  }),
});

export const POST = app.post(
  "/auth/signup-with-organization",
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
    setCookie(c, "token", token, {
      path: "/",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });
    return c.json({ token });
  }
);
