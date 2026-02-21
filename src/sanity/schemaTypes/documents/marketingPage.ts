import { defineArrayMember, defineField, defineType } from "sanity";

export const marketingPage = defineType({
  name: "marketingPage",
  title: "Marketing stránka",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Interní název",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Předtitulek",
      type: "string",
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
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hlavní obrázek",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroImageAlt",
      title: "Alt text hlavního obrázku",
      type: "string",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { heroImage?: unknown } | undefined;

          if (parent?.heroImage && !value) {
            return "Alt text je povinný, pokud je vyplněný obrázek.";
          }

          return true;
        }),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO titulek",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO popis",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "sections",
      title: "Obsahové sekce",
      type: "array",
      of: [defineArrayMember({ type: "marketingSection" })],
    }),
    defineField({
      name: "referenceProjectsTitle",
      title: "Nadpis sekce realizací",
      type: "string",
    }),
    defineField({
      name: "referenceProjects",
      title: "Reference realizací",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Název realizace", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "service",
              title: "Typ služby",
              type: "string",
              options: {
                list: ["Demolice", "Recyklace", "Kontejnery"],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "location", title: "Lokalita", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "description",
              title: "Popis",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "output",
              title: "Výsledek",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "image", title: "Obrázek", type: "image", options: { hotspot: true } }),
            defineField({
              name: "imageAlt",
              title: "Alt text obrázku",
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
              subtitle: "service",
              media: "image",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "processTitle",
      title: "Nadpis sekce postupu",
      type: "string",
    }),
    defineField({
      name: "processSteps",
      title: "Kroky realizace",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
    },
    prepare(selection) {
      return {
        title: selection.title || "Marketing stránka",
        subtitle: selection.slug ? `/${selection.slug}` : "bez slugu",
      };
    },
  },
});
