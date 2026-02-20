import { createClient } from "next-sanity";

import { apiVersion, dataset, hasSanityConfig, projectId } from "@/sanity/env";

const baseConfig = {
  projectId: projectId || "missing-project-id",
  dataset: dataset || "production",
  apiVersion,
};

export const sanityClient = hasSanityConfig
  ? createClient({
      ...baseConfig,
      useCdn: true,
      perspective: "published",
    })
  : null;

export const sanityWriteClient =
  hasSanityConfig && process.env.SANITY_API_WRITE_TOKEN?.trim()
    ? createClient({
        ...baseConfig,
        useCdn: false,
        token: process.env.SANITY_API_WRITE_TOKEN.trim(),
        perspective: "published",
      })
    : null;
