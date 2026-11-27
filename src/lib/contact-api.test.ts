import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler from "../../api/contact";

const store = vi.hoisted(() => ({
  consumeRateLimit: vi.fn(),
  saveEnquiry: vi.fn(),
  listEnquiries: vi.fn(),
  deleteEnquiry: vi.fn(),
}));
const resolveActor = vi.hoisted(() => vi.fn());

vi.mock("../../server/contact-db", () => ({
  createPostgresContactRepository: () => store,
}));
vi.mock("../../server/academy-auth", () => ({
  createActorResolver: () => resolveActor,
}));

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
  url: "/api/contact",
  headers: {
    origin: "https://rac-menengai.vercel.app",
    "content-type": "application/json",
    "x-forwarded-for": "203.0.113.4",
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
  vi.stubEnv("DATABASE_URL", "postgresql://example");
  vi.stubEnv("SITE_ORIGIN", "https://rac-menengai.vercel.app");
  vi.stubEnv("CONTACT_TO", "menengairc@gmail.com");
  store.consumeRateLimit.mockReset().mockResolvedValue(1);
  store.saveEnquiry.mockReset().mockResolvedValue({
    ...body,
    id: "enquiry-id",
    createdAt: "2026-11-27T12:00:00.000Z",
  });
  store.listEnquiries.mockReset().mockResolvedValue([]);
  store.deleteEnquiry.mockReset().mockResolvedValue(true);
  resolveActor.mockReset().mockResolvedValue(null);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("contact collection", () => {
  it("fails closed without a database", async () => {
    vi.stubEnv("DATABASE_URL", "");
    const r = response();
    await handler(request(), r.res);
    expect(r.status).toBe(503);
  });

  it("validates on the server", async () => {
    const r = response();
    await handler(request({ ...body, consent: false }), r.res);
    expect(r.status).toBe(422);
    expect(store.saveEnquiry).not.toHaveBeenCalled();
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

  it("stores the enquiry even when email is not configured", async () => {
    const r = response();
    await handler(request(), r.res);
    expect(r.status).toBe(200);
    expect(r.payload).toEqual({ received: true, delivered: false });
    expect(store.saveEnquiry).toHaveBeenCalledWith({
      ...body,
      ipHash: expect.any(String),
    });
  });

  it("enforces the hourly rate limit before saving", async () => {
    store.consumeRateLimit.mockResolvedValue(6);
    const r = response();
    await handler(request(), r.res);
    expect(r.status).toBe(429);
    expect(store.saveEnquiry).not.toHaveBeenCalled();
  });

  it("sends and stores once provider delivery succeeds", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv(
      "ACADEMY_EMAIL_FROM",
      "Rotaract Club of Menengai <academy@example.com>",
    );
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: "email-id" }),
      }),
    );
    const r = response();
    await handler(request(), r.res);
    expect(r.status).toBe(200);
    expect(r.payload).toEqual({ received: true, delivered: true });
    expect(store.saveEnquiry).toHaveBeenCalledTimes(1);
    const sent = JSON.parse(String(vi.mocked(fetch).mock.calls[0][1]?.body));
    expect(sent.to).toEqual(["menengairc@gmail.com", "morrismulitu@gmail.com"]);
  });

  it("lets a reviewer read stored enquiries", async () => {
    resolveActor.mockResolvedValue({
      userId: "user_officer",
      email: "menengairc@gmail.com",
      displayName: "Club inbox",
      reviewer: true,
    });
    const r = response();
    await handler(
      {
        method: "GET",
        url: "/api/contact",
        headers: {},
        body: undefined,
      },
      r.res,
    );
    expect(r.status).toBe(200);
    expect(r.payload).toMatchObject({ signedIn: true, enquiries: [] });
  });

  it("lets a reviewer remove an enquiry", async () => {
    resolveActor.mockResolvedValue({
      userId: "user_officer",
      email: "menengairc@gmail.com",
      displayName: "Club inbox",
      reviewer: true,
    });
    const r = response();
    await handler(
      {
        method: "DELETE",
        url: "/api/contact?id=123e4567-e89b-12d3-a456-426614174000",
        headers: { origin: "https://rac-menengai.vercel.app" },
        body: undefined,
      },
      r.res,
    );
    expect(r.status).toBe(200);
    expect(store.deleteEnquiry).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174000",
    );
  });
});
