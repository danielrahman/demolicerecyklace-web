import fs from "node:fs";
import path from "node:path";

import nextEnv from "@next/env";
import { createClient } from "next-sanity";

type PricingImageRow = {
  _key?: string;
  item?: string;
  machine?: string;
  image?: unknown;
  imageAlt?: string;
  [key: string]: unknown;
};

type PricingDocument = {
  containerPricing?: PricingImageRow[];
  inertMaterialsPricing?: PricingImageRow[];
  materialSalesPricing?: PricingImageRow[];
  mobileRecyclingPricing?: PricingImageRow[];
  machinePricing?: PricingImageRow[];
};

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2026-02-20";
const writeToken = process.env.SANITY_API_WRITE_TOKEN?.trim();

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
}

if (!writeToken) {
  throw new Error("Missing SANITY_API_WRITE_TOKEN");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: writeToken,
  perspective: "published",
});

const uploadedAssetCache = new Map<string, string>();

async function uploadFromLocalPath(rawPath: string) {
  const relativePath = rawPath.replace(/^\//, "");
  const localPath = path.join(process.cwd(), "public", relativePath);

  if (!fs.existsSync(localPath)) {
    return null;
  }

  const cached = uploadedAssetCache.get(localPath);
  if (cached) {
    return cached;
  }

  const filename = path.basename(localPath);
  const stream = fs.createReadStream(localPath);
  const asset = await client.assets.upload("image", stream, { filename });
  uploadedAssetCache.set(localPath, asset._id);
  return asset._id;
}

function isSanityImage(value: unknown): value is { _type: "image"; asset?: { _type: "reference"; _ref: string } } {
  return Boolean(
    value &&
      typeof value === "object" &&
      "_type" in value &&
      (value as { _type?: string })._type === "image" &&
      "asset" in value,
  );
}

async function normalizeRows(rows: PricingImageRow[] | undefined, labelField: "item" | "machine") {
  if (!rows?.length) {
    return { rows, changed: false };
  }

  let changed = false;

  const nextRows = await Promise.all(
    rows.map(async (row) => {
      const nextRow: PricingImageRow = { ...row };
      const rowImage = nextRow.image;

      if (typeof rowImage === "string" && rowImage.trim()) {
        const uploadedRef = await uploadFromLocalPath(rowImage.trim());

        if (uploadedRef) {
          nextRow.image = {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: uploadedRef,
            },
          };

          if (!nextRow.imageAlt?.trim()) {
            const fallbackAlt = String(nextRow[labelField] || "").trim();
            if (fallbackAlt) {
              nextRow.imageAlt = fallbackAlt;
            }
          }
        } else {
          delete nextRow.image;
        }

        changed = true;
        return nextRow;
      }

      if (rowImage == null || isSanityImage(rowImage)) {
        return nextRow;
      }

      delete nextRow.image;
      changed = true;
      return nextRow;
    }),
  );

  return { rows: nextRows, changed };
}

async function run() {
  const pricingPage = await client.fetch<PricingDocument | null>(
    `*[_type == "pricingPage" && _id == "pricingPage"][0]{
      containerPricing,
      inertMaterialsPricing,
      materialSalesPricing,
      mobileRecyclingPricing,
      machinePricing
    }`,
  );

  if (!pricingPage) {
    throw new Error("pricingPage document not found");
  }

  const containerPricing = await normalizeRows(pricingPage.containerPricing, "item");
  const inertMaterialsPricing = await normalizeRows(pricingPage.inertMaterialsPricing, "item");
  const materialSalesPricing = await normalizeRows(pricingPage.materialSalesPricing, "item");
  const mobileRecyclingPricing = await normalizeRows(pricingPage.mobileRecyclingPricing, "item");
  const machinePricing = await normalizeRows(pricingPage.machinePricing, "machine");

  const hasChanges =
    containerPricing.changed ||
    inertMaterialsPricing.changed ||
    materialSalesPricing.changed ||
    mobileRecyclingPricing.changed ||
    machinePricing.changed;

  if (!hasChanges) {
    console.log("No invalid pricing image values found.");
    return;
  }

  await client
    .patch("pricingPage")
    .set({
      containerPricing: containerPricing.rows,
      inertMaterialsPricing: inertMaterialsPricing.rows,
      materialSalesPricing: materialSalesPricing.rows,
      mobileRecyclingPricing: mobileRecyclingPricing.rows,
      machinePricing: machinePricing.rows,
    })
    .commit({ autoGenerateArrayKeys: false });

  console.log("Pricing images fixed.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
