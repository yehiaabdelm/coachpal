import type { Context, MiddlewareHandler, Next } from "hono";
import { jwt, type JwtVariables, sign as honoSign, verify } from "hono/jwt";
import { getCookie } from "hono/cookie";

type Variables = JwtVariables;
type AppUser = { id: string; email: string; };

const ISSUER = process.env.APP_ISSUER ?? 'healthchat' // optional but nice

export const jwtAuth = () => {
  const cookieName = "token";
  return async (c: Context<{ Variables: Variables }>, next: Next) => {
    const cookie = getCookie(c, cookieName);
    if (cookie) {
      const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET as string, cookie: cookieName });
      return jwtMiddleware(c, next);
    }
    const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET as string });
    return jwtMiddleware(c, next);
  };
};

export async function sign(user: AppUser, ttlSeconds = 60 * 60 * 24) {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    id: user.id,
    email: user.email,
    iat: now,
    exp: now + ttlSeconds,
    iss: ISSUER,
  }
  return await honoSign(payload, process.env.JWT_SECRET as string) // HS256 default
}

