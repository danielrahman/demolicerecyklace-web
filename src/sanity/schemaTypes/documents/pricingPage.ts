import { defineArrayMember, defineField, defineType } from "sanity";

export const pricingPage = defineType({
  name: "pricingPage",
  title: "Stránka ceník",
  type: "document",
  fields: [
    defineField({ name: "introTitle", title: "Úvodní nadpis", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "introDescription",
      title: "Úvodní popis",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "sourcePdfUrl", title: "URL původního PDF", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "containerSectionTitle",
      title: "Nadpis sekce kontejnery",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "containerSectionDescription",
      title: "Popis sekce kontejnery",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "containerLimitNote", title: "Poznámka k limitu", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "containerPricing",
      title: "Ceník kontejnerů",
      type: "array",
      of: [defineArrayMember({ type: "pricingRow" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "inertMaterialsTitle", title: "Nadpis inertní materiály", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "inertMaterialsSubtitle", title: "Podnadpis inertní materiály", type: "string" }),
    defineField({
      name: "inertMaterialsPricing",
      title: "Ceník inertních materiálů",
      type: "array",
      of: [defineArrayMember({ type: "pricingRow" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "materialSalesTitle", title: "Nadpis prodej materiálu", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "materialSalesPricing",
      title: "Ceník prodeje materiálu",
      type: "array",
      of: [defineArrayMember({ type: "pricingRow" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "mobileRecyclingTitle", title: "Nadpis mobilní recyklace", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "mobileRecyclingPricing",
      title: "Ceník mobilní recyklace",
      type: "array",
      of: [defineArrayMember({ type: "pricingRow" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "machineSectionTitle", title: "Nadpis pronájem strojů", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "machineSectionSubtitle", title: "Podnadpis pronájem strojů", type: "text", rows: 3 }),
    defineField({
      name: "machinePricing",
      title: "Položky pronájmu strojů",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "machine", title: "Název stroje", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "specification", title: "Specifikace", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "price", title: "Cena", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "note", title: "Poznámka", type: "string" }),
            defineField({ name: "image", title: "Obrázek", type: "image", options: { hotspot: true } }),
            defineField({
              name: "imageAlt",
              title: "Alt text",
              type: "string",
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as { image?: unknown } | undefined;

                  if (parent?.image && !value) {
                    return "Alt text je povinný, pokud je vyplněný obrázek.";
                  }

                  return true;
                }),
            }),
          ],
          preview: {
            select: {
              title: "machine",
              subtitle: "price",
              media: "image",
            },
          },
        }),
      ],
    }),
    defineField({ name: "footerNote", title: "Poznámka pod ceníkem", type: "text", rows: 4, validation: (rule) => rule.required() }),
  ],
  preview: {
    prepare: () => ({
      title: "Cenik",
      subtitle: "Singleton dokument",
    }),
  },
});
