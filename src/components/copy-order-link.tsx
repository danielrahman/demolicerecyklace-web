"use client";

import Link from "next/link";
import { type ReactNode } from "react";

import type { ContainerOrder } from "@/lib/types";

type CopyOrderLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  order: ContainerOrder;
};

const copyOrderStorageKey = "order-wizard-copy-order-v1";

export function CopyOrderLink({ href, className, children, order }: CopyOrderLinkProps) {
  function handleClick() {
    try {
      localStorage.setItem(
        copyOrderStorageKey,
        JSON.stringify({
          version: 1,
          orderId: order.id,
          updatedAt: Date.now(),
          data: {
            customerType: order.customerType,
            name: order.name,
            companyName: order.companyName ?? "",
            ico: order.ico ?? "",
            dic: order.dic ?? "",
            email: order.email,
            phone: order.phone,
            postalCode: order.postalCode,
            city: order.city,
            street: order.street,
            houseNumber: order.houseNumber,
            wasteType: order.wasteType,
            containerCount: order.containerCount,
            rentalDays: order.rentalDays,
            deliveryDateRequested: order.deliveryDateRequested,
            deliveryDateEndRequested: order.deliveryDateEndRequested ?? "",
            timeWindowRequested: order.timeWindowRequested,
            placementType: order.placementType,
            permitConfirmed: order.permitConfirmed,
            nakladkaOdNas: order.extras.nakladkaOdNas,
            expresniPristaveni: order.extras.expresniPristaveni,
            opakovanyOdvoz: order.extras.opakovanyOdvoz,
            note: order.note ?? "",
            callbackNote: order.callbackNote ?? "",
            website: "",
            gdprConsent: false,
            marketingConsent: order.marketingConsent,
          },
          addressInput: `${order.street} ${order.houseNumber}, ${order.city}, ${order.postalCode}`,
          pinLocation: order.pinLocation ?? null,
        }),
      );
    } catch {
      // Ignore storage errors (private mode/quota).
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
