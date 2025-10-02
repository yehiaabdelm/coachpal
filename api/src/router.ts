import { Hono } from "hono";
import { readdirSync, statSync } from "fs";
import { join, relative } from "path";

interface RouteInfo {
  path: string;
  filePath: string;
  isMiddleware: boolean;
}

/**
 * Recursively walks through a directory and collects all route files
 */
function walkDirectory(dir: string, baseDir: string): RouteInfo[] {
  const routes: RouteInfo[] = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      routes.push(...walkDirectory(fullPath, baseDir));
    } else if (stat.isFile() && /\.(ts|js)$/.test(entry)) {
      const relativePath = relative(baseDir, fullPath);
      const isMiddleware =
        entry === "_middleware.ts" || entry === "_middleware.js";

      routes.push({
        path: relativePath,
        filePath: fullPath,
        isMiddleware,
      });
    }
  }

  return routes;
}

/**
 * Registers routes from file system into Hono app
 */
export async function registerFileRoutes(
  app: Hono,
  routesDir: string
): Promise<void> {
  const routes = walkDirectory(routesDir, routesDir);
  const routeFiles = routes.filter((r) => !r.isMiddleware);

  // Sort routes by specificity
  routeFiles.sort((a, b) => {
    const aDepth = a.path.split("/").length;
    const bDepth = b.path.split("/").length;
    const aHasParams = a.path.includes("[");
    const bHasParams = b.path.includes("[");

    if (aHasParams !== bHasParams) {
      return aHasParams ? 1 : -1;
    }

    return bDepth - aDepth;
  });

  // Register each route
  for (const routeFile of routeFiles) {
    try {
      const mod = await import(routeFile.filePath);

      // If the file exports a default Hono app, mount it as-is
      if (mod.default && mod.default instanceof Hono) {
        app.route("/", mod.default);
        console.log(`Mounted default sub-app from ${routeFile.path}`);
      }

      // If it exports GET/POST/etc. Hono apps, mount those too
      const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
      for (const method of methods) {
        if (mod[method] && mod[method] instanceof Hono) {
          app.route("/", mod[method]);
          console.log(`[${method}] ${routeFile.path} `);
        }
      }
    } catch (err) {
      console.error(`Failed to load route: ${routeFile.filePath}`, err);
    }
  }
}
