import type { Metadata } from "next";

import { CookieConsentSettings } from "@/components/cookie-consent-settings";

export const metadata: Metadata = {
  title: "Zásady používání cookies | Demolice Recyklace",
  description:
    "Přehled používání cookies na webu služby pronájmu kontejnerů, včetně Google Analytics a možností správy souhlasu.",
};

export default function CookiesPage() {
  return (
    <div className="space-y-8 pb-8">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">Zásady používání cookies</h1>
        <p className="max-w-4xl text-zinc-300">
          Tyto zásady vysvětlují, jak na našem webu používáme cookies při poskytování služeb pronájmu kontejnerů,
          demolice a recyklace.
        </p>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">1. Co jsou cookies</h2>
        <p className="text-zinc-300">
          Cookies jsou malé textové soubory, které web ukládá do vašeho zařízení. Pomáhají zajistit správné fungování
          webu a umožňují nám porozumět tomu, jak je web používán.
        </p>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">2. Jaké cookies používáme</h2>
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          <li>
            <strong>Nezbytné a funkční cookies</strong>: slouží k technickému provozu webu a základním funkcím.
          </li>
          <li>
            <strong>Analytické cookies</strong> (Google Analytics): používáme je pro měření návštěvnosti a zlepšování
            obsahu webu.
          </li>
        </ul>
        <p className="text-zinc-300">
          Na webu nepoužíváme pokročilou marketingovou automatizaci ani uživatelské účty.
        </p>
        <p className="text-zinc-300">
          <strong>Souhlas:</strong> Nezbytné cookies používáme, protože jsou nutné pro fungování webu. Pro použití
          analytických cookies je potřeba váš souhlas.
        </p>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">3. Doba uložení</h2>
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          <li>některé cookies jsou pouze relační a smažou se po zavření prohlížeče,</li>
          <li>jiné cookies jsou trvalejší a ukládají se po omezenou dobu podle jejich účelu,</li>
          <li>u analytických cookies se doba řídí aktuálním nastavením nástroje Google Analytics.</li>
        </ul>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">4. Jak můžete cookies odmítnout</h2>
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          <li>v cookie liště (pokud je zobrazena) můžete odmítnout analytické cookies,</li>
          <li>v prohlížeči můžete cookies blokovat nebo průběžně mazat,</li>
          <li>už uložené cookies můžete kdykoli odstranit ve svém prohlížeči.</li>
        </ul>
        <CookieConsentSettings />
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">5. Změny těchto zásad</h2>
        <p className="text-zinc-300">
          Tyto zásady můžeme průběžně aktualizovat podle změn právních požadavků nebo technického řešení webu.
          Aktuální verze je vždy zveřejněna na této stránce.
        </p>
        <p className="text-sm text-zinc-400">Poslední aktualizace: 20. 2. 2026</p>
      </section>
    </div>
  );
}
