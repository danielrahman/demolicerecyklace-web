import { defineField, defineType } from "sanity";

export const navLink = defineType({
  name: "navLink",
  title: "Navigační odkaz",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Href",
      type: "string",
      description: "Interní cesty ve tvaru /kontakt, /cenik atd.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "href",
    },
  },
});
