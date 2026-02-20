# Production Pre-launch Checklist

Datum založení: 2026-02-20  
Scope: Vercel produkční nasazení (admin login + základní runtime)

## 1) Environment variables (Vercel)

- [ ] `NEXTAUTH_SECRET` je nastavené pro `Production` (doporučeno i `Preview`) a má silnou náhodnou hodnotu.
- [ ] `DATABASE_URL` pro `Production` míří na produkční DB (ne lokální/dev).
- [ ] `NEXTAUTH_URL`:
  - [ ] Přechodná fáze (funguje `vercel.app` i custom doména): nechat nezadané.
  - [ ] Po přepnutí na finální doménu: nastavit `NEXTAUTH_URL=https://<finalni-domena>` a `vercel.app` přesměrovat na finální doménu.

## 2) Redistribuce po změně env

- [ ] Po změně env proměnných proveden nový deploy (nejen otevřít starý build).

## 3) Ověření Auth.js endpointů

- [ ] `GET /api/auth/providers` vrací `200`.
- [ ] `GET /api/auth/csrf` vrací `200`.
- [ ] `/api/auth/error` nevrací `Configuration` chybu.
- [ ] Vercel logs neobsahují `NO_SECRET` nebo `MissingSecretError`.

## 4) Ověření admin účtu v produkční DB

- [ ] Admin účet existuje v tabulce `admin_users` (`active=true`).
- [ ] Pokud je potřeba reset hesla/role, proveden seed proti produkční DB:

```bash
ADMIN_SEED_EMAIL="<admin_email>" \
ADMIN_SEED_PASSWORD="<nove_silne_heslo>" \
ADMIN_SEED_ROLE="admin" \
npm run admin:seed
```

## 5) Funkční test po deployi

- [ ] Přihlášení přes `/admin/prihlaseni` projde s produkčním účtem.
- [ ] Po přihlášení se načte `/admin/objednavky` (i když je seznam prázdný).
- [ ] Odhlášení vrací na `/admin/prihlaseni`.

