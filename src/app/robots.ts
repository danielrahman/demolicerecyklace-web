import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site-config";

function getSiteUrl() {
  try {
    return new URL(SITE_URL).toString().replace(/\/+$/, "");
  } catch {
    return "https://www.demolicerecyklace.cz";
  }
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/studio/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

