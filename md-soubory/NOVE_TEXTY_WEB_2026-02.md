# Nové texty webu (únor 2026)

Cíl přepisu:
- jednoduchá spisovná čeština ve vykání,
- bez Czenglish v běžných větách,
- jasné kroky a očekávání pro návštěvníky 30+,
- konzistentní terminologie napříč webem.

## Přehled klíčových změn (starý -> nový)

| Stránka / komponenta | Starý text | Nový text | Důvod změny |
| --- | --- | --- | --- |
| `src/app/page.tsx` | „Demolice, recyklace a online objednávka...“ | „Demolice, recyklace a objednávka kontejneru přes web...“ | Odstranění Czenglish, jasnější formulace. |
| `src/app/page.tsx` | „Začít online, nebo rovnou zavolat?“ | „Začít přes web, nebo rovnou zavolat?“ | Jednotný jazyk napříč webem. |
| `src/app/kontejnery/page.tsx` | „Kontejnery - online objednávka“ | „Kontejnery - objednávka přes web“ | Jasné a plně české pojmenování. |
| `src/app/kontejnery/page.tsx` | „Dostupné online“ | „Dostupné přes web“ | Konzistence stylu. |
| `src/app/kontejnery/faq/page.tsx` | „FAQ - Kontejnery“ | „Časté dotazy - kontejnery“ | Vyšší srozumitelnost pro širší publikum. |
| `src/app/kontakt/page.tsx` | „Nejrychlejší je online objednávka.“ | „Nejrychlejší je objednávka přes web.“ | Přímé a české vyjádření. |
| `src/app/o-nas/page.tsx` | „Online objednávka 3m³ kontejneru...“ | „Objednávka kontejneru 3 m³ přes web...“ | Bez Czenglish + sjednocení zápisu jednotek. |
| `src/app/cenik/page.tsx` | „Otevřít originální PDF ceník“ | „Otevřít původní ceník (PDF)“ | Přirozenější jazyk, méně technický tón. |
| `src/app/cenik/page.tsx` | „Objednat kontejner online“ | „Objednat kontejner přes web“ | Konzistentní CTA. |
| `src/app/faq/page.tsx` | „...založit objednávku online.“ | „...založit objednávku přes web.“ | Sjednocení termínů. |
| `src/app/gdpr/page.tsx` | „...při online objednávce...“ | „...při objednávce kontejneru přes web...“ | Srozumitelnější formulace. |
| `src/app/obchodni-podminky/page.tsx` | „Objednávka se podává online formulářem...“ | „Objednávka se podává formulářem přes web.“ | Jednodušší a čitelnější věta. |
| `src/app/dokumenty/page.tsx` | „Originální PDF verze...“ | „Původní verze... ve formátu PDF.“ | Srozumitelnější popis dokumentů. |
| `src/components/site-footer.tsx` | „Online objednávka kontejneru...“ | „Objednávka kontejneru ... přes web...“ | Konzistentní jazyk ve všech veřejných blocích. |
| `src/components/cookie-consent-manager.tsx` | „Používání cookies“ | „Používání souborů cookies“ | Lepší srozumitelnost pro méně technické uživatele. |
| `src/components/cookie-consent-manager.tsx` | „Souhlasím“ | „Povolit analytiku“ | Jasnější význam tlačítka. |
| `src/components/cookie-consent-settings.tsx` | „Odmítnout analytiku“ | „Odmítnout analytické cookies“ | Přesnější jazyk vůči volbě uživatele. |
| `src/components/order-wizard.tsx` | „...online nedoručujeme...“ | „...přes web nedoručujeme...“ | Bez Czenglish, stejný význam. |
| `src/components/order-wizard.tsx` | „Požadavek na zavolání...“ | „Požadavek na zpětné zavolání...“ | Přesnější a přirozenější čeština. |
| `src/components/order-wizard.tsx` | „Člověk“ | „Fyzická osoba“ | Profesionální terminologie. |
| `src/components/order-wizard.tsx` | „Pin:“ | „Bod na mapě:“ | Srozumitelnější výraz pro širší publikum. |
| `src/components/order-wizard.tsx` | „Aktualizuji pin...“ | „Aktualizuji bod na mapě...“ | Jazyková konzistence. |
| `src/app/admin/objednavky/page.tsx` | „Callback:“ | „Zpětné zavolání:“ | Počeštění interních textů. |
| `src/app/admin/objednavky/[id]/page.tsx` | „Blokováno rate-limitem“ | „Blokováno limitem požadavků“ | Odstranění anglicismu v adminu. |
| `src/app/admin/objednavky/[id]/page.tsx` | „Blokováno honeypot ochranou“ | „Blokováno ochranou proti robotům“ | Srozumitelnější interní text. |
| `src/components/admin-order-location-editor.tsx` | „Lokalita a přesný pin“ | „Lokalita a přesný bod na mapě“ | Srozumitelnost i pro netechnické uživatele. |
| `src/components/admin-order-pin-map.tsx` | „Pin není nastaven.“ | „Bod na mapě není nastaven.“ | Jazyková jednotnost v interním rozhraní. |
| `src/lib/faq-content.ts` | „Mohu objednat kontejner online...“ | „Mohu objednat kontejner přes web...“ | Celkové počeštění FAQ. |
| `src/lib/container-content.ts` | „...ne jen v PDF“ + delší formulace | kratší a přímé věty | Vyšší čitelnost pro 30+ publikum. |
| `src/lib/cms/mappers.ts` | fallbacky s „online“, delšími větami | fallbacky s „přes web“, kratšími větami | Jednotný tón i bez vyplněného CMS. |
| `src/lib/site-config.ts` | „Materiál“, „FAQ“ | „Prodej materiálu“, „Časté dotazy (FAQ)“ | Jednoznačnější navigace. |
| `src/lib/validators.ts` | „PSČ zatím online nepodporujeme“ | „PSČ zatím v objednávce přes web nepodporujeme“ | Konzistentní jazyk i ve validačních hláškách. |
| `src/lib/email-templates.ts` | „Callback poznámka“, „Nový callback lead...“ | „Poznámka ke zpětnému zavolání“, „Nový požadavek na zpětné zavolání...“ | Počeštění interní e-mailové komunikace. |
| `src/sanity/schemaTypes/documents/*` | mix angličtiny a nejednotných názvů | české názvy polí (např. „Hlavní titulek“, „SEO titulek“) | Jednodušší práce redaktorů v administraci. |

## Terminologie sjednocená napříč webem

- „objednávka přes web"
- „termín potvrzuje operátor"
- „kontejner 3 m³"
- „zpětné zavolání"
- „bod na mapě"

## Poznámka k nasazení

- Primární zdroj textů zůstává Sanity CMS.
- V kódu byly zároveň upravené fallback texty, aby při chybějícím CMS obsahu zůstala konzistentní čeština.
