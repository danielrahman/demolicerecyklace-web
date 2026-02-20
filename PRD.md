# PRD - Nový web demolicerecyklace.cz (obsah + UX + kontejnerový funnel)

## 1. Shrnutí

Cílem je postavit nový web, který zachová černo-žlutý brand, ale výrazně zlepší strukturu obsahu, důvěryhodnost a konverze. Web bude dál fungovat jako marketingový web pro demolice a recyklaci, současně ale přidá samostatný funnel `Kontejnery` s online objednávkou. Klíčová změna je převod ceníků a pravidel z PDF do čitelného HTML a zavedení jednoduchého objednávkového wizardu, který po odeslání vytvoří objednávku v databázi, pošle e-maily a vždy čeká na ruční potvrzení termínu operátorem.

## 2. Cile a metriky

### Business cíle

- Zvýšit počet online objednávek kontejnerů.
- Snížit počet objednávek přes telefon.
- Zlepšit důvěru díky reálným fotkám, referencím, pravidlům odpadu a transparentním podmínkám.
- Zlepšit lokální SEO pro Prahu a Středočeský kraj.

### KPI (prvních 6 měsíců po spuštění)

- `Container landing -> start wizard`: min. 18 %.
- `Start wizard -> submit`: min. 35 %.
- `Container landing -> submit`: min. 6 %.
- `Podíl online objednávek`: min. 30 % ze všech objednávek kontejnerů.
- `Míra opuštění po 1. kroku`: max. 45 %.
- `Nevalidní objednávky`: max. 12 %.
- `LCP (mobile)`: pod 2.5 s.
- `INP`: pod 200 ms.
- `CLS`: pod 0.1.
- `Podíl ceníkových informací v HTML`: 100 %.

### Servisní oblast a PSČ (MVP)

- Primární oblast: Praha + Středočeský kraj.
- Podporovaná PSČ se validují v objednávce.

Praha - seznam PSČ:  
10000, 10100, 10200, 10300, 10400, 10500, 10600, 10700, 10800, 10900, 11000, 11800, 11900, 12000, 12100, 12200, 12600, 12700, 12800, 13000, 14000, 14100, 14200, 14300, 14700, 14800, 14900, 15000, 15100, 15200, 15300, 15400, 15500, 15600, 15800, 15900, 16000, 16100, 16200, 16300, 16400, 16500, 16900, 17000, 17100, 18000, 18100, 18200, 18400, 19000, 19100, 19300, 19600, 19700, 19800, 19900.

Středočeský kraj - kompletní seznam PSČ:  
25001, 25063, 25064, 25065, 25066, 25067, 25068, 25069, 25101, 25162, 25163, 25164, 25165, 25166, 25167, 25168, 25169, 25216, 25217, 25218, 25219, 25220, 25221, 25222, 25223, 25224, 25225, 25226, 25227, 25228, 25229, 25230, 25231, 25241, 25242, 25243, 25244, 25245, 25246, 25247, 25248, 25249, 25250, 25251, 25261, 25262, 25263, 25264, 25265, 25266, 25267, 25268, 25269, 25270, 25271, 25272, 25273, 25274, 25275, 25276, 25277, 25278, 25279, 25280, 25281, 25282, 25283, 25284, 25285, 25286, 25287, 25288, 25289, 25290, 25291, 25292, 25293, 25294, 25295, 25296, 25297, 25298, 25299, 25301, 25302, 25303, 25304, 25305, 25401, 25421, 25422, 25423, 25424, 25425, 25426, 25427, 25428, 25429, 25430, 25431, 25432, 25433, 25434, 25435, 25436, 25437, 25438, 25439, 25440, 25441, 25442, 25443, 25444, 25445, 25446, 25447, 25448, 25449, 25450, 25451, 25452, 25453, 25454, 25455, 25456, 25457, 25458, 25459, 25460, 25461, 25462, 25463, 25464, 25465, 25466, 25467, 25468, 25469, 25470, 25471, 25472, 25473, 25474, 25475, 25476, 25477, 25478, 25479, 25480, 25481, 25482, 25483, 25484, 25485, 25486, 25487, 25488, 25489, 25490, 25491, 25492, 25493, 25494, 25495, 25496, 25497, 25498, 25499, 25601, 25602, 25603, 25604, 25605, 25606, 25607, 25608, 25609, 25610, 25611, 25612, 25613, 25614, 25615, 25616, 25617, 25618, 25619, 25620, 25621, 25622, 25623, 25624, 25625, 25626, 25627, 25628, 25629, 25630, 25631, 25632, 25633, 25634, 25635, 25636, 25637, 25638, 25639, 25640, 25641, 25642, 25643, 25644, 25645, 25646, 25647, 25648, 25649, 25650, 25651, 25652, 25653, 25654, 25655, 25656, 25657, 25658, 25659, 25660, 25661, 25662, 25663, 25664, 25665, 25666, 25667, 25668, 25669, 25670, 25671, 25672, 25673, 25674, 25675, 25676, 25677, 25678, 25679, 25680, 25681, 25682, 25683, 25684, 25685, 25686, 25687, 25688, 25689, 25690, 25691, 25692, 25693, 25694, 25695, 25696, 25697, 25698, 25699, 26001, 26005, 26101, 26102, 26103, 26104, 26105, 26106, 26107, 26108, 26109, 26110, 26111, 26112, 26113, 26114, 26115, 26116, 26117, 26118, 26119, 26120, 26121, 26122, 26123, 26124, 26125, 26126, 26127, 26128, 26129, 26130, 26131, 26132, 26133, 26134, 26135, 26136, 26137, 26138, 26139, 26140, 26141, 26142, 26143, 26144, 26145, 26146, 26147, 26148, 26149, 26150, 26151, 26152, 26153, 26154, 26155, 26156, 26157, 26158, 26159, 26160, 26161, 26162, 26163, 26164, 26165, 26166, 26167, 26168, 26169, 26170, 26171, 26172, 26173, 26174, 26175, 26176, 26177, 26178, 26179, 26180, 26181, 26182, 26183, 26184, 26185, 26186, 26187, 26188, 26189, 26190, 26191, 26192, 26193, 26194, 26195, 26196, 26197, 26198, 26199, 26601, 26603, 27201, 27203, 27351, 27601.

### ASSUMPTION

- Středočeský seznam je startovní pro MVP a může se průběžně rozšířit podle kapacit.

## 3. Cilove publikum a use-cases

### Segmenty

- FO: rekonstrukce bytu/domu, vyklízení, menší stavební práce.
- Firma: stavební firmy, řemeslníci, developeři, facility.

### Typické scénáře

- Potřebuji kontejner rychle, chci vidět jasný postup a orientační cenu.
- Řeším demolici a chci hned vědět, co umíte a jak poptat realizaci.
- Nejsem si jistý typem odpadu a nechci riskovat doplatek.
- Chci mít jistotu, že termín vždy finálně potvrdí člověk.

### Potřeby podle segmentu

- FO: jednoduchost, cena, pravidla, jistota bez překvapení.
- Firma: rychlé objednání, opakované zakázky, přehledná komunikace, fakturace.

## 4. Konkurencni audit - hlavni zaver


| Web                                                                                                                  | Co dělají dobře                                | Co dělají špatně                             | Co převezmeme                                      |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------- | -------------------------------------------------- |
| [https://www.demolicerecyklace.cz/](https://www.demolicerecyklace.cz/)                                               | Silný brand, jednoduchý web, jasné služby      | Klíčový obsah v PDF, chybí online objednávka | Zachovat jednoduchost, doplnit HTML ceník a funnel |
| [https://www.cannoneer.cz/](https://www.cannoneer.cz/)                                                               | Kvalitní technické foto, reference realizací   | Slabší konverzní cesta pro rychlou poptávku  | Sekci realizací a techniky                         |
| [https://www.demolicestaveb-praha.cz/](https://www.demolicestaveb-praha.cz/)                                         | Lokální relevance Praha                        | Zastaralý UX, slabší důvěra                  | Lokální SEO témata, ale moderně                    |
| [https://www.recyklacezajezd.cz/](https://www.recyklacezajezd.cz/)                                                   | Ceník v HTML, sekce strojního parku            | Slabší mobilní UX, bez wizardu               | HTML ceník a obsah strojů                          |
| [http://www.mrozek.cz/](http://www.mrozek.cz/)                                                                       | Silné case studies                             | Slabší přímá konverzní cesta                 | Projektové karty pred/po                           |
| [https://www.tsr.cz/](https://www.tsr.cz/)                                                                           | Důvěra značky, ceník pro veřejnost             | Komplexní corporate struktura                | Transparentnost ceníků a provozních informací      |
| [https://odpady-janecek.cz/](https://odpady-janecek.cz/)                                                             | Silný lokální funnel, FAQ, online objednávky   | Vyšší textová hustota                        | Přímý vstup do objednávky z více míst              |
| [https://a1recyklace.cz/kontejnery-a-odvoz-odpadu/](https://a1recyklace.cz/kontejnery-a-odvoz-odpadu/)               | Přehled služeb, lokální copy                   | Objednávka spíš kontaktní formulář           | Přehledný obsah služeb + jasné CTA                 |
| [https://www.rieger-entsorgung.at/de/](https://www.rieger-entsorgung.at/de/)                                         | Dobrá logika wizardu a pravidla odpadu         | Více obsahových větví může brzdit            | Krokový model: PSČ -> odpad -> velikost -> termín  |
| [https://www.ecoservice24.com/de/containerdienst/](https://www.ecoservice24.com/de/containerdienst/)                 | Silný online self-service, FAQ, lexikon odpadu | Složitější rozhraní pro MVP                  | Edukační obsah + jednoduchý wizard                 |
| [https://www.odpadonline.sk/](https://www.odpadonline.sk/)                                                           | Čistý krokový flow, srozumitelný progress      | Delší flow v některých krocích               | Jasný stepper a validace                           |
| [https://odpadeo.pl/](https://odpadeo.pl/)                                                                           | FO/Firma větvení, online objednávka            | Více paralelních variant                     | Jednoduché FO/Firma větvení                        |
| [https://smieci.eu/zamow/kontener/](https://smieci.eu/zamow/kontener/)                                               | Pokročilý objednávkový flow                    | Na MVP zbytečně robustní                     | Modulární architektura, platby až ve Phase 2       |
| [https://www.bys.pl/uslugi/wywoz-gruzu-warszawa-i-okolice](https://www.bys.pl/uslugi/wywoz-gruzu-warszawa-i-okolice) | Silné CTA, podmínky služby                     | Textově přetížená stránka                    | Jasné podmínky a obchodní pravidla                 |
| [https://zamow-kontener.pl/](https://zamow-kontener.pl/)                                                             | Přímý objednávkový vstup, social proof         | Delší SEO texty                              | Silné CTA + typy kontejnerů                        |
| [https://www.remondis-entsorgung.de/](https://www.remondis-entsorgung.de/)                                           | Výborný katalog odpadů, compliance             | Corporate navigace je těžší                  | Struktura pravidel odpadu a compliance texty       |
| [https://prezero-international.com](https://prezero-international.com)                                               | Trust a compliance obsah na vysoké úrovni      | Není to konverzní web pro rychlý order       | Vzor trust/compliance sekcí                        |


### Hlavní závěr auditu

- Nejlépe konvertují weby, které kombinují `HTML ceník`, `pravidla odpadu` a `krokový objednávkový flow`.
- Nejhůř fungují weby, kde je objednávka jen přes obecný formulář nebo jsou podmínky schované v PDF.
- Pro tento projekt je správný směr: jednoduchý marketingový web + samostatný funnel `Kontejnery`.

## 5. Informacni architektura webu (sitemap)

```text
/
|- /kontejnery
|  |- /kontejnery/cenik
|  |- /kontejnery/co-patri-nepatri
|  |- /kontejnery/objednat
|  |- /kontejnery/faq
|  |- /kontejnery/lokality
|     |- /kontejnery/lokality/praha
|     |- /kontejnery/lokality/stredocesky-kraj
|- /demolice
|- /recyklace
|- /prodej-materialu
|- /technika
|- /realizace
|- /o-nas
|- /kontakt
|- /faq
|- /obchodni-podminky
|- /gdpr
|- /cookies
```

### IA principy

- `Kontejnery` jsou samostatný pilíř webu.
- Ceník a pravidla odpadu mají vlastní indexovatelné URL.
- Lokální stránky mají unikátní obsah, ne duplikáty.

## 6. Specifikace stranek

### `/`

- Cíl: rychle nasměrovat uživatele do správné služby.
- Sekce: Hero, služby, proč my, technika, realizace, ceník preview, FAQ, kontakt.
- CTA: `Objednat kontejner`, `Poptat demolici`, `Zobrazit ceník`.

### `/kontejnery`

- Cíl: hlavní vstup do objednávkového funnelu.
- Sekce: typy odpadu, aktuálně dostupný kontejner, průběh objednávky, pravidla, FAQ.
- CTA: `Spustit online objednávku`.

### `/kontejnery/cenik`

- Cíl: transparentní ceník v HTML.
- Sekce: filtry (lokalita, typ odpadu), tabulka cen, doplatky, podmínky.
- CTA: `Objednat 3 m3 kontejner`.

### `/kontejnery/co-patri-nepatri`

- Cíl: snížit chybné objednávky.
- Sekce: kategorie odpadu, co patří, co nepatří, časté chyby, upozornění.
- CTA: `Pokračovat do objednávky`.

### `/kontejnery/objednat`

- Cíl: dokončit objednávku bez volání.
- Sekce: krokový wizard + souhrn.
- CTA: `Odeslat objednávku`.

### `/demolice`

- Cíl: lead generation pro demoliční práce.
- Sekce: rozsah služeb, postup, technika, reference, poptávkový formulář.
- CTA: `Nezávazně poptat demolici`.

### `/recyklace`

- Cíl: vysvětlit recyklační služby a podmínky příjmu.
- Sekce: přijímané materiály, proces, provozní informace.
- CTA: `Zjistit podmínky`.

### `/prodej-materialu`

- Cíl: cross-sell recyklátů.
- Sekce: sortiment, frakce, dostupnost, doprava.
- CTA: `Poptat materiál`.

### `/technika`

- Cíl: důvěra přes konkrétní stroje a vozidla.
- Sekce: vozový park, parametry, fotogalerie.
- CTA: `Poptat realizaci`.

### `/realizace`

- Cíl: social proof.
- Sekce: projektové karty, filtry, foto pred/po, výsledky.
- CTA: `Poptat podobnou realizaci`.

### `/kontakt`

- Cíl: rychlý kontakt a fallback cesta.
- Sekce: telefon, e-mail, provozní doba, mapa, fakturační údaje.
- CTA: `Zavolat`, `Napsat`, `Objednat kontejner`.

## 7. Kontejnerovy funnel - UX flow

### Flow kroky (MVP)

1. Typ zákazníka

- Pole: `FO/Firma`.
- Validace: povinné.

1. Lokalita

- Pole: `PSČ`, `Město`, `Ulice`, `Číslo popisné`, `Poznámka k příjezdu`.
- Validace: PSČ musí být v seznamu podporovaných PSČ.
- Error state: `Do této lokality zatím online nedoručujeme` + CTA `Nezávazně poptat`.

1. Typ odpadu

- Pole: kategorie odpadu (suť čistá, suť směsná, objemný odpad, zemina, dřevo).
- U každé kategorie text `Co patří / Co nepatří`.

1. Velikost kontejneru

- Aktuálně dostupná velikost: `3 m3`.
- Pole: `Objem = 3 m3`, `Počet kusů`.
- Budoucí rozšíření: 5 m3, 7 m3, 9 m3, 12 m3.
- ASSUMPTION: pro MVP max 3 kontejnery na objednávku.

1. Termín a umístění

- Pole: `Datum přistavení`, `Časové okno`, `Soukromý/Veřejný prostor`, `Povolení`.
- Pokud je veřejný prostor bez povolení, zobrazí se varování.

1. Doplňky

- Pole: `Nakládka od nás`, `Expresní přistavení`, `Opakovaný odvoz`.

1. Kontaktní údaje

- FO: `Jméno`, `Telefon`, `E-mail`.
- Firma: navíc `Firma`, `IČO`, volitelně `DIČ`.
- Povinný souhlas s GDPR.

1. Souhrn a odeslání

- Rekapitulace volby + orientační cena.
- Po odeslání: informace, že termín bude vždy potvrzen ručně operátorem.

### Potvrzení termínu

- Termín není po odeslání automaticky garantovaný.
- Každou objednávku potvrzuje operátor ručně.
- V detailu objednávky je stav `new`, po ručním ověření se mění na `confirmed`.

### Error states

- Nepodporované PSČ.
- Nevalidní kombinace odpadu.
- Zakázané příměsi.
- Termín mimo provoz.
- Duplicitní objednávka v krátkém čase.

### Edge cases

- Návrat do wizardu obnoví draft na 24 hodin.
- Přepnutí FO/Firma zachová již vyplněná data.
- Nebezpečný odpad přesměruje na individuální poptávku.

### Event tracking (GA4)

- `view_containers`
- `start_order`
- `order_step_view`
- `order_step_complete`
- `order_validation_error`
- `submit_order`
- `submit_order_success`
- `submit_order_fail`

## 8. Cenik a pravidla odpadu - jak je zobrazit na webu

### Co vytáhnout z aktuálních PDF

- `cenik+recyklacni_stredisko_demolice_recyklace.pdf`
- `cenik_doprava+pronajem_stavebnich_stroju_demolice_recyklace.pdf`
- `cenik_rucnich_demolicnich_praci_demolice_recyklace.pdf`

### Zobrazení ceníku

- Desktop: tabulka s filtry.
- Mobile: karty a akordeony.
- Každá položka musí mít:
- co je v ceně
- co není v ceně
- limity
- možné doplatky

### Aktuální produkt kontejnerů

- MVP ceník obsahuje pouze `kontejner 3 m3`.
- U ostatních velikostí zobrazit `Brzy dostupné` bez možnosti objednat.

### Pravidla odpadu

- Pro každou kategorii jasně oddělit `Patří` a `Nepatří`.
- Přidat příklady chyb a upozornění na doplatky.
- Podmínky nesmí být jen v PDF.

## 9. Copy guideline

### Tone of voice

- Věcný, srozumitelný, stručný.
- Bez prázdných marketingových frází.

### Pravidla textu

- Aktivní formulace: `Přistavíme`, `Odvezeme`, `Potvrdíme termín`.
- Krátké odstavce a jasné mezititulky.
- Jednoznačná CTA.

### Zakázané věci

- Anglické výplňové fráze.
- Superlativy bez důkazu.
- Skryté podmínky mimo web.

### Doporučené texty

- Hero: `Kontejner 3 m3 přistavíme rychle. Objednávku potvrdí operátor.`
- Po submitu: `Objednávku jsme přijali. Brzy vás kontaktujeme s potvrzením termínu.`

## 10. Foto a video shot list


| Záběr                          | Účel                        | Umístění                           |
| ------------------------------ | --------------------------- | ---------------------------------- |
| Přistavení kontejneru v ulici  | Důvěra a realita služby     | `/kontejnery` hero                 |
| Kontejner 3 m3 z více úhlů     | Jasná představa o velikosti | `/kontejnery`, `/kontejnery/cenik` |
| Správné třídění odpadu         | Edukace co patří a nepatří  | `/kontejnery/co-patri-nepatri`     |
| Řidič a obsluha                | Lidský rozměr               | Homepage, `/o-nas`                 |
| Recyklační středisko v provozu | Důvěryhodnost zázemí        | `/recyklace`                       |
| Demolice pred/po               | Výsledek práce              | `/realizace`, `/demolice`          |
| Přehled vozového parku         | Kapacita firmy              | `/technika`                        |
| Kontaktní osoba v kanceláři    | Důvěra a dostupnost         | `/kontakt`                         |
| Krátké video průběhu služby    | Lepší engagement            | Homepage a `/kontejnery`           |


## 11. Design system (tokens)

### Vizuální směr

- Zachovat černo-žlutou identitu.
- Modernizovat typografii, spacing a komponenty.
- Mobile-first layout.

### Barvy

- `--color-bg-primary: #0B0B0B`
- `--color-bg-secondary: #161616`
- `--color-surface: #1F1F1F`
- `--color-accent: #F2C400`
- `--color-accent-hover: #D9AF00`
- `--color-text-primary: #F5F5F5`
- `--color-text-secondary: #C9C9C9`
- `--color-error: #C93535`

### Typografie

- Nadpisy: `Barlow Condensed`.
- Text: `Source Sans 3`.
- Technické údaje: `IBM Plex Mono`.

### Spacing

- `4, 8, 12, 16, 24, 32, 40, 56, 72`.

### Klíčové komponenty

- `Button`
- `PriceCard`
- `WasteRuleCard`
- `WizardStepper`
- `InlineAlert`
- `TrustStrip`

## 12. Datovy model a backend specifikace

### Datový model (MVP)

#### `containerOrders`

- `_id`
- `createdAt`
- `status`: `new | confirmed | done | cancelled`
- `customerType`: `fo | firma`
- `name`
- `companyName` nullable
- `ico` nullable
- `dic` nullable
- `email`
- `phone`
- `postalCode`
- `city`
- `street`
- `houseNumber`
- `wasteType`
- `containerSizeM3` - pro MVP vždy `3`
- `containerCount`
- `deliveryDateRequested`
- `timeWindowRequested`
- `deliveryDateConfirmed` nullable
- `timeWindowConfirmed` nullable
- `placementType`: `soukromy | verejny`
- `permitConfirmed`
- `extras`
- `priceEstimate`
- `note`
- `internalNote` nullable
- `gdprConsent`
- `marketingConsent`
- `source`: `web`

#### `orderEvents`

- `_id`
- `orderId`
- `eventType`: `created | emailed_customer_received | emailed_internal_new | status_changed | emailed_customer_confirmed`
- `payload`
- `createdAt`

#### `adminUsers`

- `_id`
- `email`
- `role`: `admin | operator`
- `active`

#### `rateLimitBuckets`

- `_id`
- `count`
- `windowStart`

### API funkce (vendor agnostic)

- `GET /api/catalog` - typy odpadu, pravidla, dostupné velikosti kontejneru.
- `POST /api/pricing/preview` - orientační cena.
- `POST /api/orders` - vytvoření objednávky.
- `GET /api/admin/orders` - seznam objednávek s filtrem stavu.
- `GET /api/admin/orders/{id}` - detail objednávky.
- `POST /api/admin/orders/{id}/confirm` - potvrzení termínu.
- `POST /api/admin/orders/{id}/cancel` - storno objednávky.
- `POST /api/admin/orders/{id}/reschedule` - úprava termínu.
- `POST /api/admin/orders/{id}/internal-note` - interní poznámka.

### Admin rozhraní (MVP)

Cíl: maximální jednoduchost pro obsluhu 45+.

Funkce:

- Přihlášení.
- Seznam objednávek.
- Filtr podle stavu: `new`, `confirmed`, `done`, `cancelled`.
- Detail objednávky.
- Tlačítka: `Potvrdit`, `Stornovat`, `Upravit termín`.
- Pole `Interní poznámka`.
- Bez dashboardu a bez grafů.

### Doporučený stack backendu (bez Convex)

- Databáze: `PostgreSQL` (Supabase nebo Neon).
- ORM: `Drizzle ORM`.
- Auth pro admin: `Auth.js` (credentials + role `admin/operator`).
- E-maily: `Resend` nebo `Mailgun`.
- Hosting: `Vercel` (frontend + API) + managed PostgreSQL.

### ASSUMPTION

- Pro MVP je výhodnější jeden jednoduchý backend v Next.js API route handlers bez oddělené mikroservisy.

### E-mail flow

Po submitu:

- E-mail zákazníkovi: `Objednávku jsme přijali, budeme vás kontaktovat.`
- E-mail internímu týmu: `Nová objednávka` + rychlý přehled.

Po potvrzení operátorem:

- E-mail zákazníkovi s potvrzeným termínem.

### Validace a anti-spam

- Server-side validace všech polí.
- Validace PSČ proti whitelistu.
- Povinný GDPR souhlas.
- Limit 5 submitů na IP za 30 minut.
- Honeypot pole.

## 13. Bezpecnost a compliance

### GDPR

- Samostatná stránka GDPR.
- Ukládání času souhlasu.
- Retence dat pro provozní účely.

### Bezpečnost

- HTTPS.
- Ochrana formuláře proti spamu.
- Logování důležitých změn stavu objednávky.

### Doručitelnost e-mailů

- SPF, DKIM, DMARC.
- Retry při selhání odeslání.

## 14. Performance a pristupnost

### Core Web Vitals cíle

- LCP < 2.5 s.
- INP < 200 ms.
- CLS < 0.1.

### Performance checklist

- Statické stránky pro marketingové sekce.
- Optimalizované obrázky (WebP/AVIF).
- Omezit JS v marketingové části.
- Lazy loading mimo hero.

### A11y checklist

- Kontrast min 4.5:1.
- Viditelné focus stavy.
- Ovládání formuláře klávesnicí.
- Chybové hlášky navázané na pole.

## 15. Implementacni plan (MVP vs Phase 2)

### MVP (6-8 týdnů)

- Nová IA a obsahové stránky.
- Kontejnery landing + HTML ceník + pravidla.
- Wizard objednávky bez plateb.
- Backend v Next.js route handlers + PostgreSQL.
- Jednoduchý admin.
- E-mail flow podle specifikace.
- GA4 eventy.

### Phase 2

- Další velikosti kontejnerů.
- Realtime sloty.
- Online platba.
- Rozšíření lokalit.
- Export do Google Sheets.

### Technické varianty řešení

- Varianta A (doporučeno): `Next.js + PostgreSQL + Drizzle + Auth.js + Resend`.
- Varianta B: `Next.js + Supabase (DB + Auth) + Resend`.
- Varianta C: `Astro + backend API (Node) + PostgreSQL`.

### Doporučení

- Pro tento projekt doporučeno `Next.js + PostgreSQL + Drizzle + Auth.js + Resend`.

## 16. Acceptance criteria (testovatelne body)

1. Stránka `/kontejnery` má hlavní CTA na objednávku bez scrollu na mobile.
2. Ceník je v HTML, ne jen v PDF.
3. V objednávce jde zvolit pouze `3 m3` kontejner.
4. Wizard validuje PSČ proti seznamu Praha + Středočeský kraj.
5. Nelze odeslat objednávku bez povinných údajů a GDPR souhlasu.
6. Po submitu vznikne záznam v tabulce `containerOrders` se stavem `new`.
7. Po submitu přijde zákazníkovi e-mail `Objednávku jsme přijali, budeme vás kontaktovat`.
8. Po submitu přijde internímu týmu e-mail s rychlým přehledem.
9. Termín se nastaví jako potvrzený až po ručním zásahu operátora.
10. Po ručním potvrzení přijde zákazníkovi e-mail s potvrzeným termínem.
11. Admin umožní jen: přihlášení, seznam, filtr stavu, detail, potvrdit, stornovat, upravit termín, interní poznámka.
12. Admin neobsahuje dashboard a grafy.
13. Rate limit blokuje nadměrné submity.
14. Stránky splní cíle LCP/INP/CLS.
15. Web splní základ WCAG 2.1 AA pro hlavní tok objednávky.

## 17. Rizika a mitigace (co se muze pokazit a jak tomu predejit)


| Riziko                   | Dopad                       | Mitigace                                                         |
| ------------------------ | --------------------------- | ---------------------------------------------------------------- |
| Chybný výběr typu odpadu | Doplatky a reklamace        | Jasné karty `Patří/Nepatří`, varování ve wizardu                 |
| Nepodporovaná lokalita   | Nedokončená objednávka      | Validace PSČ v kroku 2 + fallback poptávka                       |
| Přetížení operátora      | Zpomalené potvrzení termínů | Prioritizace stavu `new`, jednoduchý admin pro rychlé zpracování |
| Spam objednávky          | Ztráta času obsluhy         | Rate limit, honeypot, server-side validace                       |
| Slabá kvalita fotek      | Nízká důvěra                | Real shot list a konzistentní vizuální styl                      |
| Rozšíření scope mimo MVP | Zpoždění spuštění           | Striktní oddělení MVP a Phase 2                                  |


