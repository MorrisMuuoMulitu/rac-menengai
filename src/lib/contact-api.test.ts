import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import handler from "../../api/contact";
const body = {
  name: "Amina",
  contact: "amina@example.com",
  interest: "Join the club",
  message: "I would like to attend fellowship.",
  consent: true,
  company: "",
};
const request = (data: unknown = body) => ({
  method: "POST",
  headers: {
    origin: "https://rac-menengai.vercel.app",
    "content-type": "application/json",
  },
  body: data,
});
function response() {
  let status = 200;
  let payload: unknown;
  const res = {
    status: (code: number) => {
      status = code;
      return res;
    },
    json: (data: unknown) => {
      payload = data;
    },
    setHeader: vi.fn(),
  };
  return {
    res,
    get status() {
      return status;
    },
    get payload() {
      return payload;
    },
  };
}
beforeEach(() => {
  for (const key of [
    "RESEND_API_KEY",
    "CONTACT_FROM",
    "CONTACT_TO",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
  ])
    vi.stubEnv(key, "configured");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe("server enquiry delivery", () => {
  it("fails closed without credentials", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const r = response();
    await handler(request(), r.res);
    expect(r.status).toBe(503);
    expect(r.payload).not.toHaveProperty("delivered");
  });
  it("validates on the server", async () => {
    const r = response();
    await handler(request({ ...body, consent: false }), r.res);
    expect(r.status).toBe(422);
  });
  it("rejects cross-origin submissions", async () => {
    const r = response();
    await handler(
      {
        ...request(),
        headers: {
          origin: "https://other.example",
          "content-type": "application/json",
        },
      },
      r.res,
    );
    expect(r.status).toBe(403);
  });
  it("enforces rate limits before email delivery", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ result: 6 }) });
    vi.stubGlobal("fetch", fetcher);
    const r = response();
    await handler(request(), r.res);
    expect(r.status).toBe(429);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("reports delivery only after provider acceptance", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => ({ result: 1 }) })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: "email-id" }),
        }),
    );
    const r = response();
    await handler(request(), r.res);
    expect(r.status).toBe(200);
    expect(r.payload).toEqual({ delivered: true });
  });
  it("keeps provider errors out of public responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("secret-provider-error")),
    );
    const r = response();
    await handler(request(), r.res);
    expect(r.status).toBe(502);
    expect(JSON.stringify(r.payload)).not.toContain("secret");
  });
});
