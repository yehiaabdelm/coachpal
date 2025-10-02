import { Hono } from "hono";
import db from "../../../db/index.js";
import * as schema from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { jwtAuth } from "../../../middleware/auth.js";

const app = new Hono();

export const GET = app.get("/users/me", jwtAuth, async (c) => {
  const id = c.get("user").id;
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, id),
    columns: {
      firstName: true,
      lastName: true,
      email: true,
      emailVerifiedAt: true,
    },
    with: {
      organizations: {
        columns: {
          role: true,
        },
        with: {
          organization: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  return c.json(user);
});
