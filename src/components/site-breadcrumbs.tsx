"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SITE_URL } from "@/lib/site-config";

const segmentLabels: Record<string, string> = {
  admin: "Admin",
  objednavky: "Objednávky",
  prihlaseni: "Přihlášení",
  cenik: "Ceník",
  cookies: "Cookies",
  demolice: "Demolice",
  dokumenty: "Dokumenty",
  icp: "iČP",
  zpo: "ZPO",
  faq: "FAQ",
  gdpr: "Zásady osobních údajů",
  kontakt: "Kontakt",
  kontejnery: "Kontejnery",
  lokality: "Lokality",
  praha: "Praha",
  "stredocesky-kraj": "Středočeský kraj",
  objednat: "Objednat",
  "o-nas": "O nás",
  "obchodni-podminky": "Obchodní podmínky",
  "prodej-materialu": "Prodej materiálu",
  realizace: "Realizace",
  recyklace: "Recyklace",
  technika: "Technika",
};

function toTitleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function labelForSegment(segment: string) {
  if (segmentLabels[segment]) {
    return segmentLabels[segment];
  }

  if (segment.startsWith("ORD-") || segment.startsWith("OBJ-")) {
    return "Detail objednávky";
  }

  const decoded = decodeURIComponent(segment).replace(/-/g, " ");
  return toTitleCase(decoded);
}

export function SiteBreadcrumbs() {
  const pathname = usePathname();

  if (!pathname || pathname === "/") {
    return null;
  }

  if (pathname.startsWith("/kontejnery/objednat")) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0 || segments[0] === "api") {
    return null;
  }

  const crumbs = [
    { href: "/", label: "Domů" },
    ...segments.map((segment, index) => ({
      href: `/${segments.slice(0, index + 1).join("/")}`,
      label: labelForSegment(segment),
    })),
  ];
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `${SITE_URL}${crumb.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <nav aria-label="Drobečková navigace" className="mb-6 text-sm">
        <ol className="flex flex-wrap items-center gap-1 text-zinc-400">
          {crumbs.map((crumb, index) => {
            const isCurrent = index === crumbs.length - 1;

            return (
              <li key={crumb.href} className="flex items-center gap-1">
                {isCurrent ? (
                  <span className="font-semibold text-zinc-100">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="rounded px-1 py-0.5 transition hover:text-[var(--color-accent)]">
                    {crumb.label}
                  </Link>
                )}
                {isCurrent ? null : <span aria-hidden="true" className="px-1 text-zinc-600">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
