import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import api from "./api/index.js";

const app = new Hono();

app.use("*", cors({ origin: "*", allowMethods: ["POST", "GET"] }));
app.get("/", (c) => c.text("ok"));
app.route("/", api)

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT ?? 3000),
    hostname: '0.0.0.0'
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
