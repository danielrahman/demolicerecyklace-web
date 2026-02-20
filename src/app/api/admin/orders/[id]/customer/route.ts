import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/auth/guards";
import { getOrder, updateOrderCustomerContact } from "@/lib/order-store";
import { appendOrderEvent } from "@/server/db/repositories/order-events";

const phoneRegex = /^(\+420|\+421|0)?\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$/;
const icoRegex = /^\d{8}$/;

function normalizeOptional(value: FormDataEntryValue | null) {
  const trimmed = String(value ?? "").trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeRequired(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await context.params;
  const existingOrder = await getOrder(id);

  if (!existingOrder) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  if (existingOrder.status !== "new" && existingOrder.status !== "confirmed") {
    return NextResponse.json({ error: "Zákazníka lze upravovat jen u přijaté nebo potvrzené objednávky." }, { status: 409 });
  }

  const formData = await request.formData();

  const name = normalizeRequired(formData.get("name"));
  const companyName = normalizeOptional(formData.get("companyName"));
  const ico = normalizeOptional(formData.get("ico"));
  const dic = normalizeOptional(formData.get("dic"));
  const email = normalizeRequired(formData.get("email"));
  const phone = normalizeRequired(formData.get("phone"));

  if (name.length < 2) {
    return NextResponse.json({ error: "Doplňte jméno kontaktu." }, { status: 400 });
  }

  if (!email.includes("@") || email.length < 5) {
    return NextResponse.json({ error: "Doplňte platný e-mail." }, { status: 400 });
  }

  if (!phoneRegex.test(phone)) {
    return NextResponse.json({ error: "Doplňte platné telefonní číslo." }, { status: 400 });
  }

  if (existingOrder.customerType === "firma") {
    if (!companyName || companyName.length < 2) {
      return NextResponse.json({ error: "U firemního zákazníka doplňte název firmy." }, { status: 400 });
    }

    if (ico && !icoRegex.test(ico.replace(/\D/g, ""))) {
      return NextResponse.json({ error: "IČO musí mít 8 číslic." }, { status: 400 });
    }
  }

  const order = await updateOrderCustomerContact(id, {
    name,
    companyName,
    ico,
    dic,
    email,
    phone,
  });

  if (!order) {
    return NextResponse.json({ error: "Objednávka nenalezena" }, { status: 404 });
  }

  const changedFields: string[] = [];
  if (existingOrder.name !== order.name) changedFields.push("jméno");
  if ((existingOrder.companyName ?? "") !== (order.companyName ?? "")) changedFields.push("firma");
  if ((existingOrder.ico ?? "") !== (order.ico ?? "")) changedFields.push("IČO");
  if ((existingOrder.dic ?? "") !== (order.dic ?? "")) changedFields.push("DIČ");
  if (existingOrder.email !== order.email) changedFields.push("e-mail");
  if (existingOrder.phone !== order.phone) changedFields.push("telefon");

  await appendOrderEvent({
    orderId: order.id,
    eventType: "customer_updated",
    payload: {
      by: auth.session.user.email,
      changedFields,
      before: {
        name: existingOrder.name,
        companyName: existingOrder.companyName ?? null,
        ico: existingOrder.ico ?? null,
        dic: existingOrder.dic ?? null,
        email: existingOrder.email,
        phone: existingOrder.phone,
      },
      after: {
        name: order.name,
        companyName: order.companyName ?? null,
        ico: order.ico ?? null,
        dic: order.dic ?? null,
        email: order.email,
        phone: order.phone,
      },
    },
  });

  return NextResponse.redirect(new URL(`/admin/objednavky/${id}`, request.url));
}
