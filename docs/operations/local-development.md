# Local Development

## Workspaces

- Current static preview code remains at the project root.
- Future production app lives in `apps/web`.
- Shared platform SQL lives in `supabase/migrations`.

## Recommended flow

1. Install dependencies with `npm.cmd install`.
2. Copy `.env.example` to `.env.local`.
3. Point `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` at a development project.
4. Keep service-role and third-party secrets server-only.
5. Run Next locally from `apps/web`.

The app now allows placeholder public Supabase values in non-production builds so the scaffold can compile before the full environment is wired. Production must still provide real values.

## Staging rules

- staging must be non-indexable
- separate environment values from production
- no live paid campaigns against the staging domain
