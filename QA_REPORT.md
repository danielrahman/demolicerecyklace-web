# QA Report

## Test Setup
- Date: 2026-02-20
- Environment: production build (`next build`) + local server (`next start --port 3100`)
- Commands used:
- `npm run lint`
- `npm run build`
- `npx lighthouse http://localhost:3100 ...`
- `npx lighthouse http://localhost:3100/kontejnery/objednat ...`
- `npx @axe-core/cli http://localhost:3100 --exit`
- `npx @axe-core/cli http://localhost:3100/kontejnery/objednat --exit`
- `curl` end-to-end flow checks for order submit + admin status updates

## 1. Lighthouse (Core Web Vitals)

| Page | LCP | INP Proxy (TBT) | CLS | Pass/Fail |
|---|---:|---:|---:|---|
| `/` | 3.4s | 0ms | 0.000 | **Fail** (LCP over 2.5s) |
| `/kontejnery/objednat` | 2.6s | 10ms | 0.000 | **Fail** (LCP over 2.5s, near target) |

### Fixes
- Order page moved to static render path (`/kontejnery/objednat` is now static), search param prefill moved to client wrapper.
- Google Maps loading in wizard is deferred until user interaction with address step.
- Lazy wizard loader now reserves vertical space to avoid CLS shifts.
- Homepage hero no longer depends on heavy above-the-fold image rendering.

### Remaining performance work
- Homepage still needs additional LCP reduction (currently 3.4s) via tighter above-the-fold content and further request prioritization.
- Order page is close to target (2.6s); minor tuning can likely bring it under 2.5s.

## 2. Accessibility Checks

### Automated (`axe-core`)
- Homepage: **Pass** - `0 violations`.
- Order page: **Pass** - `0 violations`.

### Manual/Code-Level Checklist
- Keyboard operability of form controls: **Pass** (native inputs/buttons/selects, no mouse-only controls).
- Focus management on validation failure: **Pass** (error summary receives programmatic focus).
- Labels for fields: **Pass** (label wrappers + no missing-label violations from axe).
- Error reading order (summary -> inline): **Pass** (summary rendered before field-level errors with `aria-describedby` links).

### Fixes
- Increased contrast on primary CTA and active step badge styles.
- Cookie consent banner updated to semantic landmark to remove `region` violation.
- Re-run `axe-core` on both target pages confirms zero automated violations.

## 3. Full Flow Test (Landing -> Order -> Admin Confirm -> Email)

### Flow result
1. Landing reachable: **Pass**.
2. Create order via API (`POST /api/orders`): **Pass** (`orderId` returned).
3. Order visible in admin list (`GET /api/admin/orders`): **Pass**.
4. Confirm order in admin (`POST /api/admin/orders/:id/confirm`): **Pass** (`307` redirect, status changed to `confirmed`).
5. Customer/internal email delivery: **Fail (blocked in local env)** - `RESEND_API_KEY` is empty, so send functions no-op by design.

### Additional status checks
- Reschedule route: **Pass** (`307`, confirmed date/window updated).
- Cancel route: **Pass** (`307`, status `cancelled`, `cancelReason` + `internalNote` stored).

### Fixes
- Set `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_INTERNAL_TO` in production/staging env.
- Perform one staging smoke test with real mailbox assertions for:
- `sendCustomerReceivedEmail`
- `sendCustomerConfirmedEmail` / rescheduled variant
- `sendCustomerCancelledEmail`
- internal status notifications

## Acceptance Summary
- Form validation UX (error summary + inline errors): **Pass**.
- Funnel analytics events: **Pass** (implemented for start, step view/complete, validation errors, submit success/fail).
- Admin minimal flow (`list -> detail -> 3 actions + note`): **Pass**.
- Transactional email integration: **Pass in code**, **Fail in runtime validation** until env keys are configured.
- WCAG 2.2 AA target: **Pass for tested pages** (`/`, `/kontejnery/objednat` via automated checks).
- Core Web Vitals target: **Fail currently** due LCP on homepage/order page (order page is near threshold).
