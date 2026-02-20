# P1-07 Evidence: CWV Control (Core Templates)

- Date: 2026-02-20
- Scope: Homepage + service template + order template.
- Method: Lighthouse mobile on production build (`next build` + `next start --port 4173`), not dev mode.
- Reports:
  - `md-soubory/evidence/lh-home-mobile-prod.json`
  - `md-soubory/evidence/lh-demolice-mobile-prod.json`
  - `md-soubory/evidence/lh-order-mobile-prod.json`

## Metrics (mobile, lab)

| URL | Perf score | LCP | FCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| `/` | 94 | 3.00 s | 1.22 s | 4.0 ms | 0.000 |
| `/demolice` | 94 | 3.10 s | 1.24 s | 0.0 ms | 0.000 |
| `/kontejnery/objednat` | 99 | 2.02 s | 1.27 s | 11.0 ms | 0.010 |

## Commands used

```bash
npm run build
npm run start -- --port 4173

npx --yes lighthouse http://localhost:4173/ \
  --quiet --chrome-flags='--headless=new --no-sandbox' \
  --only-categories=performance --emulated-form-factor=mobile \
  --output=json --output-path=md-soubory/evidence/lh-home-mobile-prod.json

npx --yes lighthouse http://localhost:4173/demolice \
  --quiet --chrome-flags='--headless=new --no-sandbox' \
  --only-categories=performance --emulated-form-factor=mobile \
  --output=json --output-path=md-soubory/evidence/lh-demolice-mobile-prod.json

npx --yes lighthouse http://localhost:4173/kontejnery/objednat \
  --quiet --chrome-flags='--headless=new --no-sandbox' \
  --only-categories=performance --emulated-form-factor=mobile \
  --output=json --output-path=md-soubory/evidence/lh-order-mobile-prod.json
```

## Interpretation

- Core control executed successfully for all 3 templates.
- No critical layout shift issue (`CLS <= 0.1` on all templates).
- Follow-up recommended: reduce LCP on `/` and `/demolice` closer to <= 2.5 s target.
- Implemented quick win in code: hero image on `/demolice` now uses `preload` + `sizes` in `src/app/demolice/page.tsx`.
- Reminder: final CWV pass/fail in production should also be validated in GSC field data after launch.
