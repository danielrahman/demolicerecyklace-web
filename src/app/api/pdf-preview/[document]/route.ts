import { readFile } from "node:fs/promises";
import path from "node:path";

import { PDFDocument } from "pdf-lib";

const documentMap = {
  icp: {
    fileName: "icp.pdf",
    title: "iČP",
    fileLabel: "ICP.pdf",
  },
  zpo: {
    fileName: "zpo.pdf",
    title: "ZPO - Základní popis odpadu",
    fileLabel: "ZPO.pdf",
  },
} as const;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getDocumentConfig(key: string) {
  const normalized = key.toLowerCase();
  return documentMap[normalized as keyof typeof documentMap] ?? null;
}

export async function GET(_: Request, context: { params: Promise<{ document: string }> }) {
  const { document } = await context.params;
  const config = getDocumentConfig(document);

  if (!config) {
    return new Response("Dokument nenalezen", { status: 404 });
  }

  const absolutePath = path.join(process.cwd(), "public", "documents", config.fileName);
  const inputBytes = await readFile(absolutePath);

  const pdf = await PDFDocument.load(inputBytes, {
    updateMetadata: false,
  });
  pdf.setTitle(config.title, { showInWindowTitleBar: true });

  const outputBytes = await pdf.save({
    useObjectStreams: false,
    updateFieldAppearances: false,
  });

  return new Response(Buffer.from(outputBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${config.fileLabel}"`,
      "Cache-Control": "no-store",
    },
  });
}
