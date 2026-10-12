import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { createOrientationHandler } from "./server/orientation-access";

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
  plugins: [react(), localCourseApi(loadEnv(mode, process.cwd(), ""))],
  base: "/",
  build: { outDir: "dist", assetsDir: "assets", chunkSizeWarningLimit: 800 },
  server: { port: 5173 },
}));
