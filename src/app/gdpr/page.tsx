import type { Metadata } from "next";

import { CONTACT, SITE_META } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Zásady zpracování osobních údajů | Demolice Recyklace",
  description:
    "Informace o zpracování osobních údajů při online objednávce kontejneru a souvisejících službách společnosti MINUTY a.s.",
};

export default function GdprPage() {
  return (
    <div className="space-y-8 pb-8">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">Zásady zpracování osobních údajů</h1>
        <p className="max-w-4xl text-zinc-300">
          Tyto zásady vysvětlují, jak společnost {SITE_META.companyName} zpracovává osobní údaje zákazníků při
          objednávce kontejnerů, demoličních prací a recyklace v oblasti Prahy a Středočeského kraje.
        </p>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">1. Kdo je správce osobních údajů</h2>
        <p className="text-zinc-300">
          Správcem osobních údajů je {SITE_META.companyName}, se sídlem {CONTACT.operatorAddressLine}. Provozujeme
          služby pronájmu kontejnerů (3m³), demolice a recyklace.
        </p>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">2. Jaké údaje zpracováváme</h2>
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          <li>jméno a příjmení,</li>
          <li>telefonní číslo,</li>
          <li>e-mail,</li>
          <li>adresa přistavení nebo realizace služby,</li>
          <li>u firemních zákazníků údaje o společnosti (IČO, případně DIČ).</li>
        </ul>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">3. Za jakým účelem údaje zpracováváme</h2>
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          <li>přijetí, zpracování a potvrzení objednávky,</li>
          <li>komunikace se zákazníkem k průběhu objednávky,</li>
          <li>plnění účetních a daňových povinností.</li>
        </ul>
        <p className="text-zinc-300">
          Objednávky potvrzuje vždy operátor ručně. Nepoužíváme zákaznické účty ani automatizované rozhodování.
        </p>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">4. Právní základ zpracování</h2>
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          <li>plnění smlouvy a kroky před uzavřením smlouvy (čl. 6 odst. 1 písm. b) GDPR),</li>
          <li>splnění právní povinnosti v oblasti účetnictví a daní (čl. 6 odst. 1 písm. c) GDPR),</li>
          <li>souhlas se zpracováním analytických cookies (čl. 6 odst. 1 písm. a) GDPR).</li>
        </ul>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">5. Doba uchování údajů</h2>
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          <li>údaje z objednávky a související komunikace uchováváme zpravidla 3 roky od dokončení služby,</li>
          <li>pokud objednávka nevznikne, údaje z poptávky uchováváme nejdéle 12 měsíců,</li>
          <li>účetní a daňové doklady uchováváme po dobu stanovenou právními předpisy (obvykle 10 let),</li>
          <li>údaje z analytiky uchováváme po dobu nastavení nástroje nebo do odvolání souhlasu.</li>
        </ul>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">6. Komu údaje předáváme</h2>
        <p className="text-zinc-300">Údaje předáváme pouze v nezbytném rozsahu těmto příjemcům:</p>
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          <li>poskytovatel e-mailové služby,</li>
          <li>účetní nebo daňový zpracovatel,</li>
          <li>IT a hostingový dodavatel webu,</li>
          <li>Google Analytics (společnost Google LLC),</li>
          <li>orgány veřejné moci, pokud to vyžaduje zákon.</li>
        </ul>
        <p className="text-zinc-300">
          Pokud dochází k předání údajů mimo EU/EHP, probíhá pouze při zajištění odpovídající ochrany podle GDPR.
        </p>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">7. Jaká jsou vaše práva</h2>
        <p className="text-zinc-300">Máte právo požadovat:</p>
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          <li>přístup ke svým osobním údajům,</li>
          <li>opravu nepřesných údajů,</li>
          <li>výmaz nebo omezení zpracování v případech stanovených GDPR,</li>
          <li>přenositelnost údajů,</li>
          <li>vznést námitku proti zpracování,</li>
          <li>odvolat souhlas, pokud je zpracování na souhlasu založeno.</li>
        </ul>
        <p className="text-zinc-300">
          Dále máte právo podat stížnost u Úřadu pro ochranu osobních údajů (www.uoou.cz).
        </p>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">8. Jak nás můžete kontaktovat</h2>
        <ul className="space-y-2 text-zinc-300">
          <li>
            E-mail:{" "}
            <a className="text-[var(--color-accent)] hover:underline" href={CONTACT.emailHref}>
              {CONTACT.email}
            </a>
          </li>
          <li>
            Telefon:{" "}
            <a className="text-[var(--color-accent)] hover:underline" href={CONTACT.phoneHref}>
              {CONTACT.phone}
            </a>
          </li>
          <li>Adresa: {CONTACT.operatorAddressLine}</li>
        </ul>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">9. Cookies a analytika</h2>
        <p className="text-zinc-300">
          Na webu používáme technické cookies nezbytné pro jeho fungování. Pro měření návštěvnosti používáme Google
          Analytics. Tyto analytické cookies používáme pouze na základě vašeho souhlasu. Souhlas můžete kdykoli změnit
          nebo odvolat v nastavení cookies.
        </p>
      </section>
    </div>
  );
}
