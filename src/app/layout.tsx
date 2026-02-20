import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";

import { CookieConsentManager } from "@/components/cookie-consent-manager";
import { SiteFooter } from "@/components/site-footer";
import { SiteBreadcrumbs } from "@/components/site-breadcrumbs";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/cms/getters";
import { createOgImageUrl } from "@/lib/seo-metadata";
import { CONTACT, SERVICE_AREA, SITE_URL } from "@/lib/site-config";

import "./globals.css";

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600"],
});

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

function getMetadataBase() {
  try {
    return new URL(SITE_URL);
  } catch {
    return new URL("https://www.demolicerecyklace.cz");
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const metadataBase = getMetadataBase();
  const canonicalUrl = new URL("/", metadataBase).toString();
  const ogImageUrl = createOgImageUrl({
    title: settings.metaTitle,
    subtitle: settings.metaDescription,
  });

  return {
    metadataBase,
    title: settings.metaTitle,
    description: settings.metaDescription,
    openGraph: {
      title: settings.metaTitle,
      description: settings.metaDescription,
      url: canonicalUrl,
      siteName: settings.brandName,
      locale: "cs_CZ",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: settings.brandName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.metaTitle,
      description: settings.metaDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: settings.brandName,
    legalName: settings.companyName,
    url: SITE_URL,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.operationAddressLine,
      addressCountry: "CZ",
    },
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: SERVICE_AREA.regionsLabel,
      },
    ],
    openingHours: ["Mo-Fr 07:00-17:00", "Sa 08:00-14:00"],
  };

  return (
    <html lang="cs">
      <body className={bodyFont.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <CookieConsentManager gaMeasurementId={gaMeasurementId} />
        <SiteHeader settings={settings} />
        <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <SiteBreadcrumbs />
          {children}
        </main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
