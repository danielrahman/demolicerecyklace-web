# Page Specs

## 1. Homepage (`/`)
- Goal: Route users quickly to the right service, with priority on online container order.
- Primary CTA: `Objednat kontejner`.
- Section outline:
1. Hero (offer + service area + manual confirmation)
2. Service cards (Kontejnery / Demolice / Recyklace)
3. Trust + process timeline
4. Price preview
5. Legal/trust shortcuts + CTA block
- Required content blocks:
- Service area (`Praha + Středočeský kraj`)
- Manual confirmation statement
- CTA pair (`Objednat`, `Ceník`)
- Trust signals (real photos, process, legal links)
- Mobile behavior:
- Hero copy max ~3 short paragraphs
- CTA stack in vertical order, primary first
- Service cards become single column with full-width tap targets

## 2. Containers Landing (`/kontejnery`)
- Goal: Educate and push users into order funnel.
- Primary CTA: `Objednat kontejner`.
- Section outline:
1. Containers hero
2. Available sizes (3m³ active, others coming soon)
3. How it works
4. Waste categories + rules link
5. FAQ preview
- Required content blocks:
- Explicit `3m³` availability
- Service area note
- Rules link (`Co patří a nepatří`)
- Mobile behavior:
- Size cards in one column
- FAQ cards collapsible if height grows
- Sticky bottom CTA optional only if non-intrusive

## 3. Container Pricing (`/cenik#kontejnery`)
- Goal: Provide transparent HTML pricing before order start.
- Primary CTA: `Objednat kontejner`.
- Section outline:
1. Pricing intro
2. Price table/cards by waste type
3. Surcharges/extras
4. Conditions and disclaimers
- Required content blocks:
- Base price + transport + extras
- What is included / not included
- Last update date
- Mobile behavior:
- Convert tables to card rows
- Keep price + CTA visible in each card

## 4. Waste Rules (`/kontejnery/co-patri-nepatri`)
- Goal: Reduce invalid orders and surcharge disputes.
- Primary CTA: `Pokračovat do objednávky`.
- Section outline:
1. Category selector/list
2. Allowed materials
3. Forbidden materials
4. Common mistakes and surcharge examples
- Required content blocks:
- Per-category allowed/forbidden lists
- Warning banner for hazardous waste
- Mobile behavior:
- Accordion per waste category
- High-contrast warning chips

## 5. Order Page (`/kontejnery/objednat`)
- Goal: Complete order with high validity and low abandonment.
- Primary CTA: `Odeslat objednávku`.
- Section outline:
1. Intro + expectation setting
2. Stepper
3. Step content + validation feedback
4. Summary and submit
5. Success confirmation panel
- Required content blocks:
- Error summary + inline errors
- Manual confirmation notice
- Privacy consent + link
- Mobile behavior:
- One-step-at-a-time display
- Large tap targets for navigation buttons
- Error summary pinned near top of current step content

## 6. Demolition (`/demolice`)
- Goal: Generate qualified demolition leads.
- Primary CTA: `Poptat demolici`.
- Section outline:
1. Scope of work
2. Process and safety
3. Equipment and references
4. Contact action
- Required content blocks:
- Service limitations
- Response expectation
- Mobile behavior:
- Timeline + image cards stack vertically

## 7. Recycling (`/recyklace`)
- Goal: Explain intake conditions and drive relevant inquiries.
- Primary CTA: `Zjistit podmínky`.
- Section outline:
1. Accepted materials
2. Intake process
3. Operational info
- Required content blocks:
- Material acceptance table/list
- Contact fallback
- Mobile behavior:
- Convert dense lists to grouped cards

## 8. Material Sales (`/prodej-materialu`)
- Goal: Convert visitors to material inquiries.
- Primary CTA: `Poptat materiál`.
- Section outline:
1. Product types/frakce
2. Availability/logistics
3. Inquiry CTA
- Required content blocks:
- Unit/volume clarity
- Delivery/pickup options
- Mobile behavior:
- Product cards with compact specs

## 9. Contact (`/kontakt`)
- Goal: Provide immediate human fallback and trust details.
- Primary CTA: `Zavolat`.
- Section outline:
1. Primary contact methods
2. Operating hours
3. Map and addresses
4. Legal/company details
- Required content blocks:
- Phone, email, address, opening hours
- Quick link to order page
- Mobile behavior:
- Phone CTA full width at top

## 10. Legal Pages (`/gdpr`, `/obchodni-podminky`, `/cookies`)
- Goal: Meet compliance and support user trust.
- Primary CTA: Contextual (`Objednat kontejner` secondary).
- Section outline:
1. Document title + scope
2. Plain-language summary
3. Full policy text
- Required content blocks:
- Last updated date
- Contact for legal requests
- Mobile behavior:
- Readable line length, anchored headings

## 11. Admin List (`/admin/objednavky`)
- Goal: Let non-technical operator find the right order fast.
- Primary CTA: `Detail`.
- Section outline:
1. Status filters
2. Order list
3. Empty state
- Required content blocks:
- ID, status, customer, location, requested date
- High-contrast status badge
- Mobile behavior:
- Table collapses to stacked cards

## 12. Admin Detail (`/admin/objednavky/[id]`)
- Goal: Resolve one order via three explicit status actions.
- Primary CTA: Depends on current state (`Potvrdit`, `Přeplánovat`, `Stornovat`).
- Section outline:
1. Core order detail
2. Status action panel (3 actions)
3. Internal note
- Required content blocks:
- Confirm action (date + window)
- Reschedule action (date + window)
- Cancel action (reason)
- Internal note field
- Mobile behavior:
- Actions stacked vertically in priority order
- Large buttons and simple form labels

---

# Order Funnel Steps and Validation Rules

## Step 1 - Adresa
- Fields: `Adresa přistavení`, fallback manual fields (`PSČ`, `Město`, `Ulice`, `Číslo popisné`), optional pin on map.
- Rules:
- Address is required.
- Postal code must be exactly 5 digits.
- Postal code must be in supported service area.
- City, street, and house number are required.
- Errors:
- Summary + inline under each invalid field.
- Unsupported postal code includes phone fallback.

## Step 2 - Odpad a kontejner
- Fields: `Typ odpadu`, `Počet kontejnerů`.
- Rules:
- Waste type required (single select).
- Container count min `1`, max `3`.
- Errors:
- Numeric bound message at field level.

## Step 3 - Termín
- Fields: `Datum přistavení`, `Časové okno`, `Umístění`, `Povolení` (conditional), extras.
- Rules:
- Date required and cannot be in past.
- Time window required.
- If placement is public, permit confirmation required.
- Errors:
- Public placement error shown on permit checkbox.

## Step 4 - Zákazník
- Fields FO: `Jméno`, `Telefon`, `E-mail`.
- Fields Firma: FO fields + `Název firmy`, `IČO`, optional `DIČ`.
- Rules:
- Name min 2 characters.
- Valid email format.
- Valid CZ/SK phone format.
- For company: company name min 2 chars, ICO exactly 8 digits.
- GDPR consent mandatory; marketing consent optional.
- Errors:
- Summary links to field IDs.
- Consent error appears near checkbox and in summary.

## Step 5 - Souhrn a odeslání
- Fields: no new inputs, submit action.
- Rules:
- Submit re-validates all required fields server-side.
- On fail: summary message + preserve entered data.
- On success: show order ID, manual confirmation expectation, support contacts.

## Funnel Events (Analytics)
- `start_order`
- `order_step_view`
- `order_step_complete`
- `order_validation_error`
- `submit_order`
- `submit_order_success`
- `submit_order_fail`
