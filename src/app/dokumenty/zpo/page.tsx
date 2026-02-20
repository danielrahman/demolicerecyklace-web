import { ui } from "@/lib/ui";

export default function ZPOPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">ZPO - Základní popis odpadu</h1>
      <p className="max-w-3xl text-zinc-300">
        Dokument je dostupný ke stažení v PDF. Otevře se v novém panelu, odkud ho lze uložit.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="/documents/zpo.pdf"
          target="_blank"
          rel="noreferrer"
          className={ui.buttonPrimary}
        >
          Otevřít PDF v novém panelu
        </a>
        <a
          href="/documents/zpo.pdf"
          download="ZPO.pdf"
          className={ui.buttonSecondary}
        >
          Stáhnout PDF
        </a>
      </div>
    </div>
  );
}
