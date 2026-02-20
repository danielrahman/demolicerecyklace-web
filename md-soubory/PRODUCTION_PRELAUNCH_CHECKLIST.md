# Production Pre-launch Checklist

Datum založení: 2026-02-20  
Scope: Vercel produkční nasazení (admin login + základní runtime)

## 1) Environment variables (Vercel)

- [ ] `NEXTAUTH_URL`:
  - [ ] Po přepnutí na finální doménu: nastavit `NEXTAUTH_URL=https://<finalni-domena>` a `vercel.app` přesměrovat na finální doménu.

## 2) Redistribuce po změně env

- [ ] Po změně env proměnných proveden nový deploy (nejen otevřít starý build).

## 3) Ověření Auth.js endpointů

- [ ] `GET /api/auth/providers` vrací `200`.
- [ ] `GET /api/auth/csrf` vrací `200`.
- [ ] `/api/auth/error` nevrací `Configuration` chybu.
- [ ] Vercel logs neobsahují `NO_SECRET` nebo `MissingSecretError`.

## 4) Ověření admin účtu v produkční DB
