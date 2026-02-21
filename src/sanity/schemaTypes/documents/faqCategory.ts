import { defineArrayMember, defineField, defineType } from "sanity";

export const faqCategory = defineType({
  name: "faqCategory",
  title: "FAQ kategorie",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Interní klíč",
      type: "string",
      options: {
        list: [
          { title: "Kontejnery", value: "containers" },
          { title: "Demolice", value: "demolition" },
          { title: "Recyklace", value: "recycling" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "title", title: "Nadpis", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Popis", type: "text", rows: 3 }),
    defineField({ name: "order", title: "Pořadí", type: "number", validation: (rule) => rule.required() }),
    defineField({
      name: "items",
      title: "Položky",
      type: "array",
      of: [defineArrayMember({ type: "faqItem" })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "key",
    },
  },
});
