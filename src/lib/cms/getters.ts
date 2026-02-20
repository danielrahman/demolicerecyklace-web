import { hasSanityConfig } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  CONTAINERS_PAGE_QUERY,
  FAQ_CATEGORIES_QUERY,
  HOME_PAGE_QUERY,
  PRICING_PAGE_QUERY,
} from "@/sanity/lib/queries";
import {
  fallbackContainersPageContent,
  fallbackFaqContent,
  fallbackHomePageContent,
  fallbackPricingPageContent,
  mapContainersPageContent,
  mapFaqContent,
  mapHomePageContent,
  mapPricingPageContent,
  type CmsContainersPage,
  type CmsFaqCategory,
  type CmsHomePage,
  type CmsPricingPage,
} from "@/lib/cms/mappers";

export async function getHomePageContent() {
  if (!hasSanityConfig) {
    return fallbackHomePageContent;
  }

  try {
    const data = await sanityFetch<CmsHomePage>({
      query: HOME_PAGE_QUERY,
      tags: ["homePage"],
    });

    return mapHomePageContent(data);
  } catch (error) {
    console.error("Failed to load homePage from Sanity", error);
    return fallbackHomePageContent;
  }
}

export async function getContainersPageContent() {
  if (!hasSanityConfig) {
    return fallbackContainersPageContent;
  }

  try {
    const data = await sanityFetch<CmsContainersPage>({
      query: CONTAINERS_PAGE_QUERY,
      tags: ["containersPage"],
    });

    return mapContainersPageContent(data);
  } catch (error) {
    console.error("Failed to load containersPage from Sanity", error);
    return fallbackContainersPageContent;
  }
}

export async function getPricingPageContent() {
  if (!hasSanityConfig) {
    return fallbackPricingPageContent;
  }

  try {
    const data = await sanityFetch<CmsPricingPage>({
      query: PRICING_PAGE_QUERY,
      tags: ["pricingPage"],
    });

    return mapPricingPageContent(data);
  } catch (error) {
    console.error("Failed to load pricingPage from Sanity", error);
    return fallbackPricingPageContent;
  }
}

export async function getFaqContent() {
  if (!hasSanityConfig) {
    return fallbackFaqContent;
  }

  try {
    const data = await sanityFetch<CmsFaqCategory[]>({
      query: FAQ_CATEGORIES_QUERY,
      tags: ["faqCategory"],
    });

    return mapFaqContent(data);
  } catch (error) {
    console.error("Failed to load faqCategory documents from Sanity", error);
    return fallbackFaqContent;
  }
}
