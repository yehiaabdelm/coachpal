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

export default function registerOrganizationPost(app: Hono) {
  app.post("/organization/:id/select", jwtAuth, async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");

    const userOrg = await db.query.userOrganization.findFirst({
      where: and(
        eq(schema.users.id, user.id),
        eq(schema.userOrganization.organizationId, id)
      ),
    });

    if (!userOrg) {
      return c.json({ message: "Unauthorized" }, 401);
    }
    
    setCookie(c, "org_id", id, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: false,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "prod",
      path: "/",
    });

    return c.json({ success: true });
  });
}
