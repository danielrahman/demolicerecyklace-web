# P2-03 Evidence: Měsíční mini-audit setup

- Date: 2026-02-20
- Goal: Zavést opakovatelný měsíční audit (indexace, dotazy, konverze) v Core rozsahu.

## What was implemented

- Script: `scripts/seo-mini-audit.sh`
- NPM command: `npm run seo:mini-audit`
- Output pattern: `md-soubory/evidence/SEO_MINI_AUDIT_YYYY-MM.md`

## First run

- Command executed: `npm run seo:mini-audit`
- Output file generated: `md-soubory/evidence/SEO_MINI_AUDIT_2026-02.md`

## What the mini-audit includes

1. Indexace (automaticky):
   - `robots.txt`/`sitemap.xml` status
   - počet URL v sitemap
   - money pages snapshot (HTTP/title/canonical)
   - noindex pages snapshot
2. Dotazy (manual from GSC):
   - top queries, CTR opportunities
3. Konverze (manual from GA4/CRM):
   - `start_order`, `submit_order`, `submit_order_success`
   - základní funnel ratio

## Operating rule

- Run 1x měsíčně (po release nebo na začátku měsíce).
- Uložit výstup do evidence složky a doplnit akce na další měsíc.
