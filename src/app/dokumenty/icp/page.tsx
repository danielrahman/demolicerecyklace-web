import { PdfDocumentPage } from "@/components/pdf-document-page";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
