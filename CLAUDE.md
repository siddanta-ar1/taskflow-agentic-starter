# TaskFlow

@AGENTS.md

Next.js 16 (App Router, TypeScript, Tailwind v4, shadcn/ui) + Supabase + Resend.

## Commands
- `npm run dev` — dev server on http://localhost:3000
- `npm run check` — lint + typecheck + unit tests. Must pass before every commit.
- `npm run test:e2e` — Playwright end-to-end tests
- `npx supabase db reset` — rebuild the LOCAL database from supabase/migrations

## Rules
- Server-only secrets (SUPABASE_SECRET_KEY, RESEND_API_KEY, TURNSTILE_SECRET_KEY,
  CRON_SECRET, UPSTASH_*) are only used in files that import "server-only"
  or in server actions / route handlers. Never in "use client" files.
- Every new table gets RLS enabled + policies in the SAME migration.
- Schema changes = a new file in supabase/migrations. Never edit an applied migration.
- Mutations use Server Actions with zod validation (zod v4: z.email(), z.uuid()).
- Email templates live in emails/ and import from "react-email".
- Never deploy to production, run SQL against production, or send real email
  without asking me first.

## Layout
- app/(marketing) — public pages     app/(app) — signed-in pages
- lib/supabase/{client,server,admin}.ts — Supabase clients
- emails/ — React Email templates    tests/ — Vitest    e2e/ — Playwright
