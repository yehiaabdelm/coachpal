import { Hono } from "hono";
import "dotenv/config";
import db from "../../db/index.js";
import * as schema from "../../db/schema.js";
import { eq, and } from "drizzle-orm";
import { jwtAuth, orgAuth } from "../../middleware/auth.js";

const app = new Hono();

export const GET = app.get("organizations", jwtAuth, orgAuth, async (c) => {
  const organization = c.get("organization");
  const org = await db.query.organizations.findFirst({
    where: and(eq(schema.organizations.id, organization.id)),
  });
  return c.json(org);
});
