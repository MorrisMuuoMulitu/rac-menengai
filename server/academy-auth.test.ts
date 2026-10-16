import { describe, expect, it } from "vitest";
import {
  createActorResolver,
  displayNameFor,
  primaryEmail,
  reviewerAllowlist,
  verifiedPrimaryEmail,
} from "./academy-auth";

/* The shape `@clerk/backend` returns. */
const sdkUser = {
  primaryEmailAddressId: "idn_primary",
  firstName: "Morris",
  lastName: "Mulitu",
  emailAddresses: [
    {
      id: "idn_other",
      emailAddress: "other@example.com",
      verification: { status: "verified" },
    },
    {
      id: "idn_primary",
      emailAddress: "Morrismulitu@Gmail.com",
      verification: { status: "verified" },
    },
  ],
};

/* The shape the REST API returns, in case the SDK is ever bypassed. */
const restUser = {
  primary_email_address_id: "idn_primary",
  first_name: "Morris",
  last_name: "Mulitu",
  email_addresses: [
    {
      id: "idn_primary",
      email_address: "morrismulitu@gmail.com",
      verification: { status: "verified" },
    },
  ],
};

describe("reading a Clerk user", () => {
  it("reads the primary address from the SDK shape, normalised", () => {
    expect(primaryEmail(sdkUser)).toBe("morrismulitu@gmail.com");
  });

  it("reads the primary address from the raw REST shape too", () => {
    expect(primaryEmail(restUser)).toBe("morrismulitu@gmail.com");
  });

  it("falls back to the first address when nothing is marked primary", () => {
    expect(
      primaryEmail({
        emailAddresses: [
          { id: "a", emailAddress: "first@example.com" },
          { id: "b", emailAddress: "second@example.com" },
        ],
      }),
    ).toBe("first@example.com");
  });

  it("returns null rather than guessing when there is no address", () => {
    expect(primaryEmail({})).toBeNull();
    expect(primaryEmail({ emailAddresses: [] })).toBeNull();
  });

  it("builds a display name from either shape and falls back to the username", () => {
    expect(displayNameFor(sdkUser)).toBe("Morris Mulitu");
    expect(displayNameFor(restUser)).toBe("Morris Mulitu");
    expect(displayNameFor({ username: "mulitu" })).toBe("mulitu");
    expect(displayNameFor({ firstName: "  ", lastName: "" })).toBeNull();
  });
});

describe("officer status", () => {
  it("accepts a verified address and rejects an unverified one", () => {
    expect(verifiedPrimaryEmail(sdkUser)).toBe("morrismulitu@gmail.com");
    expect(
      verifiedPrimaryEmail({
        primaryEmailAddressId: "idn_primary",
        emailAddresses: [
          {
            id: "idn_primary",
            emailAddress: "morrismulitu@gmail.com",
            verification: { status: "unverified" },
          },
        ],
      }),
    ).toBeNull();
    expect(
      verifiedPrimaryEmail({
        emailAddresses: [{ id: "a", emailAddress: "claims@example.com" }],
      }),
    ).toBeNull();
  });

  it("keeps the allowlist compared case-insensitively and without junk", () => {
    const allow = reviewerAllowlist(
      " MorrisMulitu@Gmail.com , , not-an-email, second@example.com ",
    );
    expect([...allow].sort()).toEqual([
      "morrismulitu@gmail.com",
      "second@example.com",
    ]);
    expect(allow.has("morrismulitu@gmail.com")).toBe(true);
  });

  it("would not grant officer status on an unverified claim to the address", () => {
    const allow = reviewerAllowlist("morrismulitu@gmail.com");
    const claimant = {
      primaryEmailAddressId: "idn_claim",
      emailAddresses: [
        {
          id: "idn_claim",
          emailAddress: "morrismulitu@gmail.com",
          verification: { status: "unverified" },
        },
      ],
    };
    const verified = verifiedPrimaryEmail(claimant);
    expect(verified).toBeNull();
    expect(verified !== null && allow.has(verified)).toBe(false);
  });
});

describe("building the resolver", () => {
  const denied = async () => null;

  it("declines every request when the secret key is missing", async () => {
    const resolve = createActorResolver({
      VITE_CLERK_PUBLISHABLE_KEY: "pk_test_abc",
    });
    expect(await resolve({ headers: {} })).toBeNull();
  });

  it("declines every request when the publishable key is missing", async () => {
    /*
     * The publishable key names the Frontend API host. On an instance serving
     * its Frontend API from a custom domain, leaving it out makes
     * `authenticateRequest` throw and every signed-in request come back signed
     * out — the bug that made the sign-in button look broken.
     */
    const resolve = createActorResolver({ CLERK_SECRET_KEY: "sk_test_abc" });
    expect(await resolve({ headers: {} })).toBeNull();
  });

  it("accepts either spelling of the publishable key", async () => {
    for (const name of ["CLERK_PUBLISHABLE_KEY", "VITE_CLERK_PUBLISHABLE_KEY"]) {
      const resolve = createActorResolver({
        CLERK_SECRET_KEY: "sk_test_abc",
        [name]: "pk_test_abc",
      });
      // With both keys present the resolver stops short-circuiting; a request
      // with no session is simply not signed in.
      expect(await resolve({ headers: {} })).toEqual(await denied());
    }
  });
});
