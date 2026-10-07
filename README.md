# TaskFlow — agentic full-stack starter

A production-shaped starter for building with **Claude Code + MCP**: Next.js 16, Supabase, Resend, Cloudflare Turnstile and Vercel.

It is the companion code for the BOSC tutorial **[Agentic Development with Claude Code](https://bosc.org.np/explore/article/agentic-development-with-claude)**, which explains every file step by step for beginners.

**What's inside**

- Landing page with a **waitlist**: Turnstile bot check, Upstash rate limiting, zod validation, welcome email via Resend
- **Magic-link sign in** with Supabase Auth; every new user gets a personal workspace (database trigger)
- **Realtime drag-and-drop task board** (Supabase Realtime + dnd-kit, optimistic updates)
- **Row-level security** on every table, in one migration
- Weekly **email digest** via Vercel Cron
- **Vitest** unit tests, **Playwright** e2e tests, GitHub Actions CI
- Agent setup: `CLAUDE.md`, `AGENTS.md`, `.mcp.json` (Vercel, Supabase, Resend) and `.claude/settings.json` (permissions + auto-lint hook)

Tested on Next.js 16.4, React 19.3, Node.js 24, zod 4, Vitest 5 and Supabase CLI 2.120.

## Quick start

You need **Node.js 22+** (24 LTS recommended), Git, and free accounts on Supabase and Resend.

```bash
git clone https://github.com/siddanta-ar1/taskflow-agentic-starter.git
cd taskflow-agentic-starter
npm install
cp .env.example .env.local          # then fill in the values (see the comments)
```

Set up the database (create a Supabase project first):

```bash
npx supabase login
npx supabase init                   # answer "N" to the optional IDE settings
npx supabase link --project-ref <your-project-ref>
npx supabase db push                # applies supabase/migrations
npx supabase gen types typescript --linked > lib/database.types.ts
```

In Supabase → **Authentication → URL Configuration**, add `http://localhost:3000/auth/callback` as a redirect URL.

Run it:

```bash
npm run dev                         # http://localhost:3000
npm run check                       # lint + typecheck + unit tests
npx playwright install chromium && npm run test:e2e
```

## Working with Claude Code

```bash
claude                               # start a session in this folder
/mcp                                 # log in to the Vercel, Supabase and Resend MCP servers
```

`.mcp.json` expects a `SUPABASE_PROJECT_REF` environment variable. The Supabase server is **read-only** and scoped to one project by default.

Good first prompts:

```text
Read CLAUDE.md and the migration, then explain how row-level security protects tasks.
Add reordering within a column using @dnd-kit/sortable and lib/position.ts, with tests.
Using the Supabase MCP, run the security and performance advisors and explain any findings.
```

## Deploy

```bash
npm i -g vercel
vercel link && vercel git connect
vercel env add <NAME> production    # for each variable in .env.example
vercel deploy --prod
```

Use **real** Turnstile keys and your verified Resend domain in production. The `.env.example` Turnstile keys are Cloudflare's always-pass test keys. The full production checklist is in the article.

## Project layout

```text
app/(marketing)/      landing page + waitlist server action
app/(app)/board/      realtime board (Suspense + server actions)
app/login, app/auth/  magic-link sign in
app/api/cron/digest/  weekly digest (Vercel Cron)
lib/supabase/         server, browser and admin (server-only) clients
emails/               React Email templates
supabase/migrations/  schema + RLS + triggers
tests/, e2e/          Vitest and Playwright
```

## License

MIT — see [LICENSE](LICENSE).
