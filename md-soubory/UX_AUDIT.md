# UX Audit - Homepage + Order Flow

## Scope
- Homepage: `/` (`src/app/page.tsx`)
- Order entry page: `/kontejnery/objednat` (`src/app/kontejnery/objednat/page.tsx`)
- Multi-step order wizard: `src/components/order-wizard.tsx`

## Findings

| ID | Severity | Issue | Exact fix | Where to change | Suggested copy | MVP priority |
|---|---|---|---|---|---|---|
| H-01 | critical | Wizard shows only one generic error (`error`) and does not map errors to fields. | Introduce per-field validation map, top error summary with anchor links, and inline messages under each invalid input. | `src/components/order-wizard.tsx` lines 692-756, 1251 | Error summary title: `Formulář obsahuje chyby`. Inline prefix: `Chyba:` | P0 |
| H-02 | critical | Invalid fields are not programmatically announced (`aria-invalid`, `aria-describedby` missing), so screen-reader users cannot reliably recover. | Add stable field IDs, `aria-invalid`, `aria-describedby`, and focus to error summary after failed step validation. | `src/components/order-wizard.tsx` inputs across lines 855-1221 | `Opravte označená pole a pokračujte.` | P0 |
| H-03 | critical | Date input accepts past dates; users can request impossible delivery dates. | Enforce `min=today` on date input and validate server/client that date is not before today. | `src/components/order-wizard.tsx` line 1060 and validation block lines 733-737 | `Datum přistavení musí být dnes nebo později.` | P0 |
| H-04 | major | Step validation returns first error only; users face repetitive trial-and-error loops. | Validate all required fields per step at once and show aggregated errors in summary. | `src/components/order-wizard.tsx` lines 692-749 | `V tomto kroku chybí několik údajů.` | P0 |
| H-05 | major | No funnel analytics events implemented (`start_order`, step views/completions, validation errors, submit success/fail). | Add analytics helper + event dispatch in wizard lifecycle and actions. | `src/components/order-wizard.tsx`; new util in `src/lib` | n/a (event payloads) | P0 |
| H-06 | major | On submit failure, raw API message may bubble to user and can be technical (`error.message`). | Normalize API errors to user-safe Czech messages and keep technical details only in logs. | `src/app/api/orders/route.ts` lines 26-34 and client submit block lines 811-819 | `Objednávku se nepodařilo odeslat. Zkuste to prosím znovu nebo zavolejte dispečink.` | P0 |
| H-07 | major | Consent field does not link to GDPR/legal context, reducing trust and legal clarity. | Add inline links to `GDPR` and `Obchodní podmínky` directly in consent section. | `src/components/order-wizard.tsx` lines 1203-1211 | `Souhlasím se zpracováním osobních údajů podle zásad GDPR.` | P1 |
| H-08 | major | Success state lacks clear next-step timing/expectation beyond generic sentence. | Add operational SLA text and fallback contact actions (phone/email) in success panel. | `src/components/order-wizard.tsx` lines 824-830 | `Operátor vás kontaktuje nejpozději do 1 pracovního dne.` | P1 |
| H-09 | minor | Stepper is visual badges only; lacks ordered-list semantics and `aria-current` for current step. | Render stepper as `<ol><li>` with `aria-current="step"` for active item. | `src/components/order-wizard.tsx` lines 836-842 | n/a | P1 |
| H-10 | minor | Homepage still contains placeholder section `Obsah pro důvěru`, which signals unfinished product content. | Replace placeholder with real trust blocks (references, certifications, operator process) or remove until content exists. | `src/app/page.tsx` lines 198-206 | `Reference zákazníků`, `Jak potvrzujeme termín`, `Obchodní podmínky` | P1 |
| H-11 | minor | Homepage CTA hierarchy is good but lacks explicit reassurance near primary CTA about manual confirmation and no immediate commitment. | Add short reassurance line directly below hero CTA row. | `src/app/page.tsx` lines 89-111 | `Objednávka je nezávazná do ručního potvrzení termínu operátorem.` | P2 |
| H-12 | minor | Address helper errors (`pinError`, maps load errors) are visually separated from main error handling and may be missed. | Integrate map/pin errors into same validation/summary system or anchor helper hints to address field group. | `src/components/order-wizard.tsx` lines 894-905, 942-944 | `Adresu můžete kdykoli doplnit ručně níže.` | P2 |

## MVP Prioritization

### P0 (must ship)
- H-01, H-02, H-03, H-04, H-05, H-06

### P1 (should ship)
- H-07, H-08, H-09, H-10

### P2 (nice-to-have)
- H-11, H-12

## MVP Definition of Done
- User can complete all wizard steps with field-specific, accessible validation.
- Funnel analytics events are emitted for every step transition and submit outcome.
- Date/consent/error behavior prevents invalid submissions and reduces support calls.
