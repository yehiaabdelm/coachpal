import type { Context, MiddlewareHandler, Next } from "hono";
import { jwt, type JwtVariables, sign as honoSign, verify } from "hono/jwt";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import db from "../db/index.js";
import * as schema from "../db/schema.js";
import { eq, and } from "drizzle-orm";

type AppUser = { id: string; email: string };

type Variables = JwtVariables & {
  user: AppUser;
};

type OrgVariables = Variables & {
  organization: {
    id: string;
    role: string;
  };
};

const ISSUER = process.env.APP_ISSUER ?? "healthchat"; // optional but nice

export const jwtAuth = createMiddleware<{ Variables: Variables }>(
  async (c, next) => {
    const cookieName = "token";
    const cookie = getCookie(c, cookieName);

    const jwtMiddleware = jwt({
      secret: process.env.JWT_SECRET as string,
      cookie: cookie ? cookieName : undefined,
    });

    await jwtMiddleware(c, async () => {
      const payload = c.get("jwtPayload") as AppUser | undefined;

      if (!payload) {
        return;
      }

      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, payload.id),
      });

      if (!user) {
        return;
      }

      c.set("user", {
        id: user.id,
        email: user.email,
      });

      await next();
    });

    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  }
);

export const orgAuth = createMiddleware<{ Variables: OrgVariables }>(
  async (c, next) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const orgId = getCookie(c, "org_id");
    if (!orgId) {
      return c.json({ message: "Missing org id" }, 400);
    }

    const membership = await db.query.userOrganization.findFirst({
      where: and(
        eq(schema.userOrganization.userId, user.id),
        eq(schema.userOrganization.organizationId, orgId)
      ),
    });

    if (!membership) {
      return c.json({ message: "Forbidden" }, 403);
    }

    c.set("organization", {
      id: membership.organizationId,
      role: membership.role,
    });
    await next();
  }
);

// export const orgAuth = createMiddleware();
export async function sign(user: AppUser, ttlSeconds = 60 * 60 * 24 * 30) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    id: user.id,
    email: user.email,
    iat: now,
    exp: now + ttlSeconds,
    iss: ISSUER,
  };
  return await honoSign(payload, process.env.JWT_SECRET as string); // HS256 default
}
