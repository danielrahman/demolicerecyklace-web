"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

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

type CheckoutLegalDoc = "terms" | "gdpr" | "cookies";

const CHECKOUT_LEGAL_DOCS: Record<CheckoutLegalDoc, { href: string; title: string }> = {
  terms: { href: "/obchodni-podminky", title: "Obchodní podmínky" },
  gdpr: { href: "/gdpr", title: "Ochrana osobních údajů" },
  cookies: { href: "/cookies", title: "Cookies" },
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const pathname = usePathname();
  const isCheckoutRoute = pathname?.startsWith("/kontejnery/objednat");
  const [legalModalDoc, setLegalModalDoc] = useState<CheckoutLegalDoc | null>(null);

  useEffect(() => {
    if (!legalModalDoc) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLegalModalDoc(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [legalModalDoc]);

  if (isCheckoutRoute) {
    const activeLegalDoc = legalModalDoc ? CHECKOUT_LEGAL_DOCS[legalModalDoc] : null;

    return (
      <>
        <footer className="mt-8 border-t border-zinc-800">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-3 px-4 py-4 text-xs text-zinc-400 sm:px-6 lg:px-8">
            <button
              type="button"
              className="underline decoration-zinc-500 underline-offset-2 hover:text-zinc-200"
              onClick={() => setLegalModalDoc("terms")}
            >
              Obchodní podmínky
            </button>
            <span className="text-zinc-600">|</span>
            <button
              type="button"
              className="underline decoration-zinc-500 underline-offset-2 hover:text-zinc-200"
              onClick={() => setLegalModalDoc("gdpr")}
            >
              Ochrana osobních údajů
            </button>
            <span className="text-zinc-600">|</span>
            <button
              type="button"
              className="underline decoration-zinc-500 underline-offset-2 hover:text-zinc-200"
              onClick={() => setLegalModalDoc("cookies")}
            >
              Cookies
            </button>
          </div>
        </footer>

        {activeLegalDoc ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4"
            role="presentation"
            onClick={() => setLegalModalDoc(null)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="checkout-legal-modal-title"
              className="flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
                <h2 id="checkout-legal-modal-title" className="font-heading text-base font-bold text-zinc-100 sm:text-lg">
                  {activeLegalDoc.title}
                </h2>
                <div className="flex items-center gap-2">
                  <a
                    href={activeLegalDoc.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 hover:border-zinc-500 sm:text-sm"
                  >
                    Otevřít v nové kartě
                  </a>
                  <button
                    type="button"
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 hover:border-zinc-500 sm:text-sm"
                    onClick={() => setLegalModalDoc(null)}
                  >
                    Zavřít
                  </button>
                </div>
              </div>

              <iframe
                title={activeLegalDoc.title}
                src={activeLegalDoc.href}
                className="h-full w-full border-0 bg-zinc-950"
              />
            </section>
          </div>
        ) : null}
      </>
    );
  }

  const containerQuickLinks = [
    { href: "/kontejnery", label: "Vše o kontejnerech" },
    { href: "/kontejnery/objednat", label: "Objednat kontejner" },
    { href: "/cenik#kontejnery", label: "Ceník kontejnerů" },
  ] as const;
  const infoLinks = settings.footerInfoLinks.filter((link) => link.href !== "/lokality");

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
                Objednávka kontejneru {CONTAINER_PRODUCT.availableNow} přes web pro oblast {settings.regionsLabel}. Termín potvrzuje operátor.
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
              {infoLinks.map((link) => (
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
