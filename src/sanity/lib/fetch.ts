import type { QueryParams } from "@sanity/client";

import { sanityClient } from "@/sanity/lib/client";

type SanityFetchOptions = {
  query: string;
  params?: QueryParams;
  tags?: string[];
};

export async function sanityFetch<TResult>({
  query,
  params = {},
  tags = [],
}: SanityFetchOptions): Promise<TResult | null> {
  if (!sanityClient) {
    return null;
  }

  const nextTags = Array.from(new Set(["sanity", ...tags]));

  return sanityClient.fetch<TResult>(query, params, {
    cache: "force-cache",
    next: {
      revalidate: false,
      tags: nextTags,
    },
  });
}
