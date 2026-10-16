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
