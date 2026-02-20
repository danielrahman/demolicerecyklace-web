import { defineField, defineType } from "sanity";

export const contactHour = defineType({
  name: "contactHour",
  title: "Provozní hodina",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Den / label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      title: "Čas",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "value",
    },
  },
});
