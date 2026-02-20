# P2-01 Evidence: Lehká lokalitní struktura

- Date: 2026-02-20
- Goal: Zavést max 2-3 kvalitní lokalitní stránky bez thin-page expanze.
- Scope implemented: 1 hub + 2 lokalitní stránky.

## Implemented pages

- `/lokality` (hub)
- `/lokality/praha`
- `/lokality/stredocesky-kraj`

## Validation snapshot

| URL | HTTP | title | canonical |
|---|---:|---|---|
| `/lokality` | 200 | `Lokality obsluhy | Demolice Recyklace` | `https://www.demolicerecyklace.cz/lokality` |
| `/lokality/praha` | 200 | `Demolice a kontejnery Praha | Demolice Recyklace` | `https://www.demolicerecyklace.cz/lokality/praha` |
| `/lokality/stredocesky-kraj` | 200 | `Demolice a kontejnery Středočeský kraj | Demolice Recyklace` | `https://www.demolicerecyklace.cz/lokality/stredocesky-kraj` |

## Commands used

```bash
for u in /lokality /lokality/praha /lokality/stredocesky-kraj; do
  curl -s -o /dev/null -w '%{http_code}\n' "http://localhost:3000$u"
  curl -s "http://localhost:3000$u" | rg -o '<title>[^<]+' -m1
  curl -s "http://localhost:3000$u" | rg -o '<link rel="canonical" href="[^"]+' -m1
done

curl -s http://localhost:3000/sitemap.xml | rg '/lokality(|/praha|/stredocesky-kraj)</loc>'
```

## Sitemap check

- `sitemap.xml` obsahuje:
  - `/lokality`
  - `/lokality/praha`
  - `/lokality/stredocesky-kraj`

## Discovery links

- Lokalitní hub je dostupný z footeru (`/lokality`).
- Lokalitní odkazy jsou propojené se službami a objednávkou.

## Risk control

- Záměrně jen 2 lokalitní stránky (Praha + Středočeský kraj), bez masového generování městských variant.
- Každá stránka má vlastní intent a přímé CTA na službu/objednávku/ceník.
