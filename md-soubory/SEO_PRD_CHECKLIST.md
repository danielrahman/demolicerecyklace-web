# SEO PRD CHECKLIST (CORE) — demolicierecyklace.cz

- Datum startu: 2026-02-20
- Scope: Core (bez overkillu)
- Segment: lokální služby (Praha + Středočeský kraj)
- Hlavní cíl: více poptávek/objednávek přes organiku
- Pravidlo dokončení: u splněného bodu použít prefix `hotovo:` + vyplněná `Evidence`

## Co záměrně vypouštíme

- Log file analýza (blok G)
- Rozšířený OfferCatalog model a složitá schema architektura
- Masivní expanze lokalitních stránek
- Enterprise governance procesy

## P0 (must-have před/krátce po launchi)

- hotovo: `P0-01` | `robots.txt` + `sitemap.xml` funkční | Owner: `dev` | Evidence: `curl -I http://localhost:3000/robots.txt` = `200`, `curl -I http://localhost:3000/sitemap.xml` = `200`; soubory `src/app/robots.ts`, `src/app/sitemap.ts`.
- hotovo: `P0-02` | Indexují se jen veřejné stránky (ne `admin`/`api`/`studio`) | Owner: `dev` | Evidence: `robots.txt` disallow `/admin/`, `/api/`, `/studio/`; `meta robots noindex` na `/admin/prihlaseni`, `/studio`, `/kontejnery/objednat`.
- hotovo: `P0-03` | Každá hlavní stránka má unikátní `title` + `meta description` | Owner: `dev+content` | Evidence: smoke test na `/`, `/demolice`, `/kontejnery`, `/recyklace`, `/cenik`, `/kontakt`, `/faq`, `/kontejnery/objednat` -> `8/8` unikátní title i description.
- hotovo: `P0-04` | Canonical na hlavních stránkách bez konfliktů | Owner: `dev` | Evidence: canonical link přítomen na klíčových stránkách; centrální `SITE_URL` v `src/lib/site-config.ts`.
- hotovo: `P0-05` | 404/redirect chain audit (bez chainů na interních odkazech) | Owner: `dev` | Evidence: interní odkazy z `/`, `/demolice`, `/kontejnery`, `/recyklace` audit (`26` URL) bez `301/302/307/308`.
- hotovo: `P0-06` | Jasné CTA z `/demolice`, `/kontejnery`, `/recyklace` na objednávku/kontakt | Owner: `content` | Evidence: kontrola CTA v šablonách (`/kontejnery/objednat`, `CONTACT.phoneHref`, `mailto`).
- hotovo: `P0-07` | Konverzní měření: `start_order`, `submit_order`, `submit_order_success` | Owner: `dev+ops` | Evidence: event typy v `src/lib/analytics.ts`; triggery ve `src/components/order-wizard.tsx`.
- `P0-08` | Mobile UX objednávky bez blockeru | Owner: `dev` | Evidence: čeká na manuální device QA (iOS/Android + reálné vyplnění formuláře).

## P1 (po stabilizaci)

- `P1-01` | Základní schema: `Organization`/`LocalBusiness` | Owner: `dev` | Evidence:
- `P1-02` | `FAQPage` schema jen tam, kde je viditelné FAQ | Owner: `dev` | Evidence:
- `P1-03` | `BreadcrumbList` schema na podstránkách | Owner: `dev` | Evidence:
- `P1-04` | NAP konzistence (web + GBP + citace) | Owner: `ops` | Evidence:
- `P1-05` | GBP profil kompletní a aktivně spravovaný | Owner: `ops` | Evidence:
- `P1-06` | 3-5 money obsahových stránek (bez blog spamu) | Owner: `content` | Evidence:
- `P1-07` | CWV kontrola pro homepage + service + order template | Owner: `dev` | Evidence:

## P2 (nice-to-have)

- `P2-01` | Lehká lokalitní struktura (max 2-3 kvalitní lokality) | Owner: `content` | Evidence:
- `P2-02` | Rozšíření interního prolinkování mezi službami a ceníkem | Owner: `content` | Evidence:
- `P2-03` | Měsíční mini-audit (indexace, dotazy, konverze) | Owner: `ops` | Evidence:

## Technické změny v této fázi

- hotovo: Přidané soubory `src/app/robots.ts`, `src/app/sitemap.ts`.
- hotovo: Doplněné page-level metadata na hlavních servisních stránkách.
- hotovo: Core schema minimum (`Organization`/`LocalBusiness`, `FAQPage`, `BreadcrumbList`).

## Test cases (Core)

1. `robots.txt` vrací 200 a neblokuje money pages.
2. `sitemap.xml` vrací 200 a obsahuje jen indexovatelné URL.
3. Top stránky mají unikátní `title`/`description`.
4. Canonical je konzistentní (bez konfliktů).
5. Žádný interní odkaz nevede přes redirect chain >1.
6. Objednávkový funnel eventy odpovídají reálným objednávkám.
7. Mobilní dokončení objednávky proběhne bez kritické chyby.
8. Základní schema projde v `validator.schema.org`.
9. NAP údaje sedí mezi webem a GBP.
10. GSC neukazuje kritické coverage chyby po release.

## Poznámky

- Jazyk: pouze `cs`.
- Priorita: méně věcí, ale dotažených do výsledku.

