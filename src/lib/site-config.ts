import { PRAHA_POSTAL_CODES, STREDOCESKY_POSTAL_CODES } from "@/lib/service-area";

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
  operationAddressLine: "Ruzyně, ul. Na Hůrce",
  icz: "CZA00826",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Na+Kodymce+1440%2F17%2C+160+00+Praha+6-Dejvice",
  hours: [
    { label: "Po-Pá", value: "7:00 - 17:00" },
    { label: "So", value: "8:00 - 14:00" },
  ],
} as const;

export const CONTAINER_PRODUCT = {
  availableNow: "3m³",
  futureSizes: ["5m³", "7m³", "9m³", "12m³"],
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
  { href: "/prodej-materialu", label: "Materiál" },
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
  { href: "/faq", label: "FAQ" },
  { href: "/gdpr", label: "Zásady zpracování osobních údajů" },
  { href: "/obchodni-podminky", label: "Obchodní podmínky" },
  { href: "/cookies", label: "Cookies" },
] as const;
