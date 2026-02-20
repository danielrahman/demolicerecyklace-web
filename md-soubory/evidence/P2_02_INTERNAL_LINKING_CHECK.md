# P2-02 Evidence: Rozšíření interního prolinkování

- Date: 2026-02-20
- Goal: Posílit odkazy mezi službami, ceníkem a lokalitami na klíčových stránkách.

## Added cross-link sections

- `/demolice` -> `cenik#pronajem-stroju`, `/recyklace`, `/kontejnery`, `/lokality`
- `/kontejnery` -> `cenik#kontejnery`, `/demolice`, `/recyklace`, `/lokality`
- `/recyklace` -> `cenik#inertni-materialy`, `/demolice`, `/kontejnery/objednat`, `/lokality`
- `/cenik` -> `/kontejnery`, `/demolice`, `/recyklace`, `/lokality`

## Crawl snapshot (selected internal links)

| Source URL | Internal links found (sample) |
|---|---|
| `/demolice` | `/cenik`, `/cenik#pronajem-stroju`, `/kontejnery`, `/recyklace`, `/lokality` |
| `/kontejnery` | `/cenik`, `/cenik#kontejnery`, `/demolice`, `/recyklace`, `/lokality` |
| `/recyklace` | `/cenik`, `/cenik#inertni-materialy`, `/demolice`, `/kontejnery`, `/lokality` |
| `/cenik` | `/kontejnery`, `/demolice`, `/recyklace`, `/lokality` |

## Commands used

```bash
for u in /demolice /kontejnery /recyklace /cenik; do
  curl -s "http://localhost:3000$u" \
    | rg -o 'href=\"(/[^\"]+)\"' \
    | rg '/(cenik|demolice|recyklace|kontejnery|lokality)' \
    | sort -u
done

curl -s http://localhost:3000/ | rg -o 'href=\"/lokality\"'
```

## Additional discovery support

- `/lokality` je navíc dostupné z footeru na všech veřejných stránkách.

## Conclusion

- Pass for Core scope: service and pricing templates now have explicit bi-directional internal links.
