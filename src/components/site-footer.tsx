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
  return (
    <footer className="mt-16 border-t border-zinc-800 bg-zinc-950/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <section>
          <h2 className="text-xl font-bold text-zinc-100">{SITE_META.brandName}</h2>
          <p className="mt-3 text-sm text-zinc-300">
            Online objednávka kontejneru {CONTAINER_PRODUCT.availableNow} pro oblast {SERVICE_AREA.regionsLabel}. Termín
            vždy potvrzuje operátor ručně.
          </p>
          <div className="mt-4 space-y-1 text-sm text-zinc-300">
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
          <h3 className="font-bold text-zinc-100">Kontakt</h3>
          <div className="mt-3 space-y-2 text-sm text-zinc-300">
            <p>
              <span className="text-zinc-400">Telefon:</span>{" "}
              <a className="transition hover:text-[var(--color-accent)]" href={CONTACT.phoneHref}>
                {CONTACT.phone}
              </a>
            </p>
            <p>
              <span className="text-zinc-400">E-mail:</span>{" "}
              <a className="transition hover:text-[var(--color-accent)]" href={CONTACT.emailHref}>
                {CONTACT.email}
              </a>
            </p>
            <p className="pt-2 text-zinc-400">Provozní doba</p>
            {CONTACT.hours.map((hour) => (
              <p key={hour.label}>
                {hour.label}: {hour.value}
              </p>
            ))}
          </div>
          <a className={cx(ui.buttonPrimary, "mt-4")} href={CONTACT.mapUrl} target="_blank" rel="noreferrer">
            Otevřít mapu
          </a>
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
          <Link href="/kontejnery/objednat" className={cx(ui.buttonPrimary, "mt-4")}> 
            Objednat kontejner
          </Link>
        </section>
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
