import type { Metadata } from "next";

import { PdfDocumentPage } from "@/components/pdf-document-page";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "iČP | Demolice Recyklace",
  description: "Náhled dokumentu iČP včetně možnosti stažení originálního PDF.",
  alternates: {
    canonical: "/dokumenty/icp",
  },
};

export default function ICPPage() {
  return (
    <PdfDocumentPage
      title="iČP"
      description="Náhled originálního PDF dokumentu iČP."
      pdfPath="/documents/icp.pdf"
      viewerPath="/api/pdf-preview/icp"
      downloadName="ICP.pdf"
    />
  );
}
