import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getMarketingPageContent } from "@/lib/cms/getters";
import { CONTACT } from "@/lib/site-config";
import { ui } from "@/lib/ui";

type Project = {
  title: string;
  service: "Demolice" | "Recyklace" | "Kontejnery";
  location: string;
  description: string;
  output: string;
  image: string;
};

const projects: Project[] = [
  {
    title: "Demolice objektu s tříděním odpadu",
    service: "Demolice",
    location: "Praha 6",
    description: "Postupná demolice s oddělením betonových a směsných frakcí.",
    output: "Bezpečné vyklizení staveniště a návazný odvoz odpadu.",
    image: "/legacy/current-web/images_ffgallery_20180320_5ab15428e0152_demolice_IMG_1762.jpg",
  },
  {
    title: "Demoliční práce ve stísněném prostoru",
    service: "Demolice",
    location: "Praha 10",
    description: "Nasazení pásové techniky s důrazem na logistiku přístupu.",
    output: "Plynulý průběh bez omezení okolních provozů.",
    image: "/legacy/current-web/images_ffgallery_20180320_5ab15428e0152_demolice_IMG_2600.jpg",
  },
  {
    title: "Zpracování inertního materiálu",
    service: "Recyklace",
    location: "Ruzyně",
    description: "Příjem a třídění stavebního materiálu s následným využitím.",
    output: "Připravené frakce pro další stavební použití.",
    image: "/legacy/current-web/images_ffgallery_20180320_5ab179c8d5689_recyklace_IMG_2094.jpg",
  },
  {
    title: "Provoz recyklační linky",
    service: "Recyklace",
    location: "Středočeský kraj",
    description: "Zpracování materiálu ve středisku s kontrolou kvality frakcí.",
    output: "Stabilní výstup recyklátu pro stavební podklady.",
    image: "/legacy/current-web/images_ffgallery_20180320_5ab179c8d5689_recyklace_IMG_2105.jpg",
  },
  {
    title: "Sériové přistavování kontejnerů",
    service: "Kontejnery",
    location: "Praha a okolí",
    description: "Opakované přistavení a odvoz kontejnerů dle harmonogramu stavby.",
    output: "Stabilní odvoz bez prostojů na stavbě.",
    image: "/legacy/current-web/images_ffgallery_20180320_5ab18a05cb602_pronajem_IMG_2585.jpg",
  },
  {
    title: "Kontejnerový odvoz stavební suti",
    service: "Kontejnery",
    location: "Kladno",
    description: "Rychlé přistavení kontejneru s ručním potvrzením termínu operátorem.",
    output: "Odvoz dle kapacity a jasných pravidel odpadu.",
    image: "/legacy/current-web/images_ffgallery_20180320_5ab18a05cb602_pronajem_IMG_2627.jpg",
  },
];

const serviceBadgeClasses: Record<Project["service"], string> = {
  Demolice: "bg-red-900/60 text-red-200 border-red-700/60",
  Recyklace: "bg-emerald-900/60 text-emerald-200 border-emerald-700/60",
  Kontejnery: "bg-amber-900/60 text-amber-200 border-amber-700/60",
};

export async function generateMetadata(): Promise<Metadata> {
  const marketing = await getMarketingPageContent("realizace");

  return {
    title: marketing?.seoTitle || "Realizace | Demolice Recyklace",
    description:
      marketing?.seoDescription ||
      "Ukázky realizací v oblasti demolice, recyklace a kontejnerové dopravy v Praze a okolí.",
    alternates: {
      canonical: "/realizace",
    },
  };
}

export default async function RealizacePage() {
  const marketing = await getMarketingPageContent("realizace");

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

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article key={project.title} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
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
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-2xl font-bold">Jak vedeme realizaci</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <article className="rounded-xl border border-zinc-700 bg-zinc-950 p-4">
            <p className="font-mono text-sm text-[var(--color-accent)]">1</p>
            <p className="mt-1 font-semibold">Prohlídka a zadání</p>
          </article>
          <article className="rounded-xl border border-zinc-700 bg-zinc-950 p-4">
            <p className="font-mono text-sm text-[var(--color-accent)]">2</p>
            <p className="mt-1 font-semibold">Návrh postupu</p>
          </article>
          <article className="rounded-xl border border-zinc-700 bg-zinc-950 p-4">
            <p className="font-mono text-sm text-[var(--color-accent)]">3</p>
            <p className="mt-1 font-semibold">Realizace a odvoz</p>
          </article>
          <article className="rounded-xl border border-zinc-700 bg-zinc-950 p-4">
            <p className="font-mono text-sm text-[var(--color-accent)]">4</p>
            <p className="mt-1 font-semibold">Předání a dokumentace</p>
          </article>
        </div>
      </section>
    </div>
  );
}
