# Frontend Release Checklist

## Required checks

- `npm run lint`
- `npm run test:run`
- `npm run build`

## Review gates

- Public routes load without console errors.
- Unauthenticated `/admin` access redirects to `/admin/login`.
- Admin mutations are only exposed after authentication.
- Loading, empty, error, focus, and reduced-motion states are usable.
- API failures do not reveal provider credentials or private response data.
- Mobile navigation and primary workflows are usable at narrow widths.
- Environment variables are configured in the deployment environment.

## Release procedure

1. Run the required checks from the `client` directory.
2. Review the production bundle output for unexpected size changes.
3. Verify the preview deployment against the configured API origin.
4. Run public and protected-route smoke tests.
5. Promote the approved preview to production.