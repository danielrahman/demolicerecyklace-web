import { createClient } from "next-sanity";

import { apiVersion, dataset, hasSanityConfig, projectId, sanityReadToken, sanityWriteToken } from "@/sanity/env";

const baseConfig = {
  projectId: projectId || "missing-project-id",
  dataset: dataset || "production",
  apiVersion,
};

export const sanityClient = hasSanityConfig
  ? createClient({
      ...baseConfig,
      useCdn: !sanityReadToken,
      ...(sanityReadToken ? { token: sanityReadToken } : {}),
      perspective: "published",
    })
  : null;

export const sanityWriteClient =
  hasSanityConfig && sanityWriteToken
    ? createClient({
        ...baseConfig,
        useCdn: false,
        token: sanityWriteToken,
        perspective: "published",
      })
    : null;
