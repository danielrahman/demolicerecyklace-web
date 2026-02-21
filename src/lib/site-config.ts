import { PRAHA_POSTAL_CODES, STREDOCESKY_POSTAL_CODES } from "@/lib/service-area";

const DEFAULT_SITE_URL = "https://www.demolicerecyklace.cz";

function normalizeSiteUrl(rawValue?: string) {
  const trimmed = rawValue?.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withProtocol).toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
}

const normalizedFromEnv = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const SITE_URL = normalizedFromEnv ?? DEFAULT_SITE_URL;

export const SITE_META = {
  brandName: "Demolice Recyklace",
  companyName: "MINUTY a.s.",
} as const;

export const CONTACT = {
  phone: "+420 606 660 655",
  phoneHref: "tel:+420606660655",
  email: "info@minutyas.cz",
  emailHref: "mailto:info@minutyas.cz",
  operatorAddressLine: "Na Kodymce 1440/17, 160 00 Praha 6-Dejvice",
  operationAddressLine: "Na Kodymce 1440/17, 160 00 Praha 6-Dejvice",
  icz: "CZA00826",
  mapUrl: "https://www.google.cz/maps/place/Minuty+A.s./@50.0733062,14.2483978,12.88z/data=!4m10!1m2!2m1!1sdemolice+recyklace+praha+6!3m6!1s0x470b954852ecac27:0x8ce976638ef050eb!8m2!3d50.0800077!4d14.2921192!15sChpkZW1vbGljZSByZWN5a2xhY2UgcHJhaGEgNpIBEHJlY3ljbGluZ19jZW50ZXLgAQA!16s%2Fg%2F11h54z_p56",
  hours: [
    { label: "Po-Pá", value: "7:00 - 17:00" },
    { label: "So", value: "8:00 - 14:00" },
  ],
} as const;

export const CONTAINER_PRODUCT = {
  availableNow: "3 m³",
  futureSizes: ["5 m³", "7 m³", "9 m³", "12 m³"],
  maxContainerCountPerOrder: 3,
} as const;

export const SERVICE_AREA = {
  regionsLabel: "Praha a Středočeský kraj",
  prahaPostalCodes: PRAHA_POSTAL_CODES,
  stredoceskyPostalCodes: STREDOCESKY_POSTAL_CODES,
} as const;

export const HEADER_LINKS = [
  { href: "/", label: "Domů" },
  { href: "/kontejnery", label: "Kontejnery" },
  { href: "/demolice", label: "Demolice" },
  { href: "/recyklace", label: "Recyklace" },
  { href: "/prodej-materialu", label: "Prodej materiálu" },
  { href: "/cenik", label: "Ceník" },
  { href: "/o-nas", label: "O nás" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const FOOTER_SERVICE_LINKS = [
  { href: "/kontejnery", label: "Kontejnery" },
  { href: "/demolice", label: "Demolice" },
  { href: "/recyklace", label: "Recyklace" },
  { href: "/prodej-materialu", label: "Prodej materiálu" },
  { href: "/technika", label: "Technika" },
  { href: "/realizace", label: "Realizace" },
  { href: "/cenik", label: "Ceník" },
  { href: "/o-nas", label: "O nás" },
] as const;

export const FOOTER_INFO_LINKS = [
  { href: "/kontakt", label: "Kontakt" },
  { href: "/dokumenty", label: "Dokumenty ke stažení" },
  { href: "/faq", label: "Časté dotazy (FAQ)" },
  { href: "/gdpr", label: "Zásady zpracování osobních údajů" },
  { href: "/obchodni-podminky", label: "Obchodní podmínky" },
  { href: "/cookies", label: "Cookies" },
] as const;
