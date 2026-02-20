# UX/UI Checklist (Pass/Fail)

## Clarity and Information Hierarchy
- [ ] **Pass** if every page has exactly one visible `h1` that states the user goal in plain language; **Fail** if the headline is generic or multiple competing `h1` elements exist.
- [ ] **Pass** if the first viewport communicates service area, offer (`3 m3`), and manual operator confirmation; **Fail** if any of these are missing above the fold.
- [ ] **Pass** if each section starts with a user-oriented heading (task or question); **Fail** if headings are brand/internal language.
- [ ] **Pass** if primary facts (price direction, service area, contact fallback) are visible without opening PDFs; **Fail** if users must download docs for critical decisions.
- [ ] **Pass** if every page supports scanning (short paragraphs, bullets, labels); **Fail** if dense text blocks exceed ~5 lines without structure.
- [ ] **Pass** if terms are consistent (`objednávka`, `termín potvrzuje operátor`, `kontejner 3 m3`); **Fail** if synonyms create ambiguity.

## Navigation and CTAs
- [ ] **Pass** if each page has one dominant CTA style and one primary action; **Fail** if multiple equal-weight CTAs compete.
- [ ] **Pass** if CTA labels are action-specific (`Objednat kontejner`, `Zobrazit ceník`); **Fail** if labels are vague (`Pokračovat`, `Více`).
- [ ] **Pass** if header + mobile menu expose all top-level tasks (services, pricing, contact); **Fail** if task paths are hidden or duplicated inconsistently.
- [ ] **Pass** if breadcrumb current item is non-link and visually distinct; **Fail** if users can’t identify current location.
- [ ] **Pass** if all fallback paths (phone/email) are present where online completion can fail; **Fail** if users hit dead ends.
- [ ] **Pass** if admin flow is strictly `list -> detail -> 3 status actions (+ internal note)`; **Fail** if extra dashboards/reports add cognitive load.

## Forms and Validation (Including Error States)
- [ ] **Pass** if each step validates only required fields for that step and blocks progression on invalid data; **Fail** if users can continue with invalid required inputs.
- [ ] **Pass** if validation provides both inline error text and a top error summary linking to invalid fields; **Fail** if only one generic message is shown.
- [ ] **Pass** if each invalid field has `aria-invalid="true"` and `aria-describedby` to specific error text; **Fail** if errors are not programmatically associated.
- [ ] **Pass** if error summary receives focus after failed submit/next-step action; **Fail** if keyboard/screen-reader users are left at the button.
- [ ] **Pass** if date field rejects past dates and public-space selection requires permit confirmation; **Fail** if impossible/illegal values pass.
- [ ] **Pass** if server errors are shown in user language with recovery guidance; **Fail** if raw technical messages are exposed.
- [ ] **Pass** if consent language links to GDPR/legal pages and marks mandatory vs optional clearly; **Fail** if consent scope is unclear.

## Accessibility (WCAG 2.2 AA)
- [ ] **Pass** if all functionality is keyboard operable (navigation, wizard controls, admin actions); **Fail** if any control requires mouse/touch.
- [ ] **Pass** if visible focus indicator is present and high contrast on all interactive elements; **Fail** if focus is hidden/low-contrast.
- [ ] **Pass** if text/background contrast meets AA (normal text >= 4.5:1, large text >= 3:1); **Fail** if contrast falls below thresholds.
- [ ] **Pass** if all form fields have explicit labels and instructions before input; **Fail** if placeholders are used as sole labels.
- [ ] **Pass** if page language is set to Czech (`lang="cs"`) and heading order is logical; **Fail** if language/semantics are inconsistent.
- [ ] **Pass** if errors are announced in correct reading order (summary first, then inline); **Fail** if assistive tech receives fragmented context.
- [ ] **Pass** if non-text elements (logos/photos/icons) have meaningful alt text or are decorative; **Fail** if alt text is missing/redundant.

## Performance (Core Web Vitals)
- [ ] **Pass** if mobile LCP is <= 2.5s for homepage and order-start pages; **Fail** if LCP exceeds 2.5s.
- [ ] **Pass** if INP target proxy is <= 200ms under normal interaction; **Fail** if interactions feel delayed.
- [ ] **Pass** if CLS is <= 0.1 and no layout shift occurs during image/font/script load; **Fail** if content jumps.
- [ ] **Pass** if critical images are properly sized/compressed and only key hero is `priority`; **Fail** if oversized images block rendering.
- [ ] **Pass** if third-party scripts (maps/analytics) load non-blocking and only where needed; **Fail** if they block initial rendering.
- [ ] **Pass** if JavaScript bundle for order flow is scoped to the order page; **Fail** if heavy scripts are loaded site-wide unnecessarily.

## Trust Signals and Legal Pages
- [ ] **Pass** if footer and contact pages include full company identity, service area, and direct contact methods; **Fail** if trust basics are missing.
- [ ] **Pass** if legal pages (`GDPR`, `Cookies`, `Obchodní podmínky`) are reachable in <= 1 click from footer; **Fail** if buried.
- [ ] **Pass** if the order flow explicitly states manual operator confirmation before payment/scheduling assumptions; **Fail** if promise is ambiguous.
- [ ] **Pass** if transactional emails confirm status transitions in plain language (received, confirmed/rescheduled/cancelled); **Fail** if users are left uncertain.
- [ ] **Pass** if pricing pages disclose orientation/limitations and potential surcharges; **Fail** if price context is hidden.
- [ ] **Pass** if admin actions create an auditable internal note trail; **Fail** if status changes lack context.

## Source Checklists Used
- NN/g 10 Usability Heuristics: https://www.nngroup.com/articles/ten-usability-heuristics/
- GOV.UK Service Manual (Design): https://www.gov.uk/service-manual/design
- GOV.UK Form structure: https://www.gov.uk/service-manual/design/form-structure
- GOV.UK Writing for UI: https://www.gov.uk/service-manual/design/writing-for-user-interfaces
- GOV.UK Validation pattern: https://design-system.service.gov.uk/patterns/validation/
- GOV.UK Error message component: https://design-system.service.gov.uk/components/error-message/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Core Web Vitals: https://web.dev/articles/vitals
