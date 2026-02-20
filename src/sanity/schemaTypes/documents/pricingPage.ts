import { defineArrayMember, defineField, defineType } from "sanity";

export const pricingPage = defineType({
  name: "pricingPage",
  title: "Cenik stranka",
  type: "document",
  fields: [
    defineField({ name: "introTitle", title: "Uvodni nadpis", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "introDescription",
      title: "Uvodni popis",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "sourcePdfUrl", title: "URL puvodniho PDF", type: "string", validation: (rule) => rule.required() }),
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
    defineField({ name: "containerLimitNote", title: "Poznamka k limitu", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "containerPricing",
      title: "Cenik kontejneru",
      type: "array",
      of: [defineArrayMember({ type: "pricingRow" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "inertMaterialsTitle", title: "Nadpis inertni materialy", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "inertMaterialsSubtitle", title: "Podnadpis inertni materialy", type: "string" }),
    defineField({
      name: "inertMaterialsPricing",
      title: "Cenik inertnich materialu",
      type: "array",
      of: [defineArrayMember({ type: "pricingRow" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "materialSalesTitle", title: "Nadpis prodej materialu", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "materialSalesPricing",
      title: "Cenik prodeje materialu",
      type: "array",
      of: [defineArrayMember({ type: "pricingRow" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "mobileRecyclingTitle", title: "Nadpis mobilni recyklace", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "mobileRecyclingPricing",
      title: "Cenik mobilni recyklace",
      type: "array",
      of: [defineArrayMember({ type: "pricingRow" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "machineSectionTitle", title: "Nadpis pronajem stroju", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "machineSectionSubtitle", title: "Podnadpis pronajem stroju", type: "text", rows: 3 }),
    defineField({
      name: "machinePricing",
      title: "Polozky pronajmu stroju",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "machine", title: "Nazev stroje", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "specification", title: "Specifikace", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "price", title: "Cena", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "note", title: "Poznamka", type: "string" }),
            defineField({ name: "image", title: "Obrazek", type: "image", options: { hotspot: true } }),
            defineField({
              name: "imageAlt",
              title: "Alt text",
              type: "string",
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as { image?: unknown } | undefined;

                  if (parent?.image && !value) {
                    return "Alt text je povinny, pokud je vyplneny obrazek.";
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
    defineField({ name: "footerNote", title: "Poznamka pod cenikem", type: "text", rows: 4, validation: (rule) => rule.required() }),
  ],
  preview: {
    prepare: () => ({
      title: "Cenik",
      subtitle: "Singleton dokument",
    }),
  },
});
