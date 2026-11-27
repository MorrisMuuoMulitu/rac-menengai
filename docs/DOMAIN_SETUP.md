# Menengai domain connection — 16 October 2026

Primary address: https://rotaractmenengai.org/
Registrar and DNS provider: Spaceship. Nameservers remain launch1.spaceship.net and launch2.spaceship.net.
Vercel project: rac-menengai, under morrismulitu-gmailcoms-projects.

Saved DNS records:

- A @ → 216.198.79.1
- A @ → 64.29.17.1
- CNAME www → 39db62952d8d718d.vercel-dns-017.com

Vercel verified both hostnames. www redirects to the primary address with HTTP 308. TLS certificate verification succeeded against Vercel’s published addresses, with HTTP 200 for the primary and HTTP 308 for www. Public resolvers return the new records; some local negative DNS caches still need to expire after this new registration.

Canonical, Open Graph, structured-data and sitemap URLs use the primary domain. The existing Vercel address remains available. Contact and orientation handlers trust only the explicitly configured origin and the two exact club-owned public origins during migration; localhost configurations remain isolated. Existing calendar UID identifiers stay stable.

## Full zone inventory (audited 16 November 2026)

The three records above were not the whole zone once Clerk and Search Console
went live. Everything currently served from Spaceship, read from the
authoritative nameserver:

| Type  | Name       | Value                                                                  | Owner / purpose                            |
| ----- | ---------- | ---------------------------------------------------------------------- | ------------------------------------------ |
| A     | `@`        | `216.198.79.1`                                                         | Vercel edge                                |
| A     | `@`        | `64.29.17.1`                                                           | Vercel edge (second address)               |
| CNAME | `www`      | `39db62952d8d718d.vercel-dns-017.com`                                  | Vercel, 308 → apex                         |
| CNAME | `clerk`    | `frontend-api.clerk.services`                                          | Clerk custom domain — sign-in and register |
| CNAME | `accounts` | `accounts.clerk.services`                                              | Clerk accounts portal                      |
| TXT   | `@`        | `google-site-verification=4dzUHIiaQ7UdQmj-V2jbFgUM7xB0UQBmqiTyspzFtKM` | Search Console                             |
| TXT   | `_dmarc`   | `v=DMARC1; p=none; rua=mailto:menengairc@gmail.com; fo=1`              | Mail policy (report-only)                  |

There are no MX, AAAA, CAA, SRV or wildcard records, and no DKIM selectors.
The domain does not receive mail, so `_dmarc` is advisory only — it does not
indicate a mailbox on this hostname.

`clerk.rotaractmenengai.org` is referenced by the Content-Security-Policy and
the Clerk publishable key, so a broken CNAME there breaks membership sign-in
while the public site still returns 200. Any migration must recreate both
Clerk records, not just the Vercel ones.

## Why the nameservers stay at Spaceship

Vercel periodically emails that the domain is "not using Vercel DNS" and offers
`ns1.vercel-dns.com` / `ns2.vercel-dns.com`. That message is a nudge about the
_alternative setup with A or CNAME records_, which is the setup described above.
It is not a fault report: the site, the certificate and both Clerk hostnames
are served correctly through Spaceship DNS.

Staying on Spaceship costs only manual upkeep of the apex A records. Migrating
to Vercel nameservers buys automatic record creation for new subdomains, but
requires recreating all seven records above at Vercel first, and the failure
mode during the window is broken sign-in rather than a broken homepage. The
current arrangement is deliberate and documented here.

Verify the whole zone at any time:

```sh
npm run verify:dns
```

The script checks each record in the table plus live HTTPS for the apex and the
Clerk frontend API, and exits non-zero if anything drifted.

## Runbook: migrating to Vercel nameservers (optional)

Only needed if the repeated Vercel emails become a problem, or if automatic
subdomain records start to matter. Budget a quiet window; DNS propagation is
minutes in practice but plan for 24–48 hours.

1. **Read the current zone and record it.** Run `npm run verify:dns` and save
   the output, plus a full `dig @launch1.spaceship.net rotaractmenengai.org ANY`
   for reference. Confirm the table above still matches reality.
2. **Add the domain to Vercel first.** In the rac-menengai project → Settings →
   Domains, confirm `rotaractmenengai.org` and `www.rotaractmenengai.org` are
   listed. Do not remove them.
3. **Recreate the zone in Vercel** (Project → Settings → Domains → the domain's
   DNS Records tab) _before_ changing nameservers, so the new zone is complete
   when it becomes authoritative:
   - `A @ 216.198.79.1`
   - `A @ 64.29.17.1`
   - `CNAME www 39db62952d8d718d.vercel-dns-017.com` — or delete and re-add the
     `www` domain in Vercel and let it create the record itself
   - `CNAME clerk frontend-api.clerk.services`
   - `CNAME accounts accounts.clerk.services`
   - `TXT @ google-site-verification=4dzUHIiaQ7UdQmj-V2jbFgUM7xB0UQBmqiTyspzFtKM`
   - `TXT _dmarc v=DMARC1; p=none; rua=mailto:menengairc@gmail.com; fo=1`
4. **Change nameservers at Spaceship** (domain → Nameservers → custom) to
   `ns1.vercel-dns.com` and `ns2.vercel-dns.com`. Do not delete the domain from
   Spaceship; it remains the registrar and the renewal owner.
5. **Update Clerk** only if Clerk flags the custom domain as unverified after
   propagation. The CNAME target does not change, so verification normally
   carries over untouched.
6. **Verify after propagation:**

   ```sh
   dig +short NS rotaractmenengai.org          # expect ns1/ns2.vercel-dns.com
   dig +short NS rotaractmenengai.org @1.1.1.1 # from a public resolver too
   npm run verify:dns                          # expect 9/9 PASS
   ```

   Then click through by hand: homepage, `/membership/sign-in`,
   `/membership/register`, and the Clerk-hosted sign-in page. Certificate
   renewal is automatic on both setups, so no TLS action is required.

### Rollback

Revert the nameservers at Spaceship to `launch1.spaceship.net` and
`launch2.spaceship.net`. Spaceship retains the original zone, and because the
A and CNAME targets are unchanged, traffic recovers as the old NS records
re-propagate. Keep the Vercel nameservers in place for at least a week before
treating the migration as settled, so a rollback stays cheap.

## Responding to the Vercel email

No action is required while `npm run verify:dns` passes. The message repeats on
a schedule; either unsubscribe from the footer link, or run the migration above
during a low-traffic window. Re-check the zone inventory here before any future
domain or DNS change — Clerk and Search Console records were added after the
original three-record setup and are the ones most likely to be forgotten.
