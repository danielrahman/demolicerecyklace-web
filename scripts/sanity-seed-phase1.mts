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
  "Online objednávka kontejneru",
  "Termín potvrzuje operátor",
];

const homeServiceCards = [
  {
    title: "Kontejnery",
    subtitle: "Rychlé online objednání",
    description:
      "Objednávku založíte během několika minut. Hned ověříme lokalitu a po odeslání vám termín potvrdíme telefonicky nebo e-mailem.",
    points: ["Jasný ceník a podmínky", "Co patří a nepatří do odpadu", "Pohodlné vyplnění i na mobilu"],
    href: "/kontejnery",
    cta: "Přejít na kontejnery",
  },
  {
    title: "Demolice",
    subtitle: "Kompletní demoliční servis",
    description:
      "Od vstupní konzultace přes obhlídku až po realizaci a odvoz materiálu. Zakázku vedeme tak, aby byl postup bezpečný a plynulý.",
    points: ["Postupné bourání", "Třídění frakcí", "Návazná logistika odpadu"],
    href: "/demolice",
    cta: "Poptat demolici",
  },
  {
    title: "Recyklace a materiál",
    subtitle: "Příjem, zpracování, prodej",
    description:
      "V recyklačním středisku přijímáme stavební materiál, třídíme ho a připravujeme k dalšímu využití.",
    points: ["Jasné podmínky příjmu", "Provozní informace na jednom místě", "Návazný prodej materiálu"],
    href: "/recyklace",
    cta: "Zobrazit podmínky",
  },
];

const homeProcessSteps = [
  {
    title: "Konzultace a zadání",
    text: "Řeknete nám, co potřebujete řešit: kontejner, demolici nebo recyklaci.",
  },
  {
    title: "Ověření podmínek",
    text: "Potvrdíme lokalitu, typ materiálu, dostupnost techniky a navrhneme termín.",
  },
  {
    title: "Realizace",
    text: "Zakázku provedeme podle domluveného rozsahu a provozního režimu.",
  },
  {
    title: "Odvoz, recyklace a předání",
    text: "Materiál následně vytřídíme, odvezeme a připravíme k dalšímu využití.",
  },
];

const homeTrustSignals = [
  "Jedno číslo pro kontejnery, demolici i recyklaci.",
  "Předem víte orientační cenu i základní podmínky.",
  "Na standardní poptávku reagujeme do 1 pracovního dne.",
  `Působíme v oblasti ${serviceAreaLabel}.`,
];

const homePageDoc = {
  _id: "homePage",
  _type: "homePage",
  heroEyebrow: `Demolice Recyklace | ${serviceAreaLabel}`,
  heroTitle: "Kontejnery, demolice i recyklace na jednom místě.",
  heroDescription:
    "Na webu najdete přehled služeb, ceny i podmínky bez složitého hledání. Pro kontejner je k dispozici online objednávka, aktuálně pro velikost 3m³.",
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
  heroTitle: "Objednejte kontejner jednoduše online",
  heroDescription:
    "Začněte adresou, vyberte typ odpadu a odešlete objednávku. Aktuálně objednáte kontejner 3m³. Termín vždy potvrzuje operátor ručně.",
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
  introDescription: "Přehled je převzatý z aktuálního ceníku 2026 a převedený do HTML kvůli přehlednosti. Ceny jsou bez DPH.",
  sourcePdfUrl: "/documents/cenik-2026.pdf",
  containerSectionTitle: "Ceník kontejnerů 3m³",
  containerSectionDescription: "Ceny podle typu odpadu. Po odeslání objednávky vždy potvrzujeme termín operátorem.",
  containerLimitNote: "Limit cca 4 t, finální kontrola při převzetí.",
  containerPricing: CONTAINER_3M3_PRICING.map((row, index) => ({ _key: `container-${index + 1}`, ...row })),
  inertMaterialsTitle: "Ukládka inertních materiálů",
  inertMaterialsSubtitle: "U položek je nutné doložit požadované dokumenty dle legislativy.",
  inertMaterialsPricing: INERT_MATERIALS_PRICING.map((row, index) => ({ _key: `inert-${index + 1}`, ...row })),
  materialSalesTitle: "Prodej materiálu",
  materialSalesPricing: MATERIAL_SALES_PRICING.map((row, index) => ({ _key: `material-${index + 1}`, ...row })),
  mobileRecyclingTitle: "Recyklace přímo na stavbě",
  mobileRecyclingPricing: MOBILE_RECYCLING_PRICING.map((row, index) => ({ _key: `mobile-${index + 1}`, ...row })),
  machineSectionTitle: "Pronájem strojů",
  machineSectionSubtitle: "Fotky strojů jsou pro náhled kombinované z aktuálního webu a veřejně dostupných ilustračních zdrojů.",
  machinePricing: MACHINE_RENTAL_PRICING.map((row, index) => ({
    _key: `machine-${index + 1}`,
    machine: row.machine,
    specification: row.specification,
    price: row.price,
    note: row.note,
  })),
  footerNote:
    "Poznámky k ceníku: ceny jsou uvedené bez DPH 21 %, materiály musí být bez příměsí a při ukládce odpadu je nutné doložit požadované podklady (ZPO, případně atesty). U nejasností kontaktujte dispečink.",
};

const faqDocs = [
  {
    _id: "faqCategory.containers",
    _type: "faqCategory",
    key: "containers",
    title: "Kontejnery",
    description: "Objednávka, pravidla odpadu a potvrzení termínu.",
    order: 1,
    items: CONTAINER_FAQ.map((item, index) => ({ _key: `containers-${index + 1}`, ...item })),
  },
  {
    _id: "faqCategory.demolition",
    _type: "faqCategory",
    key: "demolition",
    title: "Demolice",
    description: "Nejčastější otázky k poptávce, rozsahu prací a návazné logistice.",
    order: 2,
    items: DEMOLITION_FAQ.map((item, index) => ({ _key: `demolition-${index + 1}`, ...item })),
  },
  {
    _id: "faqCategory.recycling",
    _type: "faqCategory",
    key: "recycling",
    title: "Recyklace a materiál",
    description: "Příjem materiálu, podmínky přejímky a dostupnost navazujících služeb.",
    order: 3,
    items: RECYCLING_FAQ.map((item, index) => ({ _key: `recycling-${index + 1}`, ...item })),
  },
];

async function run() {
  const docs = [homePageDoc, containersPageDoc, pricingPageDoc, ...faqDocs];

  for (const doc of docs) {
    await client.createOrReplace(doc as never);
    console.log(`Upserted ${doc._id}`);
  }

  console.log("Phase 1 seed completed.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
