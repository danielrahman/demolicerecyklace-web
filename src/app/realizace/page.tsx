import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getMarketingPageContent } from "@/lib/cms/getters";
import { createPageMetadata } from "@/lib/seo-metadata";
import { CONTACT } from "@/lib/site-config";
import { ui } from "@/lib/ui";

const serviceBadgeClasses: Record<"Demolice" | "Recyklace" | "Kontejnery", string> = {
  Demolice: "bg-red-900/60 text-red-200 border-red-700/60",
  Recyklace: "bg-emerald-900/60 text-emerald-200 border-emerald-700/60",
  Kontejnery: "bg-amber-900/60 text-amber-200 border-amber-700/60",
};

export async function generateMetadata(): Promise<Metadata> {
  const marketing = await getMarketingPageContent("realizace");
  const title = marketing?.seoTitle || "Realizace | Demolice Recyklace";
  const description =
    marketing?.seoDescription ||
    "Ukázky realizací v oblasti demolice, recyklace a kontejnerové dopravy v Praze a okolí.";

  return createPageMetadata({
    title,
    description,
    canonicalPath: "/realizace",
  });
}

export default async function RealizacePage() {
  const marketing = await getMarketingPageContent("realizace");
  const projects = marketing?.referenceProjects || [];
  const projectsTitle = marketing?.referenceProjectsTitle || "Vybrané realizace";
  const processTitle = marketing?.processTitle || "Jak vedeme realizaci";
  const processSteps = marketing?.processSteps || [];

  return (
    <div className="space-y-10 pb-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">{marketing?.heroTitle || "Realizace"}</h1>
        <p className="max-w-4xl text-zinc-300">
          {marketing?.heroDescription ||
            "Výběr referenčních zakázek z oblasti demolice, recyklace a kontejnerové dopravy. Cílem je ukázat typy projektů, které běžně realizujeme, a výsledky, které klienti očekávají."}
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <a href={CONTACT.phoneHref} className={ui.buttonPrimary}>
            Zavolat {CONTACT.phone}
          </a>
          <Link href="/demolice" className={ui.buttonSecondary}>
            Přehled služeb demolice
          </Link>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold">{projectsTitle}</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article key={project.title} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={project.imageUrl}
                alt={project.imageAlt}
                width={1280}
                height={720}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <span
                className={`absolute left-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold ${serviceBadgeClasses[project.service]}`}
              >
                {project.service}
              </span>
            </div>
            <div className="space-y-2 p-4">
              <h2 className="text-xl font-bold">{project.title}</h2>
              <p className="text-sm text-zinc-400">Lokalita: {project.location}</p>
              <p className="text-sm text-zinc-300">{project.description}</p>
              <p className="text-sm text-zinc-200">Výsledek: {project.output}</p>
            </div>
          </article>
        ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-2xl font-bold">{processTitle}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {processSteps.map((step, index) => (
            <article key={`${step}-${index + 1}`} className="rounded-xl border border-zinc-700 bg-zinc-950 p-4">
              <p className="font-mono text-sm text-[var(--color-accent)]">{index + 1}</p>
              <p className="mt-1 font-semibold">{step}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
