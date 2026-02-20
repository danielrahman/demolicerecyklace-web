import type { TimeWindowValue } from "@/lib/time-windows";

export type OrderStatus = "new" | "confirmed" | "done" | "cancelled";

export type AdminRole = "admin" | "operator";

export type OrderEventType =
  | "created"
  | "emailed_customer_received"
  | "emailed_internal_new"
  | "status_confirmed"
  | "status_rescheduled"
  | "status_done"
  | "location_updated"
  | "status_cancelled"
  | "price_estimate_updated"
  | "internal_note_updated"
  | "rate_limited_rejected"
  | "honeypot_rejected";

export type TimeWindow = TimeWindowValue;

export type PlacementType = "soukromy" | "verejny";

export type CustomerType = "fo" | "firma";

export type WasteTypeId = string;

export type PriceEstimate = {
  rentalDays: number;
  base: number;
  transport: number;
  surcharge: number;
  total: number;
  currency: "CZK";
};

export type ContainerOrder = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customerType: CustomerType;
  name: string;
  companyName?: string;
  ico?: string;
  dic?: string;
  email: string;
  phone: string;
  postalCode: string;
  city: string;
  street: string;
  houseNumber: string;
  pinLocation?: {
    lat: number;
    lng: number;
  };
  wasteType: WasteTypeId;
  containerSizeM3: 3;
  containerCount: number;
  rentalDays: number;
  deliveryDateRequested: string;
  deliveryDateEndRequested?: string;
  deliveryFlexibilityDays?: 1 | 2 | 3;
  timeWindowRequested: TimeWindow;
  deliveryDateConfirmed?: string;
  timeWindowConfirmed?: TimeWindow;
  placementType: PlacementType;
  permitConfirmed: boolean;
  extras: {
    nakladkaOdNas: boolean;
    expresniPristaveni: boolean;
    opakovanyOdvoz: boolean;
  };
  priceEstimate: PriceEstimate;
  note?: string;
  callbackNote?: string;
  internalNote?: string;
  cancelReason?: string;
  cancelledAt?: string;
  gdprConsent: boolean;
  marketingConsent: boolean;
  source: "web";
};

export type OrderEvent = {
  id: string;
  orderId?: string;
  eventType: OrderEventType;
  payload: Record<string, unknown>;
  createdAt: string;
};
