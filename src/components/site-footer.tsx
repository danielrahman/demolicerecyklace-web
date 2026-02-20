"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

import type { SiteSettingsContent } from "@/lib/cms/mappers";
import { CONTAINER_PRODUCT } from "@/lib/site-config";

type SiteFooterProps = {
  settings: Pick<
    SiteSettingsContent,
    | "brandName"
    | "companyName"
    | "regionsLabel"
    | "phone"
    | "phoneHref"
    | "email"
    | "emailHref"
    | "operatorAddressLine"
    | "operationAddressLine"
    | "icz"
    | "mapUrl"
    | "hours"
    | "footerServiceLinks"
    | "footerInfoLinks"
  >;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const pathname = usePathname();
  const isCheckoutRoute = pathname?.startsWith("/kontejnery/objednat");

  if (isCheckoutRoute) {
    return (
      <footer className="mt-8 border-t border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-3 px-4 py-4 text-xs text-zinc-400 sm:px-6 lg:px-8">
          <a className="underline decoration-zinc-500 underline-offset-2 hover:text-zinc-200" href="/obchodni-podminky">
            Obchodní podmínky
          </a>
          <span className="text-zinc-600">|</span>
          <a className="underline decoration-zinc-500 underline-offset-2 hover:text-zinc-200" href="/gdpr">
            Ochrana osobních údajů
          </a>
          <span className="text-zinc-600">|</span>
          <a className="underline decoration-zinc-500 underline-offset-2 hover:text-zinc-200" href="/cookies">
            Cookies
          </a>
        </div>
      </footer>
    );
  }

  const containerQuickLinks = [
    { href: "/kontejnery", label: "Vše o kontejnerech" },
    { href: "/kontejnery/objednat", label: "Objednat kontejner" },
    { href: "/cenik#kontejnery", label: "Ceník kontejnerů" },
  ] as const;

  return (
    <footer className="mt-16 border-t border-zinc-800 bg-zinc-950/70">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="border-b border-zinc-800/80 pb-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Link href="/" className="inline-flex">
                <Image
                  src="/brand/logo-original.png"
                  alt={`${settings.brandName} logo`}
                  width={215}
                  height={58}
                  className="h-10 w-auto sm:h-11"
                />
              </Link>
              <p className="mt-3 text-sm text-zinc-300">
                Online objednávka kontejneru {CONTAINER_PRODUCT.availableNow} pro oblast {settings.regionsLabel}. Termín potvrzuje operátor.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm lg:justify-end">
              <a className="font-semibold text-zinc-100 transition hover:text-[var(--color-accent)]" href={settings.phoneHref}>
                {settings.phone}
              </a>
              <a className="text-zinc-300 underline decoration-zinc-600 underline-offset-4 transition hover:text-zinc-100" href={settings.emailHref}>
                {settings.email}
              </a>
              <a
                className="text-zinc-300 underline decoration-zinc-600 underline-offset-4 transition hover:text-zinc-100"
                href={settings.mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                Otevřít provozovnu na mapě
              </a>
            </div>
          </div>

          <div className="mt-4 space-y-1 text-sm text-zinc-400">
            <p>{settings.companyName}, {settings.operatorAddressLine}</p>
            <p>
              {settings.operationAddressLine} <span className="text-zinc-500">·</span> IČZ: {settings.icz}
            </p>
          </div>
        </section>

        <div className="mt-6 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          <section>
            <h3 className="font-bold text-zinc-100">Služby</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {settings.footerServiceLinks.map((link) => (
                <li key={link.href}>
                  <Link className="transition hover:text-[var(--color-accent)]" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-zinc-100">Kontejnery</h3>
            <p className="mt-3 text-sm text-zinc-300">
              Nejdůležitější odkazy pro objednávku a ceník kontejnerů.
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {containerQuickLinks.map((link) => (
                <li key={link.href}>
                  <Link className="transition hover:text-[var(--color-accent)]" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-zinc-100">Informace</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {settings.footerInfoLinks.map((link) => (
                <li key={link.href}>
                  <Link className="transition hover:text-[var(--color-accent)]" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-zinc-100">Provozní doba</h3>
            <div className="mt-3 space-y-2 text-sm text-zinc-300">
              {settings.hours.map((hour) => (
                <p key={hour.label}>
                  <span className="text-zinc-400">{hour.label}:</span> {hour.value}
                </p>
              ))}
              <p className="pt-2 text-zinc-400">{settings.regionsLabel}</p>
            </div>
          </section>
        </div>
      </div>

      <div className="border-t border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {settings.companyName}. Všechna práva vyhrazena.
          </p>
          <p>{settings.regionsLabel}</p>
        </div>
      </div>
    </footer>
  );
}
