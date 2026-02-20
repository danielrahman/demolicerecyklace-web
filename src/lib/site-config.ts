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
  availableNow: "3 m3",
  futureSizes: ["5 m3", "7 m3", "9 m3", "12 m3"],
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
  { href: "/cenik", label: "Ceník" },
  { href: "/demolice", label: "Demolice" },
  { href: "/prodej-materialu", label: "Materiál" },
  { href: "/recyklace", label: "Recyklace" },
  { href: "/o-nas", label: "O nás" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const FOOTER_SERVICE_LINKS = [
  { href: "/kontejnery", label: "Kontejnery" },
  { href: "/kontejnery/cenik", label: "Ceník kontejnerů 3 m3" },
  { href: "/kontejnery/objednat", label: "Objednat kontejner" },
  { href: "/kontejnery/co-patri-nepatri", label: "Co patří a nepatří" },
  { href: "/kontejnery/faq", label: "FAQ ke kontejnerům" },
  { href: "/kontejnery/lokality", label: "Obsluhované lokality" },
  { href: "/demolice", label: "Demolice" },
  { href: "/recyklace", label: "Recyklace" },
  { href: "/prodej-materialu", label: "Prodej materiálu" },
  { href: "/technika", label: "Technika" },
  { href: "/realizace", label: "Realizace" },
  { href: "/o-nas", label: "O nás" },
] as const;

export const FOOTER_INFO_LINKS = [
  { href: "/kontakt", label: "Kontakt" },
  { href: "/dokumenty", label: "Dokumenty ke stažení" },
  { href: "/dokumenty/icp", label: "iČP" },
  { href: "/dokumenty/zpo", label: "ZPO" },
  { href: "/faq", label: "FAQ" },
  { href: "/gdpr", label: "GDPR" },
  { href: "/obchodni-podminky", label: "Obchodní podmínky" },
  { href: "/cookies", label: "Cookies" },
] as const;
