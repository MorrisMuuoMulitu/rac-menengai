/**
 * Guard the Content-Security-Policy in `vercel.json`.
 *
 * The policy is easy to tighten by accident and impossible to notice: the page
 * still loads, the sign-in button still renders, and nothing happens when you
 * press it. That is exactly what a missing `https://*.protect.clerk.com` in
 * `script-src` looks like, so the required sources are asserted here.
 *
 * Clerk's list: https://clerk.com/docs/guides/secure/best-practices/csp-headers
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const config = JSON.parse(readFileSync("vercel.json", "utf8")) as {
  routes: {
    src?: string;
    dest?: string;
    status?: number;
    has?: { type: string; value: string }[];
    headers?: Record<string, string>;
  }[];
};

const policy =
  config.routes.find((route) => route.headers?.["Content-Security-Policy"])
    ?.headers?.["Content-Security-Policy"] ?? "";

function directive(name: string): string[] {
  const entry = policy
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name} `));
  return entry ? entry.slice(name.length).trim().split(/\s+/) : [];
}

describe("Content-Security-Policy", () => {
  it("is present on every route", () => {
    expect(policy).not.toBe("");
  });

  it("lets Clerk's client script and its bot protection load", () => {
    const script = directive("script-src");
    for (const source of [
      "https://clerk.rotaractmenengai.org",
      "https://challenges.cloudflare.com",
      "https://*.protect.clerk.com",
    ])
      expect(script, `script-src is missing ${source}`).toContain(source);
  });

  it("lets Vercel Live load its feedback interface", () => {
    expect(directive("script-src")).toContain("https://vercel.live");
    expect(directive("style-src")).toContain("https://vercel.live");
    expect(directive("img-src")).toContain("https://vercel.live");
    expect(directive("img-src")).toContain("https://vercel.com");
    expect(directive("font-src")).toContain("https://assets.vercel.com");
    expect(directive("frame-src")).toContain("https://vercel.live");
  });

  it("lets Clerk reach its abuse and fraud protection hosts on any port", () => {
    /* The port wildcard is required: those hosts are not on 443, and a source
       without a port matches 443 only. */
    expect(directive("connect-src")).toContain("https://*.protect.clerk.com:*");
    expect(directive("connect-src")).toContain("https://vercel.live");
    expect(directive("connect-src")).toContain("wss://ws-us3.pusher.com");
  });

  it("allows the challenge frame and Clerk's images", () => {
    expect(directive("frame-src")).toContain(
      "https://challenges.cloudflare.com",
    );
    expect(directive("img-src")).toContain("https://img.clerk.com");
    expect(directive("style-src")).toContain("'unsafe-inline'");
    expect(directive("worker-src")).toEqual(["'self'", "blob:"]);
  });

  it("lets Clerk's own UI load its webfont", () => {
    /*
     * Clerk's sign-in UI injects a Google Fonts stylesheet and then loads the
     * font files. Blocking the stylesheet stops the modal mounting at all —
     * the button simply does nothing, with no error of our own to show.
     */
    expect(directive("style-src")).toContain("https://fonts.googleapis.com");
    expect(directive("font-src")).toContain("https://fonts.gstatic.com");
  });

  it("still refuses inline script, framing and plugins", () => {
    expect(directive("script-src")).not.toContain("'unsafe-inline'");
    expect(directive("script-src")).not.toContain("'unsafe-eval'");
    expect(directive("object-src")).toEqual(["'none'"]);
    expect(directive("frame-ancestors")).toEqual(["'none'"]);
    expect(directive("base-uri")).toEqual(["'self'"]);
    expect(directive("form-action")).toEqual(["'self'"]);
    expect(directive("default-src")).toEqual(["'self'"]);
  });

  it("does not name the Clerk backend API, which the browser never calls", () => {
    expect(policy).not.toContain("api.clerk.com");
  });
});

describe("canonical host", () => {
  it("redirects the stable Vercel alias to the custom domain", () => {
    expect(
      config.routes.find((route) =>
        route.has?.some(
          (condition) =>
            condition.type === "host" &&
            condition.value === "rac-menengai.vercel.app",
        ),
      ),
    ).toMatchObject({
      dest: "https://rotaractmenengai.org/$1",
      status: 308,
    });
  });
});
