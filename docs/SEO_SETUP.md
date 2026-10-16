# Menengai search setup

Verified on 16 October 2026 (Africa/Nairobi).

## Public site

- Primary URL: https://rotaractmenengai.org/
- `www` redirects permanently to the primary host, preserving paths.
- The previous Vercel alias remains available and declares the primary host as canonical.
- Each of the 31 public routes is prerendered with a title, description and canonical URL.
- Event reports have Article structured data, hierarchical breadcrumbs and individual sharing photographs.
- The image sitemap includes 104 club photographs with their full-size asset URLs.
- Draft stories and private course lessons are excluded from public bundles.

## Search submissions

- Google Search Console: domain ownership verified through a TXT record at Spaceship. Keep that record in place.
- Google sitemap: https://rotaractmenengai.org/sitemap.xml — **Success**, 31 discovered pages. This is discovery, not confirmation that 31 pages are indexed.
- Google manual homepage indexing request: rejected because the account's daily quota was exceeded. Can be retried after the quota resets; the successful sitemap remains in place.
- Bing Webmaster Tools: ownership verified through the `msvalidate.01` meta tag in `index.html`. Keep this tag in place.
- Bing sitemap: submitted; processing at verification time.
- IndexNow: 31 URLs received with HTTP 202, which means key validation is pending. Participating engines share submissions; acceptance does not guarantee indexing or rankings.

## After publishing content

1. Run `npm run verify`.
2. Deploy the build and confirm that the updated pages and sitemap are live.
3. Run `npm run seo:submit` to notify IndexNow. The script verifies the live public ownership file before sending URLs. Run `node scripts/submit-indexnow.mjs` for a dry run.
4. Review crawl errors and indexing in Google Search Console and Bing Webmaster Tools.

`public/indexnow-key.txt` is an intentionally public ownership file, not a private account credential. Do not remove it while using this setup.

The most useful next discovery improvements are links from the club's official social profiles, Rotary Club of Nakuru and District 9215. Do not create fabricated reviews, directories or business locations.

## Gallery verification

All 12 published event pages were checked on the live primary domain at 390px width. Ten contain multi-photo galleries, with 104 photos total. Every gallery image uses `object-fit: contain`, and no event page overflowed horizontally. The shared natural-height gallery layout preserves the full original frame. Two event records currently have no multi-photo gallery.
