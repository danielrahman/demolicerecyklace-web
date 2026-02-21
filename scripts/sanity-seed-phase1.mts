import nextEnv from "@next/env";
import { createClient } from "next-sanity";

import {
  CONTAINER_HOW_IT_WORKS,
  CONTAINER_RULE_WARNINGS,
  CONTAINER_TRUST_POINTS,
} from "../src/lib/container-content.ts";
import {
  CONTAINER_FAQ,
  DEMOLITION_FAQ,
  RECYCLING_FAQ,
} from "../src/lib/faq-content.ts";
import {
  CONTAINER_3M3_PRICING,
  INERT_MATERIALS_PRICING,
  MACHINE_RENTAL_PRICING,
  MATERIAL_SALES_PRICING,
  MOBILE_RECYCLING_PRICING,
} from "../src/lib/full-pricing.ts";

const serviceAreaLabel = "Praha a Středočeský kraj";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2026-02-20";
const writeToken = process.env.SANITY_API_WRITE_TOKEN?.trim();

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
}

if (!writeToken) {
  throw new Error("Missing SANITY_API_WRITE_TOKEN");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: writeToken,
  perspective: "published",
});

const quickFacts = [
  `Oblast: ${serviceAreaLabel}`,
  "Objednávka kontejneru přes web",
  "Termín potvrzuje operátor",
];

const homeServiceCards = [
  {
    title: "Kontejnery",
    subtitle: "Objednávka přes web za pár minut",
    description:
      "Vyplníte adresu, vyberete odpad a odešlete objednávku. Lokalitu ověříme hned a přesný termín potvrdíme telefonicky nebo e-mailem.",
    points: ["Přehledný ceník a podmínky", "Jasná pravidla odpadu", "Jednoduché vyplnění i na telefonu"],
    href: "/kontejnery",
    cta: "Přejít na kontejnery",
  },
  {
    title: "Demolice",
    subtitle: "Kompletní demoliční servis",
    description:
      "Od úvodní konzultace přes obhlídku až po samotné práce a odvoz materiálu. Postup vedeme bezpečně a bez zbytečných prostojů.",
    points: ["Postupné bourání", "Třídění frakcí", "Návazná logistika odpadu"],
    href: "/demolice",
    cta: "Poptat demolici",
  },
  {
    title: "Recyklace a materiál",
    subtitle: "Příjem, zpracování, prodej",
    description:
      "Ve středisku přijímáme stavební materiál, třídíme ho a připravujeme k dalšímu využití nebo prodeji.",
    points: ["Jasné podmínky příjmu", "Přehledné provozní informace", "Dodání i osobní odběr materiálu"],
    href: "/recyklace",
    cta: "Zobrazit podmínky",
  },
];

const homeProcessSteps = [
  {
    title: "Konzultace a zadání",
    text: "Řeknete nám, zda potřebujete kontejner, demolici nebo recyklaci.",
  },
  {
    title: "Ověření podmínek",
    text: "Prověříme lokalitu, typ materiálu, dostupnost techniky a navrhneme termín.",
  },
  {
    title: "Realizace",
    text: "Práci provedeme podle domluveného rozsahu a provozních podmínek.",
  },
  {
    title: "Odvoz, recyklace a předání",
    text: "Materiál vytřídíme, odvezeme a předáme podle domluveného postupu.",
  },
];

const homeTrustSignals = [
  "Jedno kontaktní místo pro kontejnery, demolici i recyklaci.",
  "Dopředu víte orientační cenu i hlavní podmínky.",
  "Na standardní poptávku reagujeme do 1 pracovního dne.",
  `Působíme v oblasti ${serviceAreaLabel}.`,
];

const homePageDoc = {
  _id: "homePage",
  _type: "homePage",
  heroEyebrow: `Demolice Recyklace | ${serviceAreaLabel}`,
  heroTitle: "Kontejner, demolice i recyklace bez složitého vyřizování.",
  heroDescription:
    "Na jednom místě najdete služby, ceník i podmínky. Kontejner 3 m³ objednáte přes web během pár minut a termín vám potvrdí operátor.",
  quickFacts,
  serviceCards: homeServiceCards.map((card, index) => ({
    _key: `service-${index + 1}`,
    ...card,
  })),
  processSteps: homeProcessSteps.map((step, index) => ({
    _key: `step-${index + 1}`,
    ...step,
  })),
  trustSignals: homeTrustSignals,
};

const containersPageDoc = {
  _id: "containersPage",
  _type: "containersPage",
  heroTitle: "Objednejte kontejner jednoduše přes web",
  heroDescription:
    "Začněte adresou, vyberte typ odpadu a odešlete objednávku. Aktuálně objednáte kontejner 3 m³. Přesný termín vždy potvrzuje operátor.",
  howItWorks: CONTAINER_HOW_IT_WORKS.map((step, index) => ({
    _key: `how-${index + 1}`,
    ...step,
  })),
  trustPoints: [...CONTAINER_TRUST_POINTS],
  ruleWarnings: [...CONTAINER_RULE_WARNINGS],
};

const pricingPageDoc = {
  _id: "pricingPage",
  _type: "pricingPage",
  introTitle: "Kompletní ceník služeb",
  introDescription: "Přehled vychází z aktuálního ceníku 2026 a je převedený do čitelné podoby na webu. Ceny jsou uvedené bez DPH.",
  sourcePdfUrl: "/documents/cenik-2026.pdf",
  containerSectionTitle: "Ceník kontejnerů 3 m³",
  containerSectionDescription: "Ceny podle typu odpadu. Po odeslání objednávky vždy potvrzujeme termín operátorem.",
  containerLimitNote: "Max 4 t, finální kontrola při převzetí.",
  containerPricing: CONTAINER_3M3_PRICING.map((row, index) => ({ _key: `container-${index + 1}`, ...row })),
  inertMaterialsTitle: "Ukládka inertních materiálů",
  inertMaterialsSubtitle: "U položek je nutné doložit požadované dokumenty dle legislativy.",
  inertMaterialsPricing: INERT_MATERIALS_PRICING.map((row, index) => ({ _key: `inert-${index + 1}`, ...row })),
  materialSalesTitle: "Prodej materiálu",
  materialSalesPricing: MATERIAL_SALES_PRICING.map((row, index) => ({ _key: `material-${index + 1}`, ...row })),
  mobileRecyclingTitle: "Recyklace přímo na stavbě",
  mobileRecyclingPricing: MOBILE_RECYCLING_PRICING.map((row, index) => ({ _key: `mobile-${index + 1}`, ...row })),
  machineSectionTitle: "Pronájem strojů",
  machineSectionSubtitle: "Fotky strojů odpovídají technice, kterou pro tyto služby používáme.",
  machinePricing: MACHINE_RENTAL_PRICING.map((row, index) => ({
    _key: `machine-${index + 1}`,
    machine: row.machine,
    specification: row.specification,
    price: row.price,
    note: row.note,
  })),
  footerNote:
    "Poznámka k ceníku: ceny jsou uvedené bez DPH 21 %. U nejasností nebo atypických dodávek kontaktujte dispečink.",
};

const faqDocs = [
  {
    _id: "faqCategory.containers",
    _type: "faqCategory",
    key: "containers",
    title: "Kontejnery",
    description: "Objednávka přes web, pravidla odpadu a potvrzení termínu.",
    order: 1,
    items: CONTAINER_FAQ.map((item, index) => ({ _key: `containers-${index + 1}`, ...item })),
  },
  {
    _id: "faqCategory.demolition",
    _type: "faqCategory",
    key: "demolition",
    title: "Demolice",
    description: "Nejčastější otázky k poptávce, rozsahu prací a návaznému odvozu.",
    order: 2,
    items: DEMOLITION_FAQ.map((item, index) => ({ _key: `demolition-${index + 1}`, ...item })),
  },
  {
    _id: "faqCategory.recycling",
    _type: "faqCategory",
    key: "recycling",
    title: "Recyklace a materiál",
    description: "Příjem materiálu, podmínky přejímky a navazující služby.",
    order: 3,
    items: RECYCLING_FAQ.map((item, index) => ({ _key: `recycling-${index + 1}`, ...item })),
  },
];

type PricingImageRow = {
  _key?: string;
  item?: string;
  machine?: string;
  image?: unknown;
  imageAlt?: string;
  [key: string]: unknown;
};

type ExistingPricingDocument = {
  containerPricing?: PricingImageRow[];
  inertMaterialsPricing?: PricingImageRow[];
  materialSalesPricing?: PricingImageRow[];
  mobileRecyclingPricing?: PricingImageRow[];
  machinePricing?: PricingImageRow[];
};

function preserveRowImages(
  newRows: PricingImageRow[],
  existingRows: PricingImageRow[] | undefined,
  labelField: "item" | "machine",
) {
  if (!existingRows?.length) {
    return newRows;
  }

  const existingByKey = new Map(existingRows.filter((row) => row?._key).map((row) => [row._key as string, row]));

  return newRows.map((row) => {
    const nextRow: PricingImageRow = { ...row };
    let existingRow = row._key ? existingByKey.get(row._key) : undefined;

    if (!existingRow && row[labelField]) {
      existingRow = existingRows.find((candidate) => candidate?.[labelField] === row[labelField]);
    }

    if (existingRow?.image && !nextRow.image) {
      nextRow.image = existingRow.image;
    }

    if (existingRow?.imageAlt && !nextRow.imageAlt) {
      nextRow.imageAlt = existingRow.imageAlt;
    }

    return nextRow;
  });
}

async function run() {
  const existingPricingPage = await client.fetch<ExistingPricingDocument | null>(
    `*[_id == "pricingPage"][0]{
      containerPricing,
      inertMaterialsPricing,
      materialSalesPricing,
      mobileRecyclingPricing,
      machinePricing
    }`,
  );

  const pricingPageWithPreservedImages = {
    ...pricingPageDoc,
    containerPricing: preserveRowImages(
      pricingPageDoc.containerPricing as PricingImageRow[],
      existingPricingPage?.containerPricing,
      "item",
    ),
    inertMaterialsPricing: preserveRowImages(
      pricingPageDoc.inertMaterialsPricing as PricingImageRow[],
      existingPricingPage?.inertMaterialsPricing,
      "item",
    ),
    materialSalesPricing: preserveRowImages(
      pricingPageDoc.materialSalesPricing as PricingImageRow[],
      existingPricingPage?.materialSalesPricing,
      "item",
    ),
    mobileRecyclingPricing: preserveRowImages(
      pricingPageDoc.mobileRecyclingPricing as PricingImageRow[],
      existingPricingPage?.mobileRecyclingPricing,
      "item",
    ),
    machinePricing: preserveRowImages(
      pricingPageDoc.machinePricing as PricingImageRow[],
      existingPricingPage?.machinePricing,
      "machine",
    ),
  };

  const docs = [homePageDoc, containersPageDoc, pricingPageWithPreservedImages, ...faqDocs];

  for (const doc of docs) {
    const { _id, _type, ...fields } = doc as { _id: string; _type: string; [key: string]: unknown };
    await client.createIfNotExists({ _id, _type } as never);
    await client.patch(_id).set(fields as never).commit({ autoGenerateArrayKeys: false });
    console.log(`Upserted ${_id}`);
  }

  console.log("Phase 1 seed completed.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
