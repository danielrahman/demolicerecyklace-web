"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import type { SiteSettingsContent } from "@/lib/cms/mappers";
import { cx, ui } from "@/lib/ui";

type SiteHeaderProps = {
  settings: Pick<SiteSettingsContent, "headerLinks">;
};

export function SiteHeader({ settings }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isCheckoutRoute = pathname?.startsWith("/kontejnery/objednat");

  if (isCheckoutRoute) {
    return (
      <header className="sticky top-0 z-40 border-b border-zinc-800/90 bg-[var(--color-header-bg)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0">
            <Image
              src="/brand/logo-original.png"
              alt="Demolice Recyklace logo"
              width={215}
              height={58}
              priority
              className="h-10 w-auto"
            />
          </Link>
          <Link href="/" className={cx(ui.buttonSecondary, "px-4 text-sm")}>
            Domů
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/90 bg-[var(--color-header-bg)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Image
            src="/brand/logo-original.png"
            alt="Demolice Recyklace logo"
            width={215}
            height={58}
            priority
            className="h-11 w-auto"
          />
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 lg:flex">
            {settings.headerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cx(
                  "rounded-full px-3 py-2 text-sm font-semibold transition",
                  pathname === link.href ? "bg-zinc-800 text-zinc-100" : "text-zinc-200 hover:bg-zinc-800",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/kontejnery/objednat" className={cx(ui.buttonPrimary, "hidden lg:inline-flex px-4 text-sm")}>
            Objednat kontejner
          </Link>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 text-zinc-100 transition hover:bg-zinc-800 lg:hidden"
          >
            <span className="sr-only">Otevřít menu</span>
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div id="mobile-nav" className="border-t border-zinc-800 bg-zinc-950 lg:hidden">
          <div className="mx-auto grid max-w-6xl gap-1 px-4 py-3 sm:px-6">
            {settings.headerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cx(
                  "rounded-xl px-3 py-2 text-sm font-semibold",
                  pathname === link.href ? "bg-zinc-800 text-zinc-100" : "text-zinc-200 hover:bg-zinc-800",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/kontejnery/objednat"
              onClick={() => setMenuOpen(false)}
              className={cx(ui.buttonPrimary, "mt-2 w-full")}
            >
              Objednat kontejner
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
