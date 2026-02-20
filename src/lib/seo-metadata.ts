import type { Metadata } from "next";

import { SITE_META, SITE_URL } from "@/lib/site-config";

const DEFAULT_OG_SUBTITLE = "Demolice, kontejnery, odvoz suti a recyklace | Praha + Středočeský kraj";

type PageMetadataInput = {
  title: string;
  description: string;
  canonicalPath: string;
  noindex?: boolean;
};

function getAbsoluteUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${normalizedPath}`;
}

function normalizeOgTitle(title: string) {
  return title.replace(/\s*\|\s*Demolice Recyklace$/i, "").trim();
}

export function createOgImageUrl(input: { title: string; subtitle?: string }) {
  const baseUrl = new URL(SITE_URL);
  const url = new URL("/api/og", baseUrl);
  url.searchParams.set("title", normalizeOgTitle(input.title));
  url.searchParams.set("subtitle", input.subtitle?.trim() || DEFAULT_OG_SUBTITLE);
  return url.toString();
}

export function createPageMetadata(input: PageMetadataInput): Metadata {
  const canonicalUrl = getAbsoluteUrl(input.canonicalPath);
  const ogImageUrl = createOgImageUrl({
    title: input.title,
    subtitle: input.description,
  });

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: input.canonicalPath,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonicalUrl,
      siteName: SITE_META.brandName,
      locale: "cs_CZ",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: normalizeOgTitle(input.title),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [ogImageUrl],
    },
    robots: input.noindex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}
