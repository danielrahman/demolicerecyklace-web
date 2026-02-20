# demolice-v1

Skeleton projektu pro nový web `demolicerecyklace.cz` podle PRD.

## Doporučený stack
- Frontend: Next.js (App Router, TypeScript)
- Backend: Next.js API route handlers
- Databáze: PostgreSQL
- ORM: Drizzle ORM
- Auth: Auth.js (pro admin)
- E-mail: Resend

## Co je připravené
- Obsahové stránky: `/`, `/kontejnery`, `/cenik`, `/kontejnery/co-patri-nepatri`, `/kontejnery/objednat`, `/demolice`, `/recyklace`
- Wizard objednávky s pravidlem `kontejner 3m³`
- Validace PSČ (Praha + Středočeský kraj)
- Jednoduchý admin:
  - `/admin/prihlaseni`
  - `/admin/objednavky`
  - `/admin/objednavky/[id]`
- API routy pro katalog, pricing, objednávky a admin akce
- Datové schéma Drizzle (`src/server/db/schema.ts`)
- E-mail flow:
  - po submitu zákazník + interní tým
  - po potvrzení termínu zákazník

## Lokální spuštění
```bash
npm install
cp .env.example .env.local
npm run dev
```

Web poběží na `http://localhost:3000`.

## Poznámky k MVP
- Aktuální uložení objednávek je in-memory (`src/lib/order-store.ts`) pro rychlý prototyp.
- Pro produkci napojit API na PostgreSQL přes Drizzle.
- Admin auth je připravená jako struktura, ale bez finální implementace session/role guardu.

## CMS (Sanity)

### Co je napojené
- Embedded studio route: `/studio`
- CMS data s fallbackem: `/`, `/kontejnery`, `/cenik`, `/faq`, `/kontejnery/faq`
- Revalidace cache endpoint: `POST /api/revalidate-tag`

### Potřebné env proměnné
Do `.env.local` přidejte:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-02-20
SANITY_REVALIDATE_SECRET=
SANITY_API_WRITE_TOKEN=
```

### Seed obsahu
Jednorázové naplnění singletonů a FAQ:

```bash
npm run cms:seed:phase1
```

Seed globálních nastavení a marketing stránek:

```bash
npm run cms:seed:phase2
```

### Webhook revalidace v Sanity
V Sanity projektu vytvořte webhook:
- URL:
  - doporučeno: `https://<domena>/api/revalidate-tag` (signature mode)
  - fallback: `https://<domena>/api/revalidate-tag?secret=<SANITY_REVALIDATE_SECRET>`
- Trigger: `create`, `update`, `delete`
- Filter (doporučeno):
  - `_type in ["homePage","containersPage","pricingPage","faqCategory","siteSettings","marketingPage"]`
- Projection:
  - `{ "_type": _type }`
- Secret:
  - stejná hodnota jako `SANITY_REVALIDATE_SECRET`

Poznámka: objednávky kontejnerů zůstávají mimo Sanity (v API/DB vrstvě).
