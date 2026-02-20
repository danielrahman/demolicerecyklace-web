import { z } from "zod";

import { isSupportedPostalCode } from "@/lib/service-area";

const phoneRegex = /^(\+420|\+421|0)?\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$/;
const icoRegex = /^\d{8}$/;

export const pricingPreviewSchema = z.object({
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "PSČ musí mít 5 číslic")
    .refine(isSupportedPostalCode, "PSČ zatím online nepodporujeme"),
  wasteType: z.enum(["sut-cista", "sut-smesna", "objemny", "zemina", "drevo"]),
  containerCount: z.number().int().min(1).max(3),
  extras: z.object({
    nakladkaOdNas: z.boolean(),
    expresniPristaveni: z.boolean(),
    opakovanyOdvoz: z.boolean(),
  }),
});

export const createOrderSchema = z
  .object({
    customerType: z.enum(["fo", "firma"]),
    name: z.string().trim().min(2),
    companyName: z.string().trim().optional(),
    ico: z.string().trim().optional(),
    dic: z.string().trim().optional(),
    email: z.email("Zadejte platný e-mail"),
    phone: z.string().regex(phoneRegex, "Zadejte platné telefonní číslo"),
    postalCode: z
      .string()
      .regex(/^\d{5}$/, "PSČ musí mít 5 číslic")
      .refine(isSupportedPostalCode, "PSČ zatím online nepodporujeme"),
    city: z.string().trim().min(2),
    street: z.string().trim().min(2),
    houseNumber: z.string().trim().min(1),
    wasteType: z.enum(["sut-cista", "sut-smesna", "objemny", "zemina", "drevo"]),
    containerSizeM3: z.literal(3),
    containerCount: z.number().int().min(1).max(3),
    deliveryDateRequested: z.string().min(1),
    timeWindowRequested: z.enum(["rano", "dopoledne", "odpoledne"]),
    placementType: z.enum(["soukromy", "verejny"]),
    permitConfirmed: z.boolean(),
    extras: z.object({
      nakladkaOdNas: z.boolean(),
      expresniPristaveni: z.boolean(),
      opakovanyOdvoz: z.boolean(),
    }),
    note: z.string().optional(),
    pinLocation: z
      .object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      })
      .optional(),
    gdprConsent: z.literal(true),
    marketingConsent: z.boolean().default(false),
  })
  .superRefine((value, context) => {
    const requestedDate = new Date(`${value.deliveryDateRequested}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(requestedDate.getTime())) {
      context.addIssue({
        code: "custom",
        message: "Zadejte platné datum přistavení",
        path: ["deliveryDateRequested"],
      });
    } else if (requestedDate < today) {
      context.addIssue({
        code: "custom",
        message: "Datum přistavení musí být dnes nebo později",
        path: ["deliveryDateRequested"],
      });
    }

    if (value.placementType === "verejny" && !value.permitConfirmed) {
      context.addIssue({
        code: "custom",
        message: "Pro veřejnou komunikaci potvrďte povolení k záboru",
        path: ["permitConfirmed"],
      });
    }

    if (value.customerType === "firma") {
      if (!value.companyName || value.companyName.trim().length < 2) {
        context.addIssue({
          code: "custom",
          message: "Doplňte název firmy",
          path: ["companyName"],
        });
      }

      const icoDigits = (value.ico ?? "").replace(/\D/g, "");
      if (!icoRegex.test(icoDigits)) {
        context.addIssue({
          code: "custom",
          message: "Doplňte platné IČO (8 číslic)",
          path: ["ico"],
        });
      }
    }
  });
