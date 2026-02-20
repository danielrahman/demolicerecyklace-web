import type { Metadata } from "next";
import Link from "next/link";

import { ui } from "@/lib/ui";

type DocumentLink = {
  title: string;
  description: string;
  href: string;
  external?: boolean;
};

const docs: DocumentLink[] = [
  {
    title: "iČP",
    description: "Interní/legislativní dokument provozovny.",
    href: "/dokumenty/icp",
  },
  {
    title: "ZPO",
    description: "Základní popis odpadu pro ukládku a evidenci.",
    href: "/dokumenty/zpo",
  },
  {
    title: "Ceník 2026 (PDF)",
    description: "Originální PDF verze kompletního ceníku.",
    href: "/documents/cenik-2026.pdf",
    external: true,
  },
];

export const metadata: Metadata = {
  title: "Dokumenty ke stažení | Demolice Recyklace",
  description: "Přehled dokumentů ke stažení včetně iČP, ZPO a PDF ceníku.",
  alternates: {
    canonical: "/dokumenty",
  },
};

export default function DokumentyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Dokumenty ke stažení</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {docs.map((doc) => (
          <article key={doc.title} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="text-2xl font-bold">{doc.title}</h2>
            <p className="mt-2 text-zinc-300">{doc.description}</p>
            {doc.external ? (
              <a
                href={doc.href}
                target="_blank"
                rel="noreferrer"
                className={`${ui.buttonPrimary} mt-4`}
              >
                Otevřít PDF
              </a>
            ) : (
              <Link
                href={doc.href}
                className={`${ui.buttonPrimary} mt-4`}
              >
                Otevřít stránku
              </Link>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
