# Preview deployment

Project: `rac-menengai`, existing Vercel scope `morrismulitu-gmailcoms-projects`.

Preview only. The production domain remains unchanged. Existing Vercel access protection is retained; sign in with an account allowed to view the project.

Latest preview: https://rac-menengai-20zc1wl58-morrismulitu-gmailcoms-projects.vercel.app . Build output contains 23 prerendered routes, a genuine HTTP 404 fallback, sitemap, robots policy and security headers. The API is fail-closed when delivery configuration is missing. All credentials and local Vercel files remain ignored by Git.

To review locally, run `npm ci`, then `npm run dev`. For verification run `npm run verify`. To create another preview run `vercel deploy`; production promotion requires the release checks listed in `QA_REPORT.md`.
