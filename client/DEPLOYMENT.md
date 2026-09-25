# Frontend Deployment

## Vercel configuration

The client is configured as a Vite single-page application in `vercel.json`.

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback: all client routes resolve to `index.html`
- Hashed assets: one-year immutable cache policy
- Security headers: content type, frame, referrer, permissions, and HSTS policies

## Required environment variables

Configure these in Vercel for Preview and Production environments:

- `VITE_API_BASE_URL`: public HTTPS API origin ending in `/api/v1`
- `VITE_APP_ENV`: `preview` or `production`

Only variables prefixed with `VITE_` are bundled into the browser. Never place secrets in this file or in Vite environment variables.

## Deployment flow

1. CI runs `npm ci`.
2. CI runs `npm run lint`.
3. CI runs `npm run test:run`.
4. CI runs `npm run build`.
5. Vercel builds the `client` project and publishes `dist`.
6. Preview smoke tests run before production promotion.

## Smoke tests

- Open `/`, `/about`, `/services`, `/projects`, `/case-studies`, `/insights`, `/resume`, and `/contact` directly.
- Refresh a slug detail route and verify the Vercel SPA fallback works.
- Verify public API requests use the configured HTTPS API origin.
- Open `/admin/login` and verify unauthenticated `/admin` redirects to it.
- Verify production responses include the configured security headers.
- Verify an API outage renders the controlled error state rather than exposing response details.
- Confirm the production build has no unexpected console errors.

## Rollback

Promote the last known-good Vercel deployment if smoke tests fail. Do not change environment variables during rollback unless the API contract or origin changed.
