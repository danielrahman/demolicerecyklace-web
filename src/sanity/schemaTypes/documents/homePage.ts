import { defineArrayMember, defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Hero nadpis (maly)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroTitle",
      title: "Hero titulek",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroDescription",
      title: "Hero popis",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "quickFacts",
      title: "Rychle body",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "serviceCards",
      title: "Karty sluzeb",
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
            defineField({ name: "href", title: "Cilove URL", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "cta", title: "Text tlacitka", type: "string", validation: (rule) => rule.required() }),
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
      title: "Kroky spoluprace",
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
      title: "Duvody proc vybrat",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Homepage",
      subtitle: "Singleton dokument",
    }),
  },
});
