export type OrderStatus = "new" | "confirmed" | "done" | "cancelled";

export type TimeWindow = "rano" | "dopoledne" | "odpoledne";

export type PlacementType = "soukromy" | "verejny";

export type CustomerType = "fo" | "firma";

export type WasteTypeId =
  | "sut-cista"
  | "sut-smesna"
  | "objemny"
  | "zemina"
  | "drevo";

export type PriceEstimate = {
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
  deliveryDateRequested: string;
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
  internalNote?: string;
  cancelReason?: string;
  cancelledAt?: string;
  gdprConsent: boolean;
  marketingConsent: boolean;
  source: "web";
};
