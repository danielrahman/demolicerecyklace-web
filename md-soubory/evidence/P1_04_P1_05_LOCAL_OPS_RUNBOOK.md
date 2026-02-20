# P1-04/P1-05 Runbook: Local SEO Ops (NAP + GBP)

- Date: 2026-02-20
- Scope: Core local setup for launch (no enterprise expansion).
- Owners: `ops` (primary), `content` (reviews/posts text), `dev` (only if web NAP mismatch found).

## Canonical NAP (single source of truth)

Use these exact values everywhere:

- Brand: `Demolice Recyklace`
- Company: `MINUTY a.s.`
- Phone: `+420 606 660 655`
- Email: `info@minutyas.cz`
- Address: `Na Kodymce 1440/17, 160 00 Praha 6-Dejvice`
- Service area: `Praha a Středočeský kraj`
- Hours:
  - `Po-Pá 7:00-17:00`
  - `So 8:00-14:00`
- Website: `https://www.demolicerecyklace.cz`

Source in code: `src/lib/site-config.ts`.

## P1-04: NAP consistency checklist

1. Open website contact page and footer:
   - Verify phone/email/address match canonical NAP exactly.
2. Open GBP profile:
   - Verify name, primary category, phone, website, service area, hours.
3. Check top citations (minimum set for Core):
   - Firmy.cz
   - Mapy.cz firmy
   - NejRemeslnici.cz (if used)
   - Najisto.cz (if used)
4. Fix mismatches:
   - Prefer updating external profiles to canonical NAP.
   - If website differs from canonical, create `dev` task to update source in code.

### Evidence to attach (for checklist completion)

- Screenshot set:
  - website contact page with NAP
  - GBP "Business information" panel
  - each citation profile after update
- One-line changelog:
  - `platform | old value -> new value | date`

## P1-05: GBP completeness + active management checklist

1. Fill profile to 100% core completeness:
   - Primary category set
   - Services list present (`demolice`, `kontejnery`, `odvoz suti`, `recyklace`)
   - Description includes service area + core services
   - Hours and holiday hours set
   - Website + phone + address/service area set
2. Add visual proof:
   - 8+ recent photos (operations, equipment, containers, site)
3. Review management baseline:
   - At least 1 process owner
   - Response template for positive and negative reviews
4. Monthly cadence (minimum):
   - 1 GBP post/month
   - Review response SLA: <= 3 business days
   - Check Q&A and add missing FAQ answers

### Evidence to attach (for checklist completion)

- Screenshot of completed GBP sections.
- Link or export of latest GBP post.
- List of reviews with response dates (last 30 days).

## Exit criteria to mark `hotovo`

- `P1-04` can be marked `hotovo` when all checked channels match canonical NAP and screenshots exist.
- `P1-05` can be marked `hotovo` when GBP is complete, has media baseline, and monthly cadence is documented.
