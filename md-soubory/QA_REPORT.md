# QA Report

## Test Setup
- Date: 2026-02-20
- Environment: production build (`next build`) + local runtime (`next start --port 3101`)
- Commands used:
  - `npm run lint`
  - `npm run build`
  - `npm run db:generate`
  - `npm run db:push`
  - `npx lighthouse http://localhost:3101 ...`
  - `npx lighthouse http://localhost:3101/kontejnery/objednat ...`
  - `npx @axe-core/cli http://localhost:3101 --exit`
  - `npx @axe-core/cli http://localhost:3101/kontejnery/objednat --exit`

## 1. Build and DB Status
- `npm run lint`: **Pass** (0 errors, 0 warnings).
- `npm run build`: **Pass**.
- `npm run db:generate`: **Pass**.
- `npm run db:push`: **Fail (env/runtime)**.
  - Error: `ECONNREFUSED localhost:5432`.
  - Reason: local PostgreSQL was not running / reachable at `DATABASE_URL`.

## 2. Lighthouse (Core Web Vitals proxy)

| Page | Performance | LCP | TBT (INP proxy) | CLS | Pass/Fail |
|---|---:|---:|---:|---:|---|
| `/` | 96 | 2.7s | 0ms | 0.000 | **Fail** (LCP over 2.5s, near target) |
| `/kontejnery/objednat` | 97 | 2.6s | 0ms | 0.010 | **Fail** (LCP over 2.5s, near target) |

### Performance fixes in this iteration
- Homepage pricing preview moved under Suspense to avoid blocking above-the-fold render.
- Font payload reduced (single Google font family).
- Order page now has a direct `h1` section and keeps maps deferred until interaction.

## 3. Accessibility (`axe-core`)
- Homepage `/`: **Pass** - `0 violations`.
- Order page `/kontejnery/objednat`: **Pass** - `0 violations`.

## 4. Functional Coverage (code + routes)
- DB-backed order persistence and admin operations implemented (`container_orders`).
- Event audit trail implemented (`order_events`) and shown in admin detail timeline.
- Admin auth implemented via Auth.js credentials + route/API guard.
- Anti-spam implemented:
  - Rate-limit (`5/30min`) on `POST /api/orders`.
  - Honeypot field (`website`) end-to-end.

## Acceptance Summary (`PRD.md` #6/#11/#13/#14/#15)
- `#6` Persist do PostgreSQL: **Implemented in code**, runtime verification blocked by missing local DB connection.
- `#11` Admin auth + guard: **Implemented**.
- `#13` Rate-limit + honeypot: **Implemented**.
- `#14` CWV (LCP/INP/CLS): **Partially met**.
  - INP proxy/TBT and CLS pass.
  - LCP still above 2.5s on both target pages (close).
- `#15` WCAG 2.2 AA (main flow): **Pass in automated checks** (`axe` 0/0), with manual validation still recommended.
