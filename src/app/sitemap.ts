import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site-config";

type RouteConfig = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const ROUTES: RouteConfig[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/kontejnery", changeFrequency: "weekly", priority: 0.9 },
  { path: "/demolice", changeFrequency: "weekly", priority: 0.9 },
  { path: "/recyklace", changeFrequency: "weekly", priority: 0.9 },
  { path: "/cenik", changeFrequency: "weekly", priority: 0.9 },
  { path: "/prodej-materialu", changeFrequency: "weekly", priority: 0.8 },
  { path: "/lokality", changeFrequency: "weekly", priority: 0.8 },
  { path: "/lokality/praha", changeFrequency: "monthly", priority: 0.7 },
  { path: "/lokality/stredocesky-kraj", changeFrequency: "monthly", priority: 0.7 },
  { path: "/kontejnery/co-patri-nepatri", changeFrequency: "monthly", priority: 0.7 },
  { path: "/kontejnery/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/technika", changeFrequency: "monthly", priority: 0.7 },
  { path: "/realizace", changeFrequency: "monthly", priority: 0.7 },
  { path: "/kontakt", changeFrequency: "monthly", priority: 0.8 },
  { path: "/o-nas", changeFrequency: "monthly", priority: 0.6 },
  { path: "/dokumenty", changeFrequency: "monthly", priority: 0.5 },
  { path: "/dokumenty/icp", changeFrequency: "monthly", priority: 0.4 },
  { path: "/dokumenty/zpo", changeFrequency: "monthly", priority: 0.4 },
  { path: "/gdpr", changeFrequency: "yearly", priority: 0.3 },
  { path: "/obchodni-podminky", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
];

function getSiteUrl() {
  try {
    return new URL(SITE_URL).toString().replace(/\/+$/, "");
  } catch {
    return "https://www.demolicerecyklace.cz";
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
