# P0-08 Mobile UX QA Runbook

Datum: 2026-02-20  
Scope: objednávkový flow `/kontejnery/objednat`  
Cíl: ověřit, že na mobilním viewportu lze bez blockeru dojít až na krok s tlačítkem `Odeslat objednávku`.

## Prostředí
- URL: `http://localhost:3000/kontejnery/objednat`
- Device emulace: `iPhone 13` (WebKit / Playwright)
- Evidence screenshot: `md-soubory/evidence/p0-08-mobile-order.png`

## Postup (automatizovaný smoke test)
1. Otevřít objednávkovou stránku v mobilní emulaci.
2. Krok `Adresa`: ručně vyplnit `PSČ`, `Město`, `Ulice`, `Číslo popisné`.
3. Krok `Kontejner`: vybrat první typ odpadu.
4. Krok `Termín + cena`: vybrat první dostupné datum přistavení.
5. Krok `Kontakt + souhrn`: přepnout na `Člověk`, vyplnit jméno, e-mail, telefon a potvrdit GDPR.
6. Ověřit, že tlačítko `Odeslat objednávku` je viditelné a `enabled`.

## Výsledek
- Status: `PASS`
- `Submit enabled: true`
- `Errors: none captured`

## Spouštěcí příkaz
```bash
node .tmp/p0-08-mobile-check.mjs
```
