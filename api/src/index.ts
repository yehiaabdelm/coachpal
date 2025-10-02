import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { registerFileRoutes } from "./router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "https://dev.coachpal.app"],
    allowMethods: ["POST", "GET", "DELETE", "PUT", "PATCH", "OPTIONS"],
    credentials: true,
  })
);


// Register file-based routes
const routesDir = join(__dirname, "routes");

await registerFileRoutes(app, routesDir);

const server = serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT ?? 3000),
    hostname: "0.0.0.0",
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});