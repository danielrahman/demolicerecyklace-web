import { PdfDocumentPage } from "@/components/pdf-document-page";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
