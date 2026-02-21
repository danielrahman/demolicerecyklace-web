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
import {
  CONTACT,
  FOOTER_INFO_LINKS,
  FOOTER_SERVICE_LINKS,
  HEADER_LINKS,
  SERVICE_AREA,
  SITE_META,
} from "@/lib/site-config";

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

export type CmsNavLink = {
  label?: string | null;
  href?: string | null;
};

export type CmsContactHour = {
  label?: string | null;
  value?: string | null;
};

export type CmsSiteSettings = {
  brandName?: string | null;
  companyName?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  regionsLabel?: string | null;
  phone?: string | null;
  email?: string | null;
  operatorAddressLine?: string | null;
  operationAddressLine?: string | null;
  icz?: string | null;
  mapUrl?: string | null;
  hours?: Array<CmsContactHour | null> | null;
  headerLinks?: Array<CmsNavLink | null> | null;
  footerServiceLinks?: Array<CmsNavLink | null> | null;
  footerInfoLinks?: Array<CmsNavLink | null> | null;
};

export type SiteSettingsContent = {
  brandName: string;
  companyName: string;
  metaTitle: string;
  metaDescription: string;
  regionsLabel: string;
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  operatorAddressLine: string;
  operationAddressLine: string;
  icz: string;
  mapUrl: string;
  hours: Array<{
    label: string;
    value: string;
  }>;
  headerLinks: Array<{
    label: string;
    href: string;
  }>;
  footerServiceLinks: Array<{
    label: string;
    href: string;
  }>;
  footerInfoLinks: Array<{
    label: string;
    href: string;
  }>;
};

export type CmsMarketingSection = {
  heading?: string | null;
  body?: string | null;
  items?: Array<string | null> | null;
};

export type CmsMarketingPage = {
  title?: string | null;
  slug?: string | null;
  eyebrow?: string | null;
  heroTitle?: string | null;
  heroDescription?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  sections?: Array<CmsMarketingSection | null> | null;
};

export type MarketingSectionContent = {
  heading: string;
  body: string;
  items: string[];
};

export type MarketingPageContent = {
  title: string;
  slug: string;
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  seoTitle: string;
  seoDescription: string;
  sections: MarketingSectionContent[];
};

export const fallbackHomePageContent: HomePageContent = {
  heroEyebrow: `Demolice Recyklace | ${SERVICE_AREA.regionsLabel}`,
  heroTitle: "Kontejner, demolice i recyklace bez složitého vyřizování.",
  heroDescription:
    "Na jednom místě najdete služby, ceník i podmínky. Kontejner 3 m³ objednáte přes web během pár minut a termín vám potvrdí operátor.",
  quickFacts: [
    `Oblast: ${SERVICE_AREA.regionsLabel}`,
    "Objednávka kontejneru přes web",
    "Termín potvrzuje operátor",
  ],
  serviceCards: [
    {
      title: "Kontejnery",
      subtitle: "Objednávka přes web za pár minut",
      description:
        "Vyplníte adresu, vyberete odpad a odešlete objednávku. Lokalitu ověříme hned a přesný termín potvrdíme telefonicky nebo e-mailem.",
      points: ["Přehledný ceník a podmínky", "Jasná pravidla odpadu", "Jednoduché vyplnění i na telefonu"],
      href: "/kontejnery",
      cta: "Přejít na kontejnery",
      imageUrl: "/photos/homepage/service-kontejnery.jpg",
      imageAlt: "Kontejnery",
    },
    {
      title: "Demolice",
      subtitle: "Kompletní demoliční servis",
      description:
        "Od úvodní konzultace přes obhlídku až po samotné práce a odvoz materiálu. Postup vedeme bezpečně a bez zbytečných prostojů.",
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
        "Ve středisku přijímáme stavební materiál, třídíme ho a připravujeme k dalšímu využití nebo prodeji.",
      points: ["Jasné podmínky příjmu", "Přehledné provozní informace", "Dodání i osobní odběr materiálu"],
      href: "/recyklace",
      cta: "Zobrazit podmínky",
      imageUrl: "/photos/homepage/service-recyklace.jpg",
      imageAlt: "Recyklace",
    },
  ],
  processSteps: [
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
  ],
  trustSignals: [
    "Jedno kontaktní místo pro kontejnery, demolici i recyklaci.",
    "Dopředu víte orientační cenu i hlavní podmínky.",
    "Na standardní poptávku reagujeme do 1 pracovního dne.",
    `Působíme v oblasti ${SERVICE_AREA.regionsLabel}.`,
  ],
};

export const fallbackContainersPageContent: ContainersPageContent = {
  heroTitle: "Objednejte kontejner jednoduše přes web",
  heroDescription:
    "Začněte adresou, vyberte typ odpadu a odešlete objednávku. Aktuálně objednáte kontejner 3 m³. Přesný termín vždy potvrzuje operátor.",
  heroImageUrl: "/legacy/current-web/cache_template_bg-image__1239x698_fit_to_width_1521724840_img-2627.jpg",
  heroImageAlt: "Kontejnerový vůz v provozu",
  howItWorks: CONTAINER_HOW_IT_WORKS.map((item) => ({ ...item })),
  trustPoints: [...CONTAINER_TRUST_POINTS],
  ruleWarnings: [...CONTAINER_RULE_WARNINGS],
};

export const fallbackPricingPageContent: PricingPageContent = {
  introTitle: "Kompletní ceník služeb",
  introDescription: "Přehled vychází z aktuálního ceníku 2026 a je převedený do čitelné podoby na webu. Ceny jsou uvedené bez DPH.",
  sourcePdfUrl: "/documents/cenik-2026.pdf",
  containerSectionTitle: "Ceník kontejnerů 3 m³",
  containerSectionDescription: "Ceny jsou podle typu odpadu. Po odeslání objednávky vždy potvrzujeme termín operátorem.",
  containerLimitNote: "Max 4 t, finální kontrola při převzetí.",
  containerPricing: CONTAINER_3M3_PRICING.map((item) => ({ ...item })),
  inertMaterialsTitle: "Ukládka inertních materiálů",
  inertMaterialsSubtitle: "Dle vyhlášky č. 273/2021 Sb. je u položek 1-14 povinné doložit atesty nebo ZPO.",
  inertMaterialsPricing: INERT_MATERIALS_PRICING.map((item) => ({ ...item })),
  materialSalesTitle: "Prodej materiálu",
  materialSalesPricing: MATERIAL_SALES_PRICING.map((item) => ({ ...item })),
  mobileRecyclingTitle: "Recyklace přímo na stavbě",
  mobileRecyclingPricing: MOBILE_RECYCLING_PRICING.map((item) => ({ ...item })),
  machineSectionTitle: "Pronájem strojů",
  machineSectionSubtitle: "Fotky strojů jsou pro náhled kombinované z aktuálního webu a veřejně dostupných ilustračních zdrojů.",
  machinePricing: MACHINE_RENTAL_PRICING.map((item) => ({ ...item })),
  footerNote: "Poznámka k ceníku: ceny jsou uvedené bez DPH 21 %. U nejasností nebo atypických dodávek kontaktujte dispečink.",
};

export const fallbackFaqContent: FaqContentMap = {
  containers: {
    key: "containers",
    title: "Kontejnery",
    description: "Objednávka přes web, pravidla odpadu a potvrzení termínu.",
    order: 1,
    items: CONTAINER_FAQ,
  },
  demolition: {
    key: "demolition",
    title: "Demolice",
    description: "Nejčastější otázky k poptávce, rozsahu prací a návaznému odvozu.",
    order: 2,
    items: DEMOLITION_FAQ,
  },
  recycling: {
    key: "recycling",
    title: "Recyklace a materiál",
    description: "Příjem materiálu, podmínky přejímky a navazující služby.",
    order: 3,
    items: RECYCLING_FAQ,
  },
};

export const fallbackSiteSettingsContent: SiteSettingsContent = {
  brandName: SITE_META.brandName,
  companyName: SITE_META.companyName,
  metaTitle: "Demolice Recyklace - Kontejnery 3 m³",
  metaDescription: "Demolice, recyklace a objednávka kontejneru 3 m³ přes web pro Prahu a Středočeský kraj.",
  regionsLabel: SERVICE_AREA.regionsLabel,
  phone: CONTACT.phone,
  phoneHref: CONTACT.phoneHref,
  email: CONTACT.email,
  emailHref: CONTACT.emailHref,
  operatorAddressLine: CONTACT.operatorAddressLine,
  operationAddressLine: CONTACT.operationAddressLine,
  icz: CONTACT.icz,
  mapUrl: CONTACT.mapUrl,
  hours: CONTACT.hours.map((hour) => ({ ...hour })),
  headerLinks: HEADER_LINKS.map((link) => ({ ...link })),
  footerServiceLinks: FOOTER_SERVICE_LINKS.map((link) => ({ ...link })),
  footerInfoLinks: FOOTER_INFO_LINKS.map((link) => ({ ...link })),
};

const defaultMarketingFallback: MarketingPageContent = {
  title: "Marketing stránka",
  slug: "",
  eyebrow: "",
  heroTitle: "",
  heroDescription: "",
  seoTitle: "",
  seoDescription: "",
  sections: [],
};

export const fallbackMarketingPages: Record<string, MarketingPageContent> = {
  demolice: {
    ...defaultMarketingFallback,
    title: "Demolice",
    slug: "demolice",
    heroTitle: "Demolice s jasným postupem a navazující recyklací",
    heroDescription:
      "Zajišťujeme demoliční práce od menších objektů po náročnější realizace. Zakázku vedeme od zadání přes obhlídku až po odvoz a zpracování materiálu.",
    seoTitle: "Demolice | Demolice Recyklace",
    seoDescription: "Demolice objektů a navazující recyklace materiálu pro Prahu a Středočeský kraj.",
  },
  recyklace: {
    ...defaultMarketingFallback,
    title: "Recyklace",
    slug: "recyklace",
    heroTitle: "Recyklace stavebních materiálů",
    heroDescription:
      "V recyklačním středisku řešíme příjem, třídění a další zpracování inertních materiálů. Před příjezdem doporučujeme ověřit složení materiálu.",
    seoTitle: "Recyklace | Demolice Recyklace",
    seoDescription: "Příjem, třídění a zpracování stavebních materiálů v recyklačním středisku.",
  },
  "prodej-materialu": {
    ...defaultMarketingFallback,
    title: "Prodej materiálu",
    slug: "prodej-materialu",
    heroTitle: "Prodej materiálu",
    heroDescription: "Dodáváme písky, kamenivo i recykláty pro stavby a terénní úpravy včetně domluvy termínu dodání.",
    seoTitle: "Prodej materiálu | Demolice Recyklace",
    seoDescription: "Přehled stavebních materiálů, recyklátů a cen pro dodání i odběr.",
  },
  technika: {
    ...defaultMarketingFallback,
    title: "Technika",
    slug: "technika",
    heroTitle: "Technika",
    heroDescription: "Přehled techniky pro demolice, recyklaci i zemní práce s možností domluvy konkrétního nasazení.",
    seoTitle: "Technika | Demolice Recyklace",
    seoDescription: "Strojní technika pro demolice, recyklaci a návazné práce.",
  },
  realizace: {
    ...defaultMarketingFallback,
    title: "Realizace",
    slug: "realizace",
    heroTitle: "Realizace",
    heroDescription: "Výběr realizovaných zakázek z oblasti demolice, recyklace a kontejnerové dopravy.",
    seoTitle: "Realizace | Demolice Recyklace",
    seoDescription: "Ukázky realizovaných zakázek v oblasti demolice, recyklace a kontejnerů.",
  },
  "o-nas": {
    ...defaultMarketingFallback,
    title: "O nás",
    slug: "o-nas",
    heroTitle: "O nás",
    heroDescription: "Prakticky zaměřené služby pro demolice, recyklaci, kontejnerovou dopravu a prodej materiálu.",
    seoTitle: "O nás | Demolice Recyklace",
    seoDescription: "Informace o společnosti, službách a způsobu spolupráce.",
  },
  kontakt: {
    ...defaultMarketingFallback,
    title: "Kontakt",
    slug: "kontakt",
    heroTitle: "Kontakt",
    heroDescription: "Nejrychlejší cesta je dispečink. Pomůžeme s objednávkou kontejneru, poptávkou demolice i recyklací.",
    seoTitle: "Kontakt | Demolice Recyklace",
    seoDescription: "Kontaktní údaje, provozní doba a dostupnost služeb.",
  },
  gdpr: {
    ...defaultMarketingFallback,
    title: "GDPR",
    slug: "gdpr",
    heroTitle: "Zásady zpracování osobních údajů",
    heroDescription: "Informace o zpracování osobních údajů při objednávce služeb.",
    seoTitle: "Zásady zpracování osobních údajů | Demolice Recyklace",
    seoDescription: "Pravidla zpracování osobních údajů pro služby kontejnerů, demolice a recyklace.",
  },
  "obchodni-podminky": {
    ...defaultMarketingFallback,
    title: "Obchodní podmínky",
    slug: "obchodni-podminky",
    heroTitle: "Obchodní podmínky",
    heroDescription: "Obchodní podmínky služby pronájmu a odvozu kontejneru 3 m³.",
    seoTitle: "Obchodní podmínky | Demolice Recyklace",
    seoDescription: "Podmínky poskytování služeb společnosti MINUTY a.s.",
  },
  cookies: {
    ...defaultMarketingFallback,
    title: "Cookies",
    slug: "cookies",
    heroTitle: "Zásady používání cookies",
    heroDescription: "Přehled používání cookies, analytiky a správy souhlasu.",
    seoTitle: "Zásady používání cookies | Demolice Recyklace",
    seoDescription: "Informace o používání cookies a analytických nástrojů na webu.",
  },
};

function normalizeLinks(
  value: Array<CmsNavLink | null> | null | undefined,
  fallback: SiteSettingsContent["headerLinks"],
) {
  if (!value?.length) {
    return fallback;
  }

  const next = value
    .map((item) => {
      const label = item?.label?.trim();
      const href = item?.href?.trim();

      if (!label || !href) {
        return null;
      }

      return { label, href };
    })
    .filter((item): item is SiteSettingsContent["headerLinks"][number] => Boolean(item));

  return next.length ? next : fallback;
}

function normalizeHours(
  value: Array<CmsContactHour | null> | null | undefined,
  fallback: SiteSettingsContent["hours"],
) {
  if (!value?.length) {
    return fallback;
  }

  const next = value
    .map((item) => {
      const label = item?.label?.trim();
      const hourValue = item?.value?.trim();

      if (!label || !hourValue) {
        return null;
      }

      return { label, value: hourValue };
    })
    .filter((item): item is SiteSettingsContent["hours"][number] => Boolean(item));

  return next.length ? next : fallback;
}

function toPhoneHref(phone: string) {
  const normalized = phone.replace(/\s+/g, "");
  return normalized.startsWith("tel:") ? normalized : `tel:${normalized}`;
}

function toEmailHref(email: string) {
  const normalized = email.trim();
  return normalized.startsWith("mailto:") ? normalized : `mailto:${normalized}`;
}

function normalizeMarketingSections(value: Array<CmsMarketingSection | null> | null | undefined) {
  if (!value?.length) {
    return [];
  }

  return value
    .map((section) => {
      const heading = section?.heading?.trim();

      if (!heading) {
        return null;
      }

      return {
        heading,
        body: section?.body?.trim() ?? "",
        items: normalizeStringList(section?.items, []),
      };
    })
    .filter((section): section is MarketingSectionContent => Boolean(section));
}

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

export function mapSiteSettingsContent(data: CmsSiteSettings | null): SiteSettingsContent {
  if (!data) {
    return fallbackSiteSettingsContent;
  }

  const brandName = data.brandName?.trim() || fallbackSiteSettingsContent.brandName;
  const companyName = data.companyName?.trim() || fallbackSiteSettingsContent.companyName;
  const metaTitle = data.metaTitle?.trim() || fallbackSiteSettingsContent.metaTitle;
  const metaDescription = data.metaDescription?.trim() || fallbackSiteSettingsContent.metaDescription;
  const regionsLabel = data.regionsLabel?.trim() || fallbackSiteSettingsContent.regionsLabel;
  const phone = data.phone?.trim() || fallbackSiteSettingsContent.phone;
  const email = data.email?.trim() || fallbackSiteSettingsContent.email;

  return {
    brandName,
    companyName,
    metaTitle,
    metaDescription,
    regionsLabel,
    phone,
    phoneHref: toPhoneHref(phone),
    email,
    emailHref: toEmailHref(email),
    operatorAddressLine: data.operatorAddressLine?.trim() || fallbackSiteSettingsContent.operatorAddressLine,
    operationAddressLine: data.operationAddressLine?.trim() || fallbackSiteSettingsContent.operationAddressLine,
    icz: data.icz?.trim() || fallbackSiteSettingsContent.icz,
    mapUrl: data.mapUrl?.trim() || fallbackSiteSettingsContent.mapUrl,
    hours: normalizeHours(data.hours, fallbackSiteSettingsContent.hours),
    headerLinks: normalizeLinks(data.headerLinks, fallbackSiteSettingsContent.headerLinks),
    footerServiceLinks: normalizeLinks(data.footerServiceLinks, fallbackSiteSettingsContent.footerServiceLinks),
    footerInfoLinks: normalizeLinks(data.footerInfoLinks, fallbackSiteSettingsContent.footerInfoLinks),
  };
}

export function mapMarketingPageContent(slug: string, data: CmsMarketingPage | null): MarketingPageContent {
  const fallback = fallbackMarketingPages[slug] || {
    ...defaultMarketingFallback,
    slug,
    title: slug,
  };

  if (!data) {
    return fallback;
  }

  const title = data.title?.trim() || fallback.title;
  const normalizedSlug = data.slug?.trim() || fallback.slug || slug;
  const heroTitle = data.heroTitle?.trim() || fallback.heroTitle || title;
  const heroDescription = data.heroDescription?.trim() || fallback.heroDescription;

  return {
    title,
    slug: normalizedSlug,
    eyebrow: data.eyebrow?.trim() || fallback.eyebrow,
    heroTitle,
    heroDescription,
    seoTitle: data.seoTitle?.trim() || fallback.seoTitle || heroTitle,
    seoDescription: data.seoDescription?.trim() || fallback.seoDescription || heroDescription,
    sections: normalizeMarketingSections(data.sections),
  };
}
