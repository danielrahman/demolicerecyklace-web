import { WASTE_TYPES } from "@/lib/catalog";
import type { PriceEstimate, WasteTypeId } from "@/lib/types";

const EXPRES_SURCHARGE = 900;
const NAKLADKA_SURCHARGE = 1200;
const OPAKOVANY_ODVOZ_SURCHARGE = 700;
const TRANSPORT_BASE = 1200;

export function estimatePrice(input: {
  wasteType: WasteTypeId;
  containerCount: number;
  extras: {
    expresniPristaveni: boolean;
    nakladkaOdNas: boolean;
    opakovanyOdvoz: boolean;
  };
}): PriceEstimate {
  const wasteType = WASTE_TYPES.find((w) => w.id === input.wasteType);

  if (!wasteType) {
    throw new Error("Neznámý typ odpadu");
  }

  const base = wasteType.basePriceCzk * input.containerCount;
  const transport = TRANSPORT_BASE * input.containerCount;

  let surcharge = 0;
  if (input.extras.expresniPristaveni) surcharge += EXPRES_SURCHARGE;
  if (input.extras.nakladkaOdNas) surcharge += NAKLADKA_SURCHARGE;
  if (input.extras.opakovanyOdvoz) surcharge += OPAKOVANY_ODVOZ_SURCHARGE;

  return {
    base,
    transport,
    surcharge,
    total: base + transport + surcharge,
    currency: "CZK",
  };
}
