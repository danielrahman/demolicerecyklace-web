# SEO Mini Audit (2026-02)

- Date: 2026-02-20 20:41
- Base URL: `http://localhost:3000`
- Scope: indexace + dotazy + konverze (Core monthly check)

## 1) Indexace

- `robots.txt`: HTTP 200
- `sitemap.xml`: HTTP 200
- Počet URL v sitemap: 22

### Money pages snapshot

| URL | HTTP | title | canonical |
|---|---:|---|---|
| `/` | 200 | Demolice Recyklace - Praha a Středočeský kraj | https://www.demolicerecyklace.cz |
| `/demolice` | 200 | Demolice \| Demolice Recyklace | https://www.demolicerecyklace.cz/demolice |
| `/kontejnery` | 200 | Kontejnery na odpad \| Demolice Recyklace | https://www.demolicerecyklace.cz/kontejnery |
| `/recyklace` | 200 | Recyklace \| Demolice Recyklace | https://www.demolicerecyklace.cz/recyklace |
| `/cenik` | 200 | Ceník služeb \| Demolice Recyklace | https://www.demolicerecyklace.cz/cenik |
| `/lokality` | 200 | Lokality obsluhy \| Demolice Recyklace | https://www.demolicerecyklace.cz/lokality |

### Noindex pages snapshot

| URL | HTTP | robots meta |
|---|---:|---|
| `/admin/prihlaseni` | 200 | noindex, nofollow |
| `/studio` | 200 | noindex |
| `/kontejnery/objednat` | 200 | noindex, nofollow |

## 2) Dotazy (GSC manual)

- [ ] Export top queries za posledních 28 dní (Clicks, Impressions, CTR, Position).
- [ ] Porovnat `/demolice`, `/kontejnery`, `/recyklace`, `/cenik`, `/lokality/*` vs minulý měsíc.
- [ ] Zapsat 3 dotazy s nejvyšším potenciálem (high impressions + low CTR).

## 3) Konverze (GA4/CRM manual)

- [ ] `start_order`, `submit_order`, `submit_order_success` za posledních 28 dní.
- [ ] Funnel ratio: `submit_order_success / start_order`.
- [ ] Porovnat počet reálných objednávek v CRM vs `submit_order_success`.

## 4) Akční výstup

- [ ] Vyber 3 akce na příští měsíc (1x indexace, 1x obsah/prolink, 1x konverze).
