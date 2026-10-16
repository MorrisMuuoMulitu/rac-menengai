import { describe, expect, it } from "vitest";
import { createOrientationHandler } from "./orientation-access";
import { FULL_COURSE } from "./course";
const env = {
  ORIENTATION_PASSCODE: "test-code-long-enough",
  ORIENTATION_SESSION_SECRET: "a".repeat(64),
  SITE_ORIGIN: "http://localhost:5173",
};
function response() {
  const result = {
    status: 0,
    headers: {} as Record<string, string>,
    body: null as any,
  };
  const res = {
    status(code: number) {
      result.status = code;
      return res;
    },
    setHeader(key: string, value: string) {
      result.headers[key] = value;
    },
    json(body: unknown) {
      result.body = body;
    },
  };
  return { result, res };
}
const req = (method: string, body?: unknown, cookie?: string) => ({
  method,
  headers: {
    origin: env.SITE_ORIGIN,
    "content-type": "application/json",
    cookie,
    "x-forwarded-for": "127.0.0.1",
  },
  body,
});
describe("orientation access boundary", () => {
  it("does not send course content to an unauthenticated reader", async () => {
    const { result, res } = response();
    await createOrientationHandler(env)(req("GET"), res);
    expect(result.status).toBe(401);
    expect(result.body.course).toBeUndefined();
  });
  it("rejects a wrong passcode and a forged cookie", async () => {
    const handler = createOrientationHandler(env);
    let { result, res } = response();
    await handler(req("POST", { passcode: "wrong" }), res);
    expect(result.status).toBe(401);
    ({ result, res } = response());
    await handler(
      req("GET", undefined, "rac_orientation=9999999999.fake.signature"),
      res,
    );
    expect(result.status).toBe(401);
  });
  it("issues a protected cookie and serves the course only with it", async () => {
    const handler = createOrientationHandler(env);
    let { result, res } = response();
    await handler(req("POST", { passcode: env.ORIENTATION_PASSCODE }), res);
    expect(result.status).toBe(200);
    const cookie = result.headers["Set-Cookie"];
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Strict");
    ({ result, res } = response());
    await handler(req("GET", undefined, cookie.split(";")[0]), res);
    expect(result.status).toBe(200);
    expect(result.body.course.modules.length).toBe(FULL_COURSE.modules.length);
  });
  it("rejects expired sessions and passcode rotation invalidates existing sessions", async () => {
    let now = 1700000000000;
    const handler = createOrientationHandler(env, () => now);
    let { result, res } = response();
    await handler(req("POST", { passcode: env.ORIENTATION_PASSCODE }), res);
    const cookie = result.headers["Set-Cookie"].split(";")[0];
    now += 5 * 60 * 60 * 1000;
    ({ result, res } = response());
    await handler(req("GET", undefined, cookie), res);
    expect(result.status).toBe(401);
    ({ result, res } = response());
    await createOrientationHandler(
      { ...env, ORIENTATION_PASSCODE: "different-long-code" },
      () => 1700000000000,
    )(req("GET", undefined, cookie), res);
    expect(result.status).toBe(401);
  });
  it("fails closed without configuration and blocks cross-origin unlocks", async () => {
    let { result, res } = response();
    await createOrientationHandler({})(req("GET"), res);
    expect(result.status).toBe(503);
    ({ result, res } = response());
    await createOrientationHandler(env)(
      {
        ...req("POST", { passcode: env.ORIENTATION_PASSCODE }),
        headers: {
          origin: "https://elsewhere.test",
          "content-type": "application/json",
        },
      },
      res,
    );
    expect(result.status).toBe(403);
  });
  it("clears access on lock and throttles repeated attempts", async () => {
    const handler = createOrientationHandler(env);
    let { result, res } = response();
    await handler(req("DELETE"), res);
    expect(result.headers["Set-Cookie"]).toContain("Max-Age=0");
    for (let i = 0; i < 6; i++) {
      ({ result, res } = response());
      await handler(req("POST", { passcode: "wrong" }), res);
    }
    expect(result.status).toBe(429);
  });
});
