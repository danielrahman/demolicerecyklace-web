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
