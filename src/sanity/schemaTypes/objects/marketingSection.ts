import { defineArrayMember, defineField, defineType } from "sanity";

export const marketingSection = defineType({
  name: "marketingSection",
  title: "Marketing sekce",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Nadpis",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Popis",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "items",
      title: "Body",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: {
    select: {
      title: "heading",
    },
  },
});
