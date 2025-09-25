// src/auth.ts
import type { Context, MiddlewareHandler } from 'hono'
import { jwt, type JwtVariables, sign, verify } from 'hono/jwt'

// Type the context variable set by jwt() middleware
export type Variables = JwtVariables
type AppUser = { sub: string; email?: string }

const SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me'
const ISSUER = process.env.APP_ISSUER ?? 'healthchat' // optional but nice

// Issue your app’s JWT (HS256 by default)
export async function issueAppToken(user: AppUser, ttlSeconds = 60 * 60 * 24) {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    sub: user.sub,
    email: user.email,
    iat: now,
    exp: now + ttlSeconds,
    iss: ISSUER,
  }
  return await sign(payload, SECRET) // HS256 default
}

// If you ever need to verify manually (outside middleware)
export async function verifyAppToken(token: string) {
  return await verify(token, SECRET, 'HS256')
}

// Drop-in auth middleware using hono/jwt
export const requireAuth: MiddlewareHandler<{ Variables: Variables }> = (c, next) => {
  const mw = jwt({ secret: SECRET })
  return mw(c, next)
}

// Convenience accessor
export function getUser(c: Context): AppUser | undefined {
  // jwt() stores payload here
  const p = c.get('jwtPayload') as any
  if (!p?.sub) return undefined
  return { sub: p.sub as string, email: p.email as string | undefined }
}
