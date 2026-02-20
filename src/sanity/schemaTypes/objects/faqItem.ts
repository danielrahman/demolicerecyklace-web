import { defineField, defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ polozka",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Otazka",
      type: "string",
      validation: (rule) => rule.required().min(5),
    }),
    defineField({
      name: "answer",
      title: "Odpoved",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(10),
    }),
  ],
});
