import { defineArrayMember, defineField, defineType } from "sanity";

export const containersPage = defineType({
  name: "containersPage",
  title: "Kontejnery stranka",
  type: "document",
  fields: [
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
      name: "heroImage",
      title: "Hero obrazek",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroImageAlt",
      title: "Hero alt text",
      type: "string",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { heroImage?: unknown } | undefined;

          if (parent?.heroImage && !value) {
            return "Alt text je povinny, pokud je vyplneny obrazek.";
          }

          return true;
        }),
    }),
    defineField({
      name: "howItWorks",
      title: "Jak funguje objednavka",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Nadpis", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "description",
              title: "Popis",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "trustPoints",
      title: "Body duvery",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "ruleWarnings",
      title: "Upozorneni",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Kontejnery",
      subtitle: "Singleton dokument",
    }),
  },
});
