# SubTrack — Subscription Tracker

A full-stack subscription tracker that helps people see every recurring subscription in one place, how much they spend monthly and yearly, and what's renewing soon.

**Live demo:** https://subtrack-mocha.vercel.app

![Dashboard screenshot](./screenshots/dashboard.png)

## The problem it solves

Most people lose track of recurring subscriptions and get surprised by renewals. SubTrack lets users sign in (email or Google), log every subscription, and instantly see monthly/yearly spend, upcoming renewals, and a breakdown by category — with secure **per-user data isolation** enforced by Postgres Row-Level Security.

## Tech stack

- **Next.js (App Router)** — Server Components for data fetching, Server Actions for mutations
- **Supabase** — Postgres database + Auth (email/password with verification, passwordless magic link, and Google OAuth)
- **Row-Level Security** — multi-tenant isolation at the database layer
- **Tailwind CSS** + **shadcn/ui** — UI
- **Recharts** — spending charts
- **Vercel** — hosting

## Key engineering decisions

- Designed the data model and wrote **RLS policies** so every query is automatically scoped to the signed-in user — no per-request authorization code needed.
- Used **Server Actions** (`app/actions.ts`) for all mutations instead of hand-written API routes — less boilerplate, fewer bugs, automatic revalidation.
- Auth follows the official `@supabase/ssr` cookie pattern with a `middleware.ts` session refresh and a server-side route guard in `app/dashboard/layout.tsx`.

## Run locally

1. `npm install`
2. Create a Supabase project, then run `supabase-schema.sql` in the SQL Editor (creates the table + RLS policies).
3. In Supabase: **Authentication → Providers** enable Email and Google (Google needs OAuth credentials from Google Cloud).
4. Copy `.env.local.example` to `.env.local` and fill in your Supabase URL and anon key.
5. `npm run dev` → http://localhost:3000

## Possible extensions

Real email/push renewal reminders, multi-currency with live FX, team/shared accounts, Stripe billing integration, CSV export, and custom SMTP (e.g. Resend with an owned domain) for production-grade email deliverability.
