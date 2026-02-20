import type { Metadata } from "next";

import { getMarketingPageContent } from "@/lib/cms/getters";
import { createPageMetadata } from "@/lib/seo-metadata";
import { CONTACT, SERVICE_AREA, SITE_META } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const marketing = await getMarketingPageContent("obchodni-podminky");
  const title = marketing?.seoTitle || "Obchodní podmínky | Demolice Recyklace";
  const description =
    marketing?.seoDescription ||
    "Obchodní podmínky služby pronájmu a odvozu kontejneru 3m³ společnosti MINUTY a.s. pro Prahu a Středočeský kraj.";

  return createPageMetadata({
    title,
    description,
    canonicalPath: "/obchodni-podminky",
  });
}

export default async function ObchodniPodminkyPage() {
  const marketing = await getMarketingPageContent("obchodni-podminky");

  return (
    <div className="space-y-8 pb-8">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">{marketing?.heroTitle || "Obchodní podmínky"}</h1>
        <p className="max-w-4xl text-zinc-300">
          {marketing?.heroDescription ||
            `Tyto obchodní podmínky upravují pronájem a odvoz kontejneru 3m³ poskytovaný společností ${SITE_META.companyName} pro oblast ${SERVICE_AREA.regionsLabel}. Podmínky platí pro spotřebitele i podnikatele.`}
        </p>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">1. Úvodní ustanovení</h2>
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          <li>Poskytovatelem služby je {SITE_META.companyName}, sídlo {CONTACT.operatorAddressLine}.</li>
          <li>Služba zahrnuje přistavení, pronájem a odvoz kontejneru o objemu 3m³.</li>
          <li>Právní vztahy se řídí právem České republiky, zejména občanským zákoníkem.</li>
        </ul>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">2. Objednávka a uzavření smlouvy</h2>
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          <li>Objednávka se podává online formulářem na webu.</li>
          <li>
            Odeslaná objednávka je návrhem na uzavření smlouvy. Smlouva vzniká až po ručním potvrzení termínu a ceny
            operátorem (telefonicky nebo e-mailem).
          </li>
          <li>Poskytovatel může objednávku odmítnout, zejména při plné kapacitě nebo mimo obsluhovanou oblast.</li>
          <li>Zákazník odpovídá za pravdivost kontaktních a adresních údajů v objednávce.</li>
        </ul>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">3. Cena a platební podmínky</h2>
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          <li>Ceny uvedené na webu jsou orientační a vycházejí z informací uvedených v objednávce.</li>
          <li>
            Konečná cena se může změnit podle skutečného stavu při převzetí odpadu, zejména pokud:
            je odpad jiného druhu než objednaný, dojde ke smíchání kategorií odpadu, je překročen hmotnostní limit
            4 t, nebo je kontejner umístěn na veřejné komunikaci bez platného povolení.
          </li>
          <li>Účtovány mohou být také vícenáklady za čekání, marný výjezd nebo opakovaný příjezd.</li>
          <li>
            Běžné platební metody jsou převodem na účet na základě faktury, hotově při předání (po předchozí dohodě)
            nebo dle individuální dohody.
          </li>
          <li>Splatnost faktury je standardně 7 dní, pokud není sjednáno jinak.</li>
        </ul>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">4. Povinnosti zákazníka</h2>
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          <li>Uvést správnou adresu přistavení, dostupný kontakt a pravdivý typ odpadu.</li>
          <li>Nepřimíchávat jiné druhy odpadu, než byly objednány.</li>
          <li>Nepřekročit maximální hmotnost odpadu 4 t a nepřeplňovat kontejner nad horní hranu.</li>
          <li>Zajistit příjezdovou cestu a bezpečné místo pro složení a odvoz kontejneru.</li>
          <li>
            Pokud má být kontejner na veřejné komunikaci, zajistit platné povolení k záboru a nést odpovědnost za jeho
            případné absence.
          </li>
        </ul>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">5. Omezení odpovědnosti</h2>
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          <li>
            Poskytovatel neodpovídá za nemožnost nebo zpoždění služby způsobené okolnostmi mimo jeho kontrolu
            (například dopravní omezení, zásah úřadů, nepříznivé počasí, technická překážka na místě).
          </li>
          <li>
            Poskytovatel neodpovídá za škodu nebo vícenáklady vzniklé nesprávnými údaji zákazníka, nepřístupným místem,
            chybějícím povolením nebo porušením povinností dle těchto podmínek.
          </li>
        </ul>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">6. Storno podmínky</h2>
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          <li>Zrušení objednávky je bez poplatku do 16:00 posledního pracovního dne před sjednaným termínem.</li>
          <li>
            Při pozdějším zrušení může být účtován storno poplatek odpovídající vzniklým nákladům (zejména plánování,
            rezervace techniky a posádky).
          </li>
          <li>
            Pokud je vozidlo již na cestě nebo na místě a službu nelze provést z důvodů na straně zákazníka (např.
            chybná adresa, nepřístupné místo), může být účtován marný výjezd.
          </li>
        </ul>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">7. Reklamace</h2>
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          <li>
            Reklamaci služby je nutné uplatnit bez zbytečného odkladu, ideálně ihned po zjištění vady, nejpozději do 5
            pracovních dnů od poskytnutí služby.
          </li>
          <li>Reklamaci lze podat e-mailem na {CONTACT.email} nebo telefonicky na {CONTACT.phone}.</li>
          <li>V reklamaci uveďte číslo objednávky, popis problému a případně fotodokumentaci.</li>
          <li>Poskytovatel reklamaci posoudí a vyjádří se bez zbytečného odkladu.</li>
        </ul>
      </section>

      <section className="space-y-3 border-t border-zinc-800 pt-6">
        <h2 className="text-2xl font-bold">8. Závěrečná ustanovení</h2>
        <ul className="list-disc space-y-2 pl-5 text-zinc-300">
          <li>Tyto podmínky jsou účinné od 20. 2. 2026.</li>
          <li>Poskytovatel může podmínky přiměřeně měnit; aktuální verze je vždy zveřejněna na webu.</li>
          <li>Práva spotřebitelů vyplývající z obecně závazných právních předpisů tím nejsou dotčena.</li>
        </ul>
      </section>
    </div>
  );
}
