import type { Metadata } from "next";

import { PdfDocumentPage } from "@/components/pdf-document-page";
import { createPageMetadata } from "@/lib/seo-metadata";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata: Metadata = createPageMetadata({
  title: "iČP | Demolice Recyklace",
  description: "Náhled dokumentu iČP včetně možnosti stažení původního PDF.",
  canonicalPath: "/dokumenty/icp",
});

export default function ICPPage() {
  return (
    <PdfDocumentPage
      title="iČP"
      description="Náhled původního PDF dokumentu iČP."
      pdfPath="/documents/icp.pdf"
      viewerPath="/api/pdf-preview/icp"
      downloadName="ICP.pdf"
    />
  );
}
