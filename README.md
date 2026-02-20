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
- Obsahové stránky: `/`, `/kontejnery`, `/kontejnery/cenik`, `/kontejnery/co-patri-nepatri`, `/kontejnery/objednat`, `/demolice`, `/recyklace`
- Wizard objednávky s pravidlem `kontejner 3 m3`
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
