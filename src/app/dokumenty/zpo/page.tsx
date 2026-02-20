import type { Metadata } from "next";

import { PdfDocumentPage } from "@/components/pdf-document-page";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "ZPO | Demolice Recyklace",
  description: "Náhled dokumentu ZPO včetně možnosti stažení originálního PDF.",
  alternates: {
    canonical: "/dokumenty/zpo",
  },
};

export default function ZPOPage() {
  return (
    <PdfDocumentPage
      title="ZPO - Základní popis odpadu"
      description="Náhled originálního PDF dokumentu ZPO."
      pdfPath="/documents/zpo.pdf"
      viewerPath="/api/pdf-preview/zpo"
      downloadName="ZPO.pdf"
    />
  );
}
