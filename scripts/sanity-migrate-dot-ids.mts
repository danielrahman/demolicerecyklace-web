import nextEnv from "@next/env";
import { createClient } from "next-sanity";

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
  perspective: "raw",
});

type AnyDocument = {
  _id: string;
  _type: string;
  _rev?: string;
  _createdAt?: string;
  _updatedAt?: string;
  [key: string]: unknown;
};

function mapLegacyId(id: string) {
  const isDraft = id.startsWith("drafts.");
  const baseId = isDraft ? id.slice("drafts.".length) : id;

  let mapped = baseId;

  if (baseId.startsWith("marketingPage.")) {
    mapped = baseId.replace("marketingPage.", "marketingPage-");
  } else if (baseId.startsWith("faqCategory.")) {
    mapped = baseId.replace("faqCategory.", "faqCategory-");
  }

  return isDraft ? `drafts.${mapped}` : mapped;
}

function toWritablePayload(doc: AnyDocument) {
  const { _id: _ignoredId, _rev: _ignoredRev, _createdAt: _ignoredCreatedAt, _updatedAt: _ignoredUpdatedAt, ...rest } = doc;
  return rest;
}

async function migrateDocument(doc: AnyDocument) {
  const oldId = doc._id;
  const newId = mapLegacyId(oldId);

  if (oldId === newId) {
    return { migrated: false, oldId, newId };
  }

  const payload = toWritablePayload(doc);
  const { _type, ...fields } = payload;
  const targetExists = await client.fetch<boolean>(`defined(*[_id == $id][0]._id)`, { id: newId });

  const tx = client.transaction();

  if (targetExists) {
    tx.patch(newId, {
      set: fields,
    });
  } else {
    tx.create({
      _id: newId,
      _type,
      ...fields,
    } as never);
  }

  tx.delete(oldId);

  await tx.commit({ autoGenerateArrayKeys: false });
  return { migrated: true, oldId, newId };
}

async function run() {
  const legacyDocs = await client.fetch<AnyDocument[]>(`
    *[
      _id match "marketingPage.*" ||
      _id match "faqCategory.*" ||
      _id match "drafts.marketingPage.*" ||
      _id match "drafts.faqCategory.*"
    ]
  `);

  if (!legacyDocs.length) {
    console.log("No legacy dot-ids found. Nothing to migrate.");
    return;
  }

  console.log(`Found ${legacyDocs.length} legacy documents to migrate.`);

  let migratedCount = 0;

  for (const doc of legacyDocs) {
    const result = await migrateDocument(doc);
    if (result.migrated) {
      migratedCount += 1;
      console.log(`Migrated ${result.oldId} -> ${result.newId}`);
    } else {
      console.log(`Skipped ${result.oldId}`);
    }
  }

  console.log(`Migration done. Migrated: ${migratedCount}/${legacyDocs.length}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
