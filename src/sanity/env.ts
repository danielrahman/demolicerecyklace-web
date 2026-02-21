const defaultApiVersion = "2026-02-20";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || defaultApiVersion;

export const hasSanityConfig = Boolean(projectId);

export const sanityRevalidateSecret = process.env.SANITY_REVALIDATE_SECRET?.trim() ?? "";
export const sanityWriteToken = process.env.SANITY_API_WRITE_TOKEN?.trim() ?? "";
export const sanityReadToken = process.env.SANITY_API_READ_TOKEN?.trim() || sanityWriteToken;
