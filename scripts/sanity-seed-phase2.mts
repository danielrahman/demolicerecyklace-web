import nextEnv from "@next/env";
import { createClient } from "next-sanity";

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

const SITE_META = {
  brandName: "Demolice Recyklace",
  companyName: "MINUTY a.s.",
} as const;

const SERVICE_AREA = {
  regionsLabel: "Praha a Středočeský kraj",
} as const;

const CONTACT = {
  phone: "+420 606 660 655",
  email: "info@minutyas.cz",
  operatorAddressLine: "Na Kodymce 1440/17, 160 00 Praha 6-Dejvice",
  operationAddressLine: "Na Kodymce 1440/17, 160 00 Praha 6-Dejvice",
  icz: "CZA00826",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Na+Kodymce+1440%2F17%2C+160+00+Praha+6-Dejvice",
  hours: [
    { label: "Po-Pá", value: "7:00 - 17:00" },
    { label: "So", value: "8:00 - 14:00" },
  ],
} as const;

const HEADER_LINKS = [
  { href: "/", label: "Domů" },
  { href: "/kontejnery", label: "Kontejnery" },
  { href: "/demolice", label: "Demolice" },
  { href: "/recyklace", label: "Recyklace" },
  { href: "/prodej-materialu", label: "Prodej materiálu" },
  { href: "/cenik", label: "Ceník" },
  { href: "/o-nas", label: "O nás" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

const FOOTER_SERVICE_LINKS = [
  { href: "/kontejnery", label: "Kontejnery" },
  { href: "/demolice", label: "Demolice" },
  { href: "/recyklace", label: "Recyklace" },
  { href: "/prodej-materialu", label: "Prodej materiálu" },
  { href: "/technika", label: "Technika" },
  { href: "/realizace", label: "Realizace" },
  { href: "/cenik", label: "Ceník" },
  { href: "/o-nas", label: "O nás" },
] as const;

const FOOTER_INFO_LINKS = [
  { href: "/kontakt", label: "Kontakt" },
  { href: "/dokumenty", label: "Dokumenty ke stažení" },
  { href: "/faq", label: "Časté dotazy (FAQ)" },
  { href: "/gdpr", label: "Zásady zpracování osobních údajů" },
  { href: "/obchodni-podminky", label: "Obchodní podmínky" },
  { href: "/cookies", label: "Cookies" },
] as const;

const siteSettingsDoc = {
  _id: "siteSettings",
  _type: "siteSettings",
  brandName: SITE_META.brandName,
  companyName: SITE_META.companyName,
  metaTitle: "Demolice Recyklace - Kontejnery 3 m³",
  metaDescription: "Demolice, recyklace a objednávka kontejneru 3 m³ přes web pro Prahu a Středočeský kraj.",
  regionsLabel: SERVICE_AREA.regionsLabel,
  phone: CONTACT.phone,
  email: CONTACT.email,
  operatorAddressLine: CONTACT.operatorAddressLine,
  operationAddressLine: CONTACT.operationAddressLine,
  icz: CONTACT.icz,
  mapUrl: CONTACT.mapUrl,
  hours: CONTACT.hours.map((hour, index) => ({
    _key: `hour-${index + 1}`,
    label: hour.label,
    value: hour.value,
  })),
  headerLinks: HEADER_LINKS.map((link, index) => ({
    _key: `header-${index + 1}`,
    label: link.label,
    href: link.href,
  })),
  footerServiceLinks: FOOTER_SERVICE_LINKS.map((link, index) => ({
    _key: `footer-service-${index + 1}`,
    label: link.label,
    href: link.href,
  })),
  footerInfoLinks: FOOTER_INFO_LINKS.map((link, index) => ({
    _key: `footer-info-${index + 1}`,
    label: link.label,
    href: link.href,
  })),
};

const marketingPages = [
  {
    slug: "demolice",
    title: "Demolice",
    heroTitle: "Demolice s jasným postupem a navazující recyklací",
    heroDescription:
      "Zajišťujeme demoliční práce od menších objektů po náročnější realizace. Zakázku vedeme od zadání přes obhlídku až po odvoz a zpracování materiálu.",
    seoTitle: "Demolice | Demolice Recyklace",
    seoDescription: "Demolice objektů a navazující recyklace materiálu pro Prahu a Středočeský kraj.",
  },
  {
    slug: "recyklace",
    title: "Recyklace",
    heroTitle: "Recyklace stavebních materiálů",
    heroDescription:
      "V recyklačním středisku řešíme příjem, třídění a další zpracování inertních materiálů. Před příjezdem doporučujeme ověřit složení materiálu.",
    seoTitle: "Recyklace | Demolice Recyklace",
    seoDescription: "Příjem, třídění a zpracování stavebních materiálů v recyklačním středisku.",
  },
  {
    slug: "prodej-materialu",
    title: "Prodej materiálu",
    heroTitle: "Prodej materiálu",
    heroDescription: "Dodáváme písky, kamenivo i recykláty pro stavby a terénní úpravy včetně domluvy termínu dodání.",
    seoTitle: "Prodej materiálu | Demolice Recyklace",
    seoDescription: "Přehled stavebních materiálů, recyklátů a cen pro dodání i odběr.",
  },
  {
    slug: "technika",
    title: "Technika",
    heroTitle: "Technika",
    heroDescription: "Přehled techniky pro demolice, recyklaci i zemní práce s možností domluvy konkrétního nasazení.",
    seoTitle: "Technika | Demolice Recyklace",
    seoDescription: "Strojní technika pro demolice, recyklaci a návazné práce.",
  },
  {
    slug: "realizace",
    title: "Realizace",
    heroTitle: "Realizace",
    heroDescription: "Výběr realizovaných zakázek z oblasti demolice, recyklace a kontejnerové dopravy.",
    seoTitle: "Realizace | Demolice Recyklace",
    seoDescription: "Ukázky realizovaných zakázek v oblasti demolice, recyklace a kontejnerů.",
  },
  {
    slug: "o-nas",
    title: "O nás",
    heroTitle: "O nás",
    heroDescription: "Prakticky zaměřené služby pro demolice, recyklaci, kontejnerovou dopravu a prodej materiálu.",
    seoTitle: "O nás | Demolice Recyklace",
    seoDescription: "Informace o společnosti, službách a způsobu spolupráce.",
  },
  {
    slug: "kontakt",
    title: "Kontakt",
    heroTitle: "Kontakt",
    heroDescription:
      "Nejrychlejší cesta je dispečink. Pomůžeme s objednávkou kontejneru, poptávkou demolice i recyklací.",
    seoTitle: "Kontakt | Demolice Recyklace",
    seoDescription: "Kontaktní údaje, provozní doba a dostupnost služeb.",
  },
  {
    slug: "gdpr",
    title: "GDPR",
    heroTitle: "Zásady zpracování osobních údajů",
    heroDescription: "Informace o zpracování osobních údajů při objednávce služeb.",
    seoTitle: "Zásady zpracování osobních údajů | Demolice Recyklace",
    seoDescription: "Pravidla zpracování osobních údajů pro služby kontejnerů, demolice a recyklace.",
  },
  {
    slug: "obchodni-podminky",
    title: "Obchodní podmínky",
    heroTitle: "Obchodní podmínky",
    heroDescription: "Obchodní podmínky služby pronájmu a odvozu kontejneru 3 m³.",
    seoTitle: "Obchodní podmínky | Demolice Recyklace",
    seoDescription: "Podmínky poskytování služeb společnosti MINUTY a.s.",
  },
  {
    slug: "cookies",
    title: "Cookies",
    heroTitle: "Zásady používání cookies",
    heroDescription: "Přehled používání cookies, analytiky a správy souhlasu.",
    seoTitle: "Zásady používání cookies | Demolice Recyklace",
    seoDescription: "Informace o používání cookies a analytických nástrojů na webu.",
  },
];

async function run() {
  await client.createOrReplace(siteSettingsDoc as never);
  console.log("Upserted siteSettings");

  for (const page of marketingPages) {
    await client.createOrReplace({
      _id: `marketingPage.${page.slug}`,
      _type: "marketingPage",
      title: page.title,
      slug: {
        _type: "slug",
        current: page.slug,
      },
      heroTitle: page.heroTitle,
      heroDescription: page.heroDescription,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      sections: [],
    } as never);

    console.log(`Upserted marketingPage.${page.slug}`);
  }

  console.log("Phase 2 seed completed.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
