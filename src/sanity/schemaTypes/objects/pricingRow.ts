import { defineField, defineType } from "sanity";

export const pricingRow = defineType({
  name: "pricingRow",
  title: "Cenikova polozka",
  type: "object",
  fields: [
    defineField({
      name: "item",
      title: "Polozka",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "code",
      title: "Kod",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Cena",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "note",
      title: "Poznamka",
      type: "string",
    }),
    defineField({
      name: "tag",
      title: "Stitek",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Obrazek",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imageAlt",
      title: "Alt text obrazku",
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
      title: "item",
      subtitle: "price",
      media: "image",
    },
  },
});
