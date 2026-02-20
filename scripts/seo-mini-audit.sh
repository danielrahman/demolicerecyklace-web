#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"
MONTH="${2:-$(date +%Y-%m)}"
OUT_FILE="md-soubory/evidence/SEO_MINI_AUDIT_${MONTH}.md"

status_code() {
  curl -s -o /dev/null -w "%{http_code}" "$1"
}

extract_title() {
  curl -s "$1" | rg -o "<title>[^<]+" -m1 | sed 's/<title>//' || true
}

extract_canonical() {
  curl -s "$1" | rg -o '<link rel="canonical" href="[^"]+"' -m1 | sed 's/<link rel="canonical" href="//; s/"$//' || true
}

extract_robots() {
  curl -s "$1" | rg -o '<meta name="robots" content="[^"]+"' -m1 | sed 's/<meta name="robots" content="//; s/"$//' || true
}

sanitize_md_cell() {
  printf "%s" "$1" \
    | tr '\n' ' ' \
    | sed 's/[[:space:]]\+/ /g; s/^ //; s/ $//; s/|/\\|/g'
}

mkdir -p "$(dirname "$OUT_FILE")"

timestamp="$(date "+%Y-%m-%d %H:%M")"
robots_code="$(status_code "$BASE_URL/robots.txt")"
sitemap_code="$(status_code "$BASE_URL/sitemap.xml")"
sitemap_count="$(curl -s "$BASE_URL/sitemap.xml" | rg -o "<loc>[^<]+" | wc -l | tr -d ' ')"

money_pages=(
  "/"
  "/demolice"
  "/kontejnery"
  "/recyklace"
  "/cenik"
  "/lokality"
)

noindex_pages=(
  "/admin/prihlaseni"
  "/studio"
  "/kontejnery/objednat"
)

{
  echo "# SEO Mini Audit (${MONTH})"
  echo
  echo "- Date: ${timestamp}"
  echo "- Base URL: \`${BASE_URL}\`"
  echo "- Scope: indexace + dotazy + konverze (Core monthly check)"
  echo
  echo "## 1) Indexace"
  echo
  echo "- \`robots.txt\`: HTTP ${robots_code}"
  echo "- \`sitemap.xml\`: HTTP ${sitemap_code}"
  echo "- Počet URL v sitemap: ${sitemap_count}"
  echo
  echo "### Money pages snapshot"
  echo
  echo "| URL | HTTP | title | canonical |"
  echo "|---|---:|---|---|"

  for path in "${money_pages[@]}"; do
    page_url="${BASE_URL}${path}"
    page_status="$(status_code "$page_url")"
    page_title="$(sanitize_md_cell "$(extract_title "$page_url")")"
    page_canonical="$(sanitize_md_cell "$(extract_canonical "$page_url")")"
    echo "| \`${path}\` | ${page_status} | ${page_title:-n/a} | ${page_canonical:-n/a} |"
  done

  echo
  echo "### Noindex pages snapshot"
  echo
  echo "| URL | HTTP | robots meta |"
  echo "|---|---:|---|"

  for path in "${noindex_pages[@]}"; do
    page_url="${BASE_URL}${path}"
    page_status="$(status_code "$page_url")"
    robots_meta="$(sanitize_md_cell "$(extract_robots "$page_url")")"
    echo "| \`${path}\` | ${page_status} | ${robots_meta:-n/a} |"
  done

  echo
  echo "## 2) Dotazy (GSC manual)"
  echo
  echo "- [ ] Export top queries za posledních 28 dní (Clicks, Impressions, CTR, Position)."
  echo "- [ ] Porovnat \`/demolice\`, \`/kontejnery\`, \`/recyklace\`, \`/cenik\`, \`/lokality/*\` vs minulý měsíc."
  echo "- [ ] Zapsat 3 dotazy s nejvyšším potenciálem (high impressions + low CTR)."
  echo
  echo "## 3) Konverze (GA4/CRM manual)"
  echo
  echo "- [ ] \`start_order\`, \`submit_order\`, \`submit_order_success\` za posledních 28 dní."
  echo "- [ ] Funnel ratio: \`submit_order_success / start_order\`."
  echo "- [ ] Porovnat počet reálných objednávek v CRM vs \`submit_order_success\`."
  echo
  echo "## 4) Akční výstup"
  echo
  echo "- [ ] Vyber 3 akce na příští měsíc (1x indexace, 1x obsah/prolink, 1x konverze)."
} > "$OUT_FILE"

echo "Mini audit written to ${OUT_FILE}"
