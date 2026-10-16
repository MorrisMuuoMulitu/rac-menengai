import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { createOrientationHandler } from "./server/orientation-access";

/**
 * Serve `/api/academy` during `vite dev`.
 *
 * Everything here runs in the dev server process only — `apply: "serve"` means
 * it is absent from every build. It uses the same handler, the same database
 * and the same sign-in check as production, so what you see locally is what
 * the deployment does. Without a configured sign-in key, reads work and writes
 * return 401, which is the real behaviour rather than a local shortcut.
 */
function localAcademyApi(env: Record<string, string>): Plugin {
  return {
    name: "local-academy-api",
    apply: "serve",
    configureServer(server) {
      let handler: ((req: never, res: never) => Promise<unknown>) | null = null;
      let unavailable = "";

      async function build(scoped: Record<string, string>) {
        const { createAcademyHandler } = await server.ssrLoadModule(
          "/server/academy.ts",
        );
        const { createActorResolver } = await server.ssrLoadModule(
          "/server/academy-auth.ts",
        );
        const { createPostgresRepository } = await server.ssrLoadModule(
          "/server/academy-db.ts",
        );
        const connectionString =
          scoped.DATABASE_URL ?? scoped.DATABASE_URL_UNPOOLED ?? "";
        if (!connectionString)
          throw new Error("No DATABASE_URL is set for local development.");
        return createAcademyHandler(scoped, {
          resolveActor: createActorResolver(scoped),
          repository: createPostgresRepository(connectionString),
        });
      }

      server.middlewares.use(async (req, res, next) => {
        const path = (req.url ?? "").split("?")[0].replace(/\/$/, "");
        if (path !== "/api/academy") return next();

        const host = req.headers.host;
        if (!host || !/^(localhost|127\.0\.0\.1):\d+$/.test(host)) {
          res.statusCode = 403;
          res.end();
          return;
        }
        const origin = `http://${host}`;
        const scoped = { ...env, SITE_ORIGIN: origin };

        if (!handler && !unavailable) {
          try {
            handler = (await build(scoped)) as typeof handler;
          } catch (cause) {
            unavailable =
              cause instanceof Error
                ? cause.message
                : "The academy is not connected for local development.";
          }
        }
        if (unavailable || !handler) {
          res.statusCode = 503;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: unavailable, signedIn: false }));
          return;
        }

        let body: unknown;
        if (req.method === "POST") {
          try {
            let raw = "";
            for await (const chunk of req) {
              raw += chunk;
              if (raw.length > 64_000) {
                res.statusCode = 413;
                res.end();
                return;
              }
            }
            body = JSON.parse(raw);
          } catch {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Invalid request." }));
            return;
          }
        }
        const response = {
          status(code: number) {
            res.statusCode = code;
            return response;
          },
          setHeader(key: string, value: string) {
            res.setHeader(key, value);
          },
          json(value: unknown) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(value));
          },
        };
        try {
          await handler(
            { method: req.method, url: req.url, headers: req.headers, body },
            response,
          );
        } catch {
          response
            .status(500)
            .json({ error: "The academy is unavailable. Please try again." });
        }
      });
    },
  };
}

function localCourseApi(env: Record<string, string>): Plugin {
  const handlers = new Map<
    string,
    ReturnType<typeof createOrientationHandler>
  >();
  return {
    name: "local-course-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        let path: string;
        try {
          path = decodeURIComponent(req.url?.split("?")[0] ?? "");
        } catch {
          res.statusCode = 400;
          res.end();
          return;
        }
        if (path.includes("/server/")) {
          res.statusCode = 404;
          res.end();
          return;
        }
        if (path !== "/api/orientation") return next();
        const host = req.headers.host;
        if (!host || !/^(localhost|127\.0\.0\.1):\d+$/.test(host)) {
          res.statusCode = 403;
          res.end();
          return;
        }
        const origin = `http://${host}`;
        if (!handlers.has(origin))
          handlers.set(
            origin,
            createOrientationHandler({ ...env, SITE_ORIGIN: origin }),
          );
        let body: unknown;
        if (req.method === "POST") {
          try {
            let raw = "";
            for await (const chunk of req) {
              raw += chunk;
              if (raw.length > 1024) {
                res.statusCode = 413;
                res.end();
                return;
              }
            }
            body = JSON.parse(raw);
          } catch {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Invalid request." }));
            return;
          }
        }
        const response = {
          status(code: number) {
            res.statusCode = code;
            return response;
          },
          setHeader(key: string, value: string) {
            res.setHeader(key, value);
          },
          json(value: unknown) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(value));
          },
        };
        try {
          await handlers.get(origin)!(
            { method: req.method, headers: req.headers, body },
            response,
          );
        } catch {
          response
            .status(500)
            .json({ error: "Course access is unavailable. Please try again." });
        }
      });
    },
  };
}
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    localCourseApi(loadEnv(mode, process.cwd(), "")),
    localAcademyApi(loadEnv(mode, process.cwd(), "")),
  ],
  base: "/",
  build: { outDir: "dist", assetsDir: "assets", chunkSizeWarningLimit: 800 },
  server: { port: 5173 },
}));
