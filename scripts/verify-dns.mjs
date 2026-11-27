import dns from "node:dns/promises";

/*
 * Public DNS is a dependency this repo cannot see in code review: Clerk auth
 * (clerk/accounts), the Vercel edge (apex/www), Google Search Console and DMARC
 * all live in records held at Spaceship. Run this after any nameserver or
 * record change, and any time sign-in or the site is reported broken.
 *
 * Every expected record below was read from the live authoritative zone on
 * 2026-11-16. See docs/DOMAIN_SETUP.md for the reasoning behind each one.
 */
const domain = "rotaractmenengai.org";
const resolver = new dns.Resolver({ timeout: 5000, tries: 3 });
resolver.setServers(["1.1.1.1", "8.8.8.8"]);

const apexAddresses = ["216.198.79.1", "64.29.17.1"];
const clerkFrontend = "frontend-api.clerk.services";
const clerkAccounts = "accounts.clerk.services";

const checks = [];
function record(name, ok, detail) {
  checks.push({ name, ok, detail });
}

async function resolve(name, type) {
  try {
    return await resolver.resolve(name, type);
  } catch {
    return [];
  }
}

/** A CNAME lookup returns the target chain; tolerate a flattened A answer. */
async function cnameTargets(host) {
  const [cnames, addresses] = await Promise.all([
    resolve(host, "CNAME"),
    resolve(host, "A"),
  ]);
  return { cnames, addresses };
}

// 1. Apex must reach the Vercel edge.
const apexA = await resolve(domain, "A");
const missingApex = apexAddresses.filter((ip) => !apexA.includes(ip));
record(
  "apex A → Vercel edge",
  missingApex.length === 0,
  apexA.length ? apexA.join(", ") : "no A records",
);

// 2. www must be a Vercel-managed hostname.
const www = await cnameTargets(`www.${domain}`);
const wwwTarget = www.cnames[0] ?? "";
record(
  "www → vercel-dns",
  /vercel-dns/i.test(wwwTarget) || www.addresses.length > 0,
  wwwTarget || www.addresses.join(", ") || "unresolved",
);

// 3. Clerk owns both auth hostnames. Losing either breaks sign-in and
//    registration even though the marketing site keeps serving.
for (const [label, host, expected] of [
  ["clerk → Clerk frontend API", `clerk.${domain}`, clerkFrontend],
  ["accounts → Clerk accounts", `accounts.${domain}`, clerkAccounts],
]) {
  const { cnames } = await cnameTargets(host);
  const target = cnames[0] ?? "";
  record(label, target.replace(/\.$/, "") === expected, target || "unresolved");
}

// 4. Search Console verification and DMARC are TXT records that are easy to
//    drop when a zone is recreated, and their loss is silent.
const apexTxt = (await resolve(domain, "TXT")).join(" ");
record(
  "TXT google-site-verification",
  apexTxt.includes("google-site-verification="),
  apexTxt.includes("google-site-verification=")
    ? "present"
    : "missing — Search Console may unverify",
);

const dmarc = (await resolve(`_dmarc.${domain}`, "TXT")).join(" ");
record(
  "TXT _dmarc",
  /v=DMARC1/.test(dmarc),
  /v=DMARC1/.test(dmarc) ? "present" : "missing",
);

// 5. An MX record is intentionally absent: the club does not receive mail on
//    this domain. This is informational so an accidental MX is noticed.
const mx = await resolve(domain, "MX");
record(
  "MX (expect none)",
  true,
  mx.length ? `present: ${mx.map((m) => m.exchange).join(", ")}` : "none",
);

// 6. HTTPS reachability proves the certificate still covers the hostnames.
async function httpsOk(url) {
  try {
    const res = await fetch(url, { redirect: "manual" });
    return res.status;
  } catch (error) {
    return error.cause?.code ?? error.message;
  }
}

const [site, clerk] = await Promise.all([
  httpsOk(`https://${domain}/`),
  httpsOk(`https://clerk.${domain}/v1/environment`),
]);
record("HTTPS apex 200", site === 200, String(site));
record("HTTPS clerk auth API", clerk === 200, String(clerk));

let failed = 0;
for (const { name, ok, detail } of checks) {
  if (!ok) failed += 1;
  process.stdout.write(`${ok ? "PASS" : "FAIL"}  ${name} — ${detail}\n`);
}
process.stdout.write(
  `\n${checks.length - failed}/${checks.length} checks passed for ${domain}\n`,
);
if (failed > 0) process.exitCode = 1;
