"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  CONTACT,
  CONTAINER_PRODUCT,
  FOOTER_INFO_LINKS,
  FOOTER_SERVICE_LINKS,
  SERVICE_AREA,
  SITE_META,
} from "@/lib/site-config";
import { cx, ui } from "@/lib/ui";

export function SiteFooter() {
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
        <section className={cx(ui.card, "p-6")}>
          <div className="grid gap-6 xl:grid-cols-[1.3fr_auto] xl:items-start">
            <div>
              <h2 className="text-xl font-bold text-zinc-100">{SITE_META.brandName}</h2>
              <p className="mt-3 text-sm text-zinc-300">
                Online objednávka kontejneru {CONTAINER_PRODUCT.availableNow} pro oblast {SERVICE_AREA.regionsLabel}.
                Termín vždy potvrzuje operátor ručně.
              </p>
            </div>

            <div className="space-y-2 xl:text-right">
              <p className="text-sm text-zinc-400">Rychlý kontakt</p>
              <a className={cx(ui.buttonPrimary, "w-full xl:w-auto")} href={CONTACT.phoneHref}>
                Zavolat {CONTACT.phone}
              </a>
              <a className={cx(ui.buttonSecondary, "w-full xl:w-auto")} href={CONTACT.emailHref}>
                Napsat {CONTACT.email}
              </a>
              <a
                className={cx(ui.buttonSecondary, "w-full xl:w-auto")}
                href={CONTACT.mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                Otevřít mapu
              </a>
            </div>
          </div>

          <div className="mt-4 grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
            <p>
              <span className="text-zinc-400">Provozovatel:</span> {SITE_META.companyName}, {CONTACT.operatorAddressLine}
            </p>
            <p>
              <span className="text-zinc-400">Provozovna:</span> {CONTACT.operationAddressLine}
            </p>
            <p>
              <span className="text-zinc-400">IČZ:</span> {CONTACT.icz}
            </p>
          </div>
        </section>

        <div className="mt-6 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          <section>
            <h3 className="font-bold text-zinc-100">Služby</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {FOOTER_SERVICE_LINKS.map((link) => (
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
              {FOOTER_INFO_LINKS.map((link) => (
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
              {CONTACT.hours.map((hour) => (
                <p key={hour.label}>
                  <span className="text-zinc-400">{hour.label}:</span> {hour.value}
                </p>
              ))}
              <p className="pt-2 text-zinc-400">{SERVICE_AREA.regionsLabel}</p>
            </div>
          </section>
        </div>
      </div>

      <div className="border-t border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {SITE_META.companyName}. Všechna práva vyhrazena.
          </p>
          <p>{SERVICE_AREA.regionsLabel}</p>
        </div>
      </div>
    </footer>
  );
}
