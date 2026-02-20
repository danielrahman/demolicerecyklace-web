import { z } from "zod";

import { validateDeliveryDateRequested } from "@/lib/delivery-date";
import { isSupportedPostalCode } from "@/lib/service-area";
import { TIME_WINDOW_VALUES } from "@/lib/time-windows";

const phoneRegex = /^(\+420|\+421|0)?\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$/;
const icoRegex = /^\d{8}$/;
const deliveryFlexibilityDaysSchema = z
  .union([z.literal(1), z.literal(2), z.literal(3), z.literal(7), z.literal(14)])
  .optional();

export const pricingPreviewSchema = z.object({
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "PSČ musí mít 5 číslic")
    .refine(isSupportedPostalCode, "PSČ zatím online nepodporujeme"),
  wasteType: z.string().trim().min(1, "Vyberte typ odpadu"),
  containerCount: z.number().int().min(1).max(3),
  rentalDays: z.number().int().min(1).max(14).default(1),
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
    wasteType: z.string().trim().min(1, "Vyberte typ odpadu"),
    containerSizeM3: z.literal(3),
    containerCount: z.number().int().min(1).max(3),
    rentalDays: z.number().int().min(1).max(14).default(1),
    deliveryDateRequested: z.string().min(1),
    deliveryFlexibilityDays: deliveryFlexibilityDaysSchema,
    timeWindowRequested: z.enum(TIME_WINDOW_VALUES),
    placementType: z.enum(["soukromy", "verejny"]),
    permitConfirmed: z.boolean(),
    extras: z.object({
      nakladkaOdNas: z.boolean(),
      expresniPristaveni: z.boolean(),
      opakovanyOdvoz: z.boolean(),
    }),
    note: z.string().optional(),
    callbackNote: z.string().trim().max(1000).optional(),
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
    const dateError = validateDeliveryDateRequested(value.deliveryDateRequested);
    if (dateError) {
      context.addIssue({
        code: "custom",
        message: dateError,
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

export const callbackRequestSchema = z.object({
  phone: z.string().regex(phoneRegex, "Zadejte platné telefonní číslo"),
  name: z.string().trim().min(2).max(120).optional(),
  email: z.email("Zadejte platný e-mail").optional(),
  preferredCallTime: z.string().trim().max(120).optional(),
  note: z.string().trim().max(1500).optional(),
  wizardSnapshot: z.record(z.string(), z.unknown()).optional(),
});
