import type { TimeWindowValue } from "@/lib/time-windows";

export type OrderStatus = "new" | "confirmed" | "done" | "cancelled";

export type TimeWindow = TimeWindowValue;

export type PlacementType = "soukromy" | "verejny";

export type CustomerType = "fo" | "firma";

export type WasteTypeId =
  | "sut-cista"
  | "sut-smesna"
  | "objemny"
  | "zemina"
  | "drevo";

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
  deliveryFlexibilityDays?: 1 | 2 | 3 | 7 | 14;
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
