import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./src/sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "missing-project-id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const singletonTypes = new Set(["homePage", "containersPage", "pricingPage"]);

export default defineConfig({
  name: "default",
  title: "Demolice Recyklace CMS",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Obsah webu")
          .items([
            S.listItem()
              .title("Homepage")
              .id("homePage")
              .child(S.document().schemaType("homePage").documentId("homePage")),
            S.listItem()
              .title("Kontejnery")
              .id("containersPage")
              .child(S.document().schemaType("containersPage").documentId("containersPage")),
            S.listItem()
              .title("Cenik")
              .id("pricingPage")
              .child(S.document().schemaType("pricingPage").documentId("pricingPage")),
            S.divider(),
            ...S.documentTypeListItems().filter((listItem) => {
              const id = listItem.getId();
              return !id || !singletonTypes.has(id);
            }),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type !== "global") {
        return prev;
      }

      return prev.filter((templateItem) => !singletonTypes.has(templateItem.templateId));
    },
    actions: (prev, { schemaType }) => {
      if (!singletonTypes.has(schemaType)) {
        return prev;
      }

      return prev.filter((actionItem) => actionItem.action !== "duplicate" && actionItem.action !== "unpublish");
    },
  },
});
