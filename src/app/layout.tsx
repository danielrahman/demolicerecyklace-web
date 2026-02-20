import type { Metadata } from "next";
import { Barlow_Condensed, IBM_Plex_Mono, Source_Sans_3 } from "next/font/google";

import { CookieConsentManager } from "@/components/cookie-consent-manager";
import { SiteFooter } from "@/components/site-footer";
import { SiteBreadcrumbs } from "@/components/site-breadcrumbs";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const headingFont = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700"],
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

export const metadata: Metadata = {
  title: "Demolice Recyklace - Kontejnery 3m³",
  description:
    "Demolice, recyklace a online objednávka kontejneru 3m³ pro Prahu a Středočeský kraj.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable} bg-[#0B0B0B] text-zinc-100`}>
        <CookieConsentManager gaMeasurementId={gaMeasurementId} />
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <SiteBreadcrumbs />
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
