import {
  CONTAINER_HOW_IT_WORKS,
  CONTAINER_RULE_WARNINGS,
  CONTAINER_TRUST_POINTS,
} from "@/lib/container-content";
import {
  CONTAINER_FAQ,
  DEMOLITION_FAQ,
  RECYCLING_FAQ,
  type FaqItem,
} from "@/lib/faq-content";
import {
  CONTAINER_3M3_PRICING,
  INERT_MATERIALS_PRICING,
  MACHINE_RENTAL_PRICING,
  MATERIAL_SALES_PRICING,
  MOBILE_RECYCLING_PRICING,
  type MachineRentalRow,
  type PricingRow,
} from "@/lib/full-pricing";
import { SERVICE_AREA } from "@/lib/site-config";

export type CmsHomePage = {
  heroEyebrow?: string | null;
  heroTitle?: string | null;
  heroDescription?: string | null;
  quickFacts?: Array<string | null> | null;
  serviceCards?:
    | Array<{
        title?: string | null;
        subtitle?: string | null;
        description?: string | null;
        points?: Array<string | null> | null;
        href?: string | null;
        cta?: string | null;
        imageUrl?: string | null;
        imageAlt?: string | null;
      } | null>
    | null;
  processSteps?:
    | Array<{
        title?: string | null;
        text?: string | null;
      } | null>
    | null;
  trustSignals?: Array<string | null> | null;
};

export type HomePageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  quickFacts: string[];
  serviceCards: Array<{
    title: string;
    subtitle: string;
    description: string;
    points: string[];
    href: string;
    cta: string;
    imageUrl: string;
    imageAlt: string;
  }>;
  processSteps: Array<{
    title: string;
    text: string;
  }>;
  trustSignals: string[];
};

export type CmsContainersPage = {
  heroTitle?: string | null;
  heroDescription?: string | null;
  heroImageUrl?: string | null;
  heroImageAlt?: string | null;
  howItWorks?:
    | Array<{
        title?: string | null;
        description?: string | null;
      } | null>
    | null;
  trustPoints?: Array<string | null> | null;
  ruleWarnings?: Array<string | null> | null;
};

export type ContainersPageContent = {
  heroTitle: string;
  heroDescription: string;
  heroImageUrl: string;
  heroImageAlt: string;
  howItWorks: Array<{
    title: string;
    description: string;
  }>;
  trustPoints: string[];
  ruleWarnings: string[];
};

export type CmsPricingRow = PricingRow & {
  imageUrl?: string | null;
  imageAlt?: string | null;
  tag?: string | null;
};

export type CmsMachinePricingRow = {
  machine?: string | null;
  specification?: string | null;
  price?: string | null;
  note?: string | null;
  image?: string | null;
  imageAlt?: string | null;
};

export type CmsPricingPage = {
  introTitle?: string | null;
  introDescription?: string | null;
  sourcePdfUrl?: string | null;
  containerSectionTitle?: string | null;
  containerSectionDescription?: string | null;
  containerLimitNote?: string | null;
  containerPricing?: Array<CmsPricingRow | null> | null;
  inertMaterialsTitle?: string | null;
  inertMaterialsSubtitle?: string | null;
  inertMaterialsPricing?: Array<CmsPricingRow | null> | null;
  materialSalesTitle?: string | null;
  materialSalesPricing?: Array<CmsPricingRow | null> | null;
  mobileRecyclingTitle?: string | null;
  mobileRecyclingPricing?: Array<CmsPricingRow | null> | null;
  machineSectionTitle?: string | null;
  machineSectionSubtitle?: string | null;
  machinePricing?: Array<CmsMachinePricingRow | null> | null;
  footerNote?: string | null;
};

export type PricingPageContent = {
  introTitle: string;
  introDescription: string;
  sourcePdfUrl: string;
  containerSectionTitle: string;
  containerSectionDescription: string;
  containerLimitNote: string;
  containerPricing: CmsPricingRow[];
  inertMaterialsTitle: string;
  inertMaterialsSubtitle: string;
  inertMaterialsPricing: CmsPricingRow[];
  materialSalesTitle: string;
  materialSalesPricing: CmsPricingRow[];
  mobileRecyclingTitle: string;
  mobileRecyclingPricing: CmsPricingRow[];
  machineSectionTitle: string;
  machineSectionSubtitle: string;
  machinePricing: MachineRentalRow[];
  footerNote: string;
};

export type CmsFaqCategory = {
  key?: string | null;
  title?: string | null;
  description?: string | null;
  order?: number | null;
  items?:
    | Array<{
        question?: string | null;
        answer?: string | null;
      } | null>
    | null;
};

export type FaqCategoryKey = "containers" | "demolition" | "recycling";

export type FaqCategoryContent = {
  key: FaqCategoryKey;
  title: string;
  description: string;
  order: number;
  items: FaqItem[];
};

export type FaqContentMap = Record<FaqCategoryKey, FaqCategoryContent>;

export const fallbackHomePageContent: HomePageContent = {
  heroEyebrow: `Demolice Recyklace | ${SERVICE_AREA.regionsLabel}`,
  heroTitle: "Kontejnery, demolice i recyklace na jednom místě.",
  heroDescription:
    "Na webu najdete přehled služeb, ceny i podmínky bez složitého hledání. Pro kontejner je k dispozici online objednávka, aktuálně pro velikost 3m³.",
  quickFacts: [
    `Oblast: ${SERVICE_AREA.regionsLabel}`,
    "Online objednávka kontejneru",
    "Termín potvrzuje operátor",
  ],
  serviceCards: [
    {
      title: "Kontejnery",
      subtitle: "Rychlé online objednání",
      description:
        "Objednávku založíte během několika minut. Hned ověříme lokalitu a po odeslání vám termín potvrdíme telefonicky nebo e-mailem.",
      points: ["Jasný ceník a podmínky", "Co patří a nepatří do odpadu", "Pohodlné vyplnění i na mobilu"],
      href: "/kontejnery",
      cta: "Přejít na kontejnery",
      imageUrl: "/photos/homepage/service-kontejnery.jpg",
      imageAlt: "Kontejnery",
    },
    {
      title: "Demolice",
      subtitle: "Kompletní demoliční servis",
      description:
        "Od vstupní konzultace přes obhlídku až po realizaci a odvoz materiálu. Zakázku vedeme tak, aby byl postup bezpečný a plynulý.",
      points: ["Postupné bourání", "Třídění frakcí", "Návazná logistika odpadu"],
      href: "/demolice",
      cta: "Poptat demolici",
      imageUrl: "/photos/homepage/service-demolice.jpg",
      imageAlt: "Demolice",
    },
    {
      title: "Recyklace a materiál",
      subtitle: "Příjem, zpracování, prodej",
      description:
        "V recyklačním středisku přijímáme stavební materiál, třídíme ho a připravujeme k dalšímu využití.",
      points: ["Jasné podmínky příjmu", "Provozní informace na jednom místě", "Návazný prodej materiálu"],
      href: "/recyklace",
      cta: "Zobrazit podmínky",
      imageUrl: "/photos/homepage/service-recyklace.jpg",
      imageAlt: "Recyklace",
    },
  ],
  processSteps: [
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
  ],
  trustSignals: [
    "Jedno číslo pro kontejnery, demolici i recyklaci.",
    "Předem víte orientační cenu i základní podmínky.",
    "Na standardní poptávku reagujeme do 1 pracovního dne.",
    `Působíme v oblasti ${SERVICE_AREA.regionsLabel}.`,
  ],
};

export const fallbackContainersPageContent: ContainersPageContent = {
  heroTitle: "Objednejte kontejner jednoduše online",
  heroDescription:
    "Začněte adresou, vyberte typ odpadu a odešlete objednávku. Aktuálně objednáte kontejner 3m³. Termín vždy potvrzuje operátor ručně.",
  heroImageUrl: "/legacy/current-web/cache_template_bg-image__1239x698_fit_to_width_1521724840_img-2627.jpg",
  heroImageAlt: "Kontejnerový vůz v provozu",
  howItWorks: CONTAINER_HOW_IT_WORKS.map((item) => ({ ...item })),
  trustPoints: [...CONTAINER_TRUST_POINTS],
  ruleWarnings: [...CONTAINER_RULE_WARNINGS],
};

export const fallbackPricingPageContent: PricingPageContent = {
  introTitle: "Kompletní ceník služeb",
  introDescription: "Přehled je převzatý z aktuálního ceníku 2026 a převedený do HTML kvůli přehlednosti. Ceny jsou bez DPH.",
  sourcePdfUrl: "/documents/cenik-2026.pdf",
  containerSectionTitle: "Ceník kontejnerů 3m³",
  containerSectionDescription: "Ceny podle typu odpadu. Po odeslání objednávky vždy potvrzujeme termín operátorem.",
  containerLimitNote: "Limit cca 4 t, finální kontrola při převzetí.",
  containerPricing: CONTAINER_3M3_PRICING.map((item) => ({ ...item })),
  inertMaterialsTitle: "Ukládka inertních materiálů",
  inertMaterialsSubtitle: "U položek je nutné doložit požadované dokumenty dle legislativy.",
  inertMaterialsPricing: INERT_MATERIALS_PRICING.map((item) => ({ ...item })),
  materialSalesTitle: "Prodej materiálu",
  materialSalesPricing: MATERIAL_SALES_PRICING.map((item) => ({ ...item })),
  mobileRecyclingTitle: "Recyklace přímo na stavbě",
  mobileRecyclingPricing: MOBILE_RECYCLING_PRICING.map((item) => ({ ...item })),
  machineSectionTitle: "Pronájem strojů",
  machineSectionSubtitle: "Fotky strojů jsou pro náhled kombinované z aktuálního webu a veřejně dostupných ilustračních zdrojů.",
  machinePricing: MACHINE_RENTAL_PRICING.map((item) => ({ ...item })),
  footerNote:
    "Poznámky k ceníku: ceny jsou uvedené bez DPH 21 %, materiály musí být bez příměsí a při ukládce odpadu je nutné doložit požadované podklady (ZPO, případně atesty). U nejasností kontaktujte dispečink.",
};

export const fallbackFaqContent: FaqContentMap = {
  containers: {
    key: "containers",
    title: "Kontejnery",
    description: "Objednávka, pravidla odpadu a potvrzení termínu.",
    order: 1,
    items: CONTAINER_FAQ,
  },
  demolition: {
    key: "demolition",
    title: "Demolice",
    description: "Nejčastější otázky k poptávce, rozsahu prací a návazné logistice.",
    order: 2,
    items: DEMOLITION_FAQ,
  },
  recycling: {
    key: "recycling",
    title: "Recyklace a materiál",
    description: "Příjem materiálu, podmínky přejímky a dostupnost navazujících služeb.",
    order: 3,
    items: RECYCLING_FAQ,
  },
};

function normalizeStringList(value: Array<string | null> | null | undefined, fallback: string[]) {
  if (!value?.length) {
    return fallback;
  }

  const next = value.map((item) => item?.trim()).filter((item): item is string => Boolean(item));
  return next.length ? next : fallback;
}

export function mapHomePageContent(data: CmsHomePage | null): HomePageContent {
  if (!data) {
    return fallbackHomePageContent;
  }

  const serviceCards = data.serviceCards?.length
    ? data.serviceCards
        .map((card, index) => {
          if (!card?.title || !card.subtitle || !card.description || !card.href || !card.cta) {
            return null;
          }

          const fallbackCard = fallbackHomePageContent.serviceCards[index] ?? fallbackHomePageContent.serviceCards[0];

          return {
            title: card.title,
            subtitle: card.subtitle,
            description: card.description,
            points: normalizeStringList(card.points, fallbackCard.points),
            href: card.href,
            cta: card.cta,
            imageUrl: card.imageUrl || fallbackCard.imageUrl,
            imageAlt: card.imageAlt || fallbackCard.imageAlt,
          };
        })
        .filter((card): card is HomePageContent["serviceCards"][number] => Boolean(card))
    : fallbackHomePageContent.serviceCards;

  const processSteps = data.processSteps?.length
    ? data.processSteps
        .map((step) => {
          if (!step?.title || !step.text) {
            return null;
          }

          return {
            title: step.title,
            text: step.text,
          };
        })
        .filter((step): step is HomePageContent["processSteps"][number] => Boolean(step))
    : fallbackHomePageContent.processSteps;

  return {
    heroEyebrow: data.heroEyebrow || fallbackHomePageContent.heroEyebrow,
    heroTitle: data.heroTitle || fallbackHomePageContent.heroTitle,
    heroDescription: data.heroDescription || fallbackHomePageContent.heroDescription,
    quickFacts: normalizeStringList(data.quickFacts, fallbackHomePageContent.quickFacts),
    serviceCards: serviceCards.length ? serviceCards : fallbackHomePageContent.serviceCards,
    processSteps: processSteps.length ? processSteps : fallbackHomePageContent.processSteps,
    trustSignals: normalizeStringList(data.trustSignals, fallbackHomePageContent.trustSignals),
  };
}

export function mapContainersPageContent(data: CmsContainersPage | null): ContainersPageContent {
  if (!data) {
    return fallbackContainersPageContent;
  }

  const howItWorks = data.howItWorks?.length
    ? data.howItWorks
        .map((item) => {
          if (!item?.title || !item.description) {
            return null;
          }

          return {
            title: item.title,
            description: item.description,
          };
        })
        .filter((item): item is ContainersPageContent["howItWorks"][number] => Boolean(item))
    : fallbackContainersPageContent.howItWorks;

  return {
    heroTitle: data.heroTitle || fallbackContainersPageContent.heroTitle,
    heroDescription: data.heroDescription || fallbackContainersPageContent.heroDescription,
    heroImageUrl: data.heroImageUrl || fallbackContainersPageContent.heroImageUrl,
    heroImageAlt: data.heroImageAlt || fallbackContainersPageContent.heroImageAlt,
    howItWorks: howItWorks.length ? howItWorks : fallbackContainersPageContent.howItWorks,
    trustPoints: normalizeStringList(data.trustPoints, fallbackContainersPageContent.trustPoints),
    ruleWarnings: normalizeStringList(data.ruleWarnings, fallbackContainersPageContent.ruleWarnings),
  };
}

function mapPricingRows(rows: Array<CmsPricingRow | null> | null | undefined, fallback: CmsPricingRow[]) {
  if (!rows?.length) {
    return fallback;
  }

  const next = rows
    .map((row, index) => {
      if (!row?.item || !row.price) {
        return null;
      }

      const fallbackRow = fallback[index];

      return {
        item: row.item,
        code: row.code || fallbackRow?.code,
        price: row.price,
        note: row.note || fallbackRow?.note,
        tag: row.tag || fallbackRow?.tag,
        imageUrl: row.imageUrl || fallbackRow?.imageUrl,
        imageAlt: row.imageAlt || fallbackRow?.imageAlt,
      };
    })
    .filter(Boolean);

  return next.length ? (next as CmsPricingRow[]) : fallback;
}

function mapMachineRows(rows: Array<CmsMachinePricingRow | null> | null | undefined, fallback: MachineRentalRow[]) {
  if (!rows?.length) {
    return fallback;
  }

  const next = rows
    .map((row, index) => {
      if (!row?.machine || !row.specification || !row.price) {
        return null;
      }

      const fallbackRow = fallback[index] ?? fallback[0];

      return {
        machine: row.machine,
        specification: row.specification,
        price: row.price,
        note: row.note || fallbackRow.note,
        image: row.image || fallbackRow.image,
      };
    })
    .filter(Boolean);

  return next.length ? (next as MachineRentalRow[]) : fallback;
}

export function mapPricingPageContent(data: CmsPricingPage | null): PricingPageContent {
  if (!data) {
    return fallbackPricingPageContent;
  }

  return {
    introTitle: data.introTitle || fallbackPricingPageContent.introTitle,
    introDescription: data.introDescription || fallbackPricingPageContent.introDescription,
    sourcePdfUrl: data.sourcePdfUrl || fallbackPricingPageContent.sourcePdfUrl,
    containerSectionTitle: data.containerSectionTitle || fallbackPricingPageContent.containerSectionTitle,
    containerSectionDescription: data.containerSectionDescription || fallbackPricingPageContent.containerSectionDescription,
    containerLimitNote: data.containerLimitNote || fallbackPricingPageContent.containerLimitNote,
    containerPricing: mapPricingRows(data.containerPricing, fallbackPricingPageContent.containerPricing),
    inertMaterialsTitle: data.inertMaterialsTitle || fallbackPricingPageContent.inertMaterialsTitle,
    inertMaterialsSubtitle: data.inertMaterialsSubtitle || fallbackPricingPageContent.inertMaterialsSubtitle,
    inertMaterialsPricing: mapPricingRows(data.inertMaterialsPricing, fallbackPricingPageContent.inertMaterialsPricing),
    materialSalesTitle: data.materialSalesTitle || fallbackPricingPageContent.materialSalesTitle,
    materialSalesPricing: mapPricingRows(data.materialSalesPricing, fallbackPricingPageContent.materialSalesPricing),
    mobileRecyclingTitle: data.mobileRecyclingTitle || fallbackPricingPageContent.mobileRecyclingTitle,
    mobileRecyclingPricing: mapPricingRows(data.mobileRecyclingPricing, fallbackPricingPageContent.mobileRecyclingPricing),
    machineSectionTitle: data.machineSectionTitle || fallbackPricingPageContent.machineSectionTitle,
    machineSectionSubtitle: data.machineSectionSubtitle || fallbackPricingPageContent.machineSectionSubtitle,
    machinePricing: mapMachineRows(data.machinePricing, fallbackPricingPageContent.machinePricing),
    footerNote: data.footerNote || fallbackPricingPageContent.footerNote,
  };
}

function mapFaqItems(items: CmsFaqCategory["items"], fallbackItems: FaqItem[]) {
  if (!items?.length) {
    return fallbackItems;
  }

  const next = items
    .map((item) => {
      if (!item?.question || !item.answer) {
        return null;
      }

      return {
        question: item.question,
        answer: item.answer,
      };
    })
    .filter((item): item is FaqItem => Boolean(item));

  return next.length ? next : fallbackItems;
}

export function mapFaqContent(categories: CmsFaqCategory[] | null): FaqContentMap {
  if (!categories?.length) {
    return fallbackFaqContent;
  }

  const mapped: FaqContentMap = {
    containers: { ...fallbackFaqContent.containers },
    demolition: { ...fallbackFaqContent.demolition },
    recycling: { ...fallbackFaqContent.recycling },
  };

  for (const category of categories) {
    const key = category.key as FaqCategoryKey | undefined;

    if (!key || !(key in mapped)) {
      continue;
    }

    const fallbackCategory = fallbackFaqContent[key];

    mapped[key] = {
      key,
      title: category.title || fallbackCategory.title,
      description: category.description || fallbackCategory.description,
      order: typeof category.order === "number" ? category.order : fallbackCategory.order,
      items: mapFaqItems(category.items, fallbackCategory.items),
    };
  }

  return mapped;
}
