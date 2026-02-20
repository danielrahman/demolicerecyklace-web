# P1-06 Evidence: Money Pages Check

- Date: 2026-02-20
- Goal: Confirm 3-5 transactional pages exist and are internally connected to conversion paths.
- Method: `curl` each page and verify `h1` + links to `/kontejnery/objednat`, `/kontakt` (or `tel:`), `/cenik`.

## Result

| URL | Transaction intent (h1) | Link to order | Link to contact | Link to pricing |
|---|---|---|---|---|
| `/demolice` | `Demolice s jasným postupem a navazující recyklací` | yes | yes | yes |
| `/kontejnery` | `Objednejte kontejner jednoduše online` | yes | yes | yes |
| `/recyklace` | `Recyklace stavebních materiálů` | yes | yes | yes |
| `/cenik` | `Kompletní ceník služeb` | yes | yes | yes |
| `/kontejnery/objednat` | `Objednávka kontejneru 3m³` | n/a (target page) | yes | no |

## Command used

```bash
for u in /demolice /kontejnery /recyklace /cenik /kontejnery/objednat; do
  html=$(curl -s "http://localhost:3000$u")
  h1=$(printf '%s' "$html" | rg -o '<h1[^>]*>[^<]+' -m1 | sed 's/<h1[^>]*>//')
  has_order=$(printf '%s' "$html" | rg -q 'href="/kontejnery/objednat' && echo yes || echo no)
  has_contact=$(printf '%s' "$html" | rg -q 'href="/kontakt"|tel:\+420' && echo yes || echo no)
  has_cenik=$(printf '%s' "$html" | rg -q 'href="/cenik' && echo yes || echo no)
  printf '%s | h1:%s | order:%s | contact:%s | cenik:%s\n' "$u" "$h1" "$has_order" "$has_contact" "$has_cenik"
done
```

## Conclusion

- Pass for Core scope: 5 money pages are present, non-blog, and linked to conversion routes.
