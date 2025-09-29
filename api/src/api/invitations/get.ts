import type { Hono } from "hono";
import db from "../../db/index.js";
import * as schema from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default function registerChatGet(app: Hono) {
  app.get("/invite/:token", async (c) => {
    const token = c.req.param("token");

    const invite = await db.query.invitations.findFirst({
      where: eq(schema.invitations.token, token),
      columns: {
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        type: true,
        status: true,
        message: true,
        expiresAt: true,
        acceptedAt: true,
      },
      with: {
        organization: {
          columns: {
            name: true,
          },
        },
      },
    });

    if (!invite) {
      return c.json(
        { message: "This invite doesn't exist. Ask your administrator for a new one." },
        404
      );
    }

    if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
      return c.json(
        { message: "This invite has expired. Ask your administrator for a new one." },
        410
      );
    }

    if (invite.acceptedAt) {
      return c.json(
        { message: "This invite has already been used. You may need to log in instead." },
        410
      );
    }

    return c.json(invite);
  });
}
