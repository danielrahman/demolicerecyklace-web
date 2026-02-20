import { stat } from "node:fs/promises";
import path from "node:path";

import { ui } from "@/lib/ui";

type PdfDocumentPageProps = {
  title: string;
  description: string;
  pdfPath: string;
  viewerPath?: string;
  downloadName: string;
};

export async function PdfDocumentPage({
  title,
  description,
  pdfPath,
  viewerPath,
  downloadName,
}: PdfDocumentPageProps) {
  const normalizedPath = pdfPath.replace(/^\/+/, "");
  const absolutePath = path.join(process.cwd(), "public", normalizedPath);
  let versionParam = "";

  try {
    const fileStats = await stat(absolutePath);
    versionParam = `?v=${Math.floor(fileStats.mtimeMs)}`;
  } catch {
    versionParam = "";
  }

  const pdfWithVersion = `${pdfPath}${versionParam}`;
  const viewerBasePath = viewerPath ?? pdfPath;
  const viewerWithVersion = `${viewerBasePath}${versionParam}`;
  const previewSource = `${viewerWithVersion}#view=FitH`;

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="max-w-4xl text-zinc-300">{description}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
          <a href={pdfWithVersion} download={downloadName} className={ui.buttonPrimary}>
            Stáhnout PDF
          </a>
        </div>
      </header>

      <section className={`${ui.cardSoft} p-2 sm:p-3`}>
        <object
          data={previewSource}
          type="application/pdf"
          className="h-[72vh] min-h-[640px] w-full rounded-xl border border-zinc-800 bg-zinc-950"
        >
          <iframe
            src={previewSource}
            title={`${title} PDF`}
            className="h-[72vh] min-h-[640px] w-full rounded-xl border border-zinc-800 bg-zinc-950"
          />
        </object>
      </section>
    </div>
  );
}
