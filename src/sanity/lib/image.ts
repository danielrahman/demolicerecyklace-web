import imageUrlBuilder from "@sanity/image-url";

import { sanityClient } from "@/sanity/lib/client";

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlForImage(source: unknown) {
  if (!builder || !source) {
    return null;
  }

  return builder.image(source);
}

export function resolveImageUrl(source: unknown) {
  const imageBuilder = urlForImage(source);
  return imageBuilder ? imageBuilder.url() : "";
}
