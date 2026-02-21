import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Nastavení webu",
  type: "document",
  fields: [
    defineField({
      name: "brandName",
      title: "Název značky",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "companyName",
      title: "Název společnosti",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "metaTitle",
      title: "SEO titulek (globální)",
      type: "string",
      description: "Výchozí titulek pro layout, pokud stránka nemá vlastní metadata.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "metaDescription",
      title: "SEO popis (globální)",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "regionsLabel",
      title: "Obsluhovaná oblast (label)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Telefon",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "E-mail",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "operatorAddressLine",
      title: "Adresa provozovatele",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "operationAddressLine",
      title: "Adresa provozovny",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icz",
      title: "IČZ",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mapUrl",
      title: "URL mapy",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "hours",
      title: "Provozní doba",
      type: "array",
      of: [defineArrayMember({ type: "contactHour" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "headerLinks",
      title: "Odkazy v hlavičce",
      type: "array",
      of: [defineArrayMember({ type: "navLink" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "footerServiceLinks",
      title: "Footer: sekce Služby",
      type: "array",
      of: [defineArrayMember({ type: "navLink" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "footerInfoLinks",
      title: "Footer: sekce Informace",
      type: "array",
      of: [defineArrayMember({ type: "navLink" })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "brandName",
      subtitle: "companyName",
    },
    prepare(selection) {
      return {
        title: selection.title || "Nastavení webu",
        subtitle: selection.subtitle,
      };
    },
  },
});
