import { defineArrayMember, defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Úvodní stránka",
  type: "document",
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Předtitulek (malý nadpis)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroTitle",
      title: "Hlavní titulek",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroDescription",
      title: "Hlavní popis",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "quickFacts",
      title: "Rychlé body",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "serviceCards",
      title: "Karty služeb",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Nadpis", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "subtitle", title: "Podnadpis", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "description",
              title: "Popis",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "points",
              title: "Body",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) => rule.required().min(1),
            }),
            defineField({ name: "href", title: "Cílová URL", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "cta", title: "Text tlačítka", type: "string", validation: (rule) => rule.required() }),
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
              title: "title",
              subtitle: "subtitle",
              media: "image",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "processSteps",
      title: "Kroky spolupráce",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Nadpis", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3, validation: (rule) => rule.required() }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "text",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "trustSignals",
      title: "Důvody, proč si vybrat",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Úvodní stránka",
      subtitle: "Singleton dokument",
    }),
  },
});
