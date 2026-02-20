import type { PriceEstimate } from "@/lib/types";

const EXPRES_SURCHARGE = 900;
const NAKLADKA_SURCHARGE = 1200;
const OPAKOVANY_ODVOZ_SURCHARGE = 700;

export function estimatePrice(input: {
  basePriceCzk: number;
  containerCount: number;
  rentalDays: number;
  extras: {
    expresniPristaveni: boolean;
    nakladkaOdNas: boolean;
    opakovanyOdvoz: boolean;
  };
}): PriceEstimate {
  const rentalDays = Math.max(1, input.rentalDays);
  const basePriceCzk = Math.max(0, Math.round(input.basePriceCzk));
  const base = basePriceCzk * input.containerCount * rentalDays;
  // Keep the online estimate aligned with the public container price list row.
  const transport = 0;

  let surchargePerDay = 0;
  if (input.extras.expresniPristaveni) surchargePerDay += EXPRES_SURCHARGE;
  if (input.extras.nakladkaOdNas) surchargePerDay += NAKLADKA_SURCHARGE;
  if (input.extras.opakovanyOdvoz) surchargePerDay += OPAKOVANY_ODVOZ_SURCHARGE;

  const surcharge = surchargePerDay * rentalDays;

  return {
    rentalDays,
    base,
    transport,
    surcharge,
    total: base + transport + surcharge,
    currency: "CZK",
  };
}
