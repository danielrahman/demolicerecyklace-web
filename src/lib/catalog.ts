import type { WasteTypeId } from "@/lib/types";

export type WasteTypeCatalogItem = {
  id: WasteTypeId;
  label: string;
  shortDescription: string;
  allowed: string[];
  disallowed: string[];
  basePriceCzk: number;
};

export const WASTE_TYPES: WasteTypeCatalogItem[] = [
  {
    id: "sut-cista",
    label: "Suť čistá",
    shortDescription: "Beton, cihly, tašky bez příměsí",
    allowed: ["cihly", "beton", "keramika", "tašky", "dlažba"],
    disallowed: ["sádrokarton", "azbest", "plast", "dřevo", "komunální odpad"],
    basePriceCzk: 3900,
  },
  {
    id: "sut-smesna",
    label: "Suť směsná",
    shortDescription: "Směs stavebního odpadu bez nebezpečných složek",
    allowed: ["cihly", "beton", "omítka", "menší podíl dřeva", "kov"],
    disallowed: ["azbest", "chemikálie", "elektroodpad", "barvy", "pneumatiky"],
    basePriceCzk: 4700,
  },
  {
    id: "objemny",
    label: "Objemný odpad",
    shortDescription: "Nábytek, vybavení, bytové vyklízení",
    allowed: ["nábytek", "koberce", "matrace", "dveře", "plasty"],
    disallowed: ["nebezpečný odpad", "stavební suť", "chemikálie", "azbest", "zemina"],
    basePriceCzk: 4300,
  },
  {
    id: "zemina",
    label: "Zemina",
    shortDescription: "Čistá výkopová zemina bez příměsí",
    allowed: ["zemina", "jíl", "hlína"],
    disallowed: ["stavební odpad", "kameny velkých frakcí", "komunální odpad", "plast", "kořeny"],
    basePriceCzk: 3500,
  },
  {
    id: "drevo",
    label: "Dřevo",
    shortDescription: "Dřevěný odpad bez nebezpečných nátěrů",
    allowed: ["prkna", "palety", "dřevotříska", "trámy"],
    disallowed: ["chemicky ošetřené dřevo", "lakované dřevo", "sklo", "kov", "azbest"],
    basePriceCzk: 4100,
  },
];

export const CONTAINER_OPTIONS = [
  {
    sizeM3: 3,
    label: "Kontejner 3m³",
    available: true,
  },
  {
    sizeM3: 5,
    label: "Kontejner 5m³",
    available: false,
  },
  {
    sizeM3: 7,
    label: "Kontejner 7m³",
    available: false,
  },
] as const;
