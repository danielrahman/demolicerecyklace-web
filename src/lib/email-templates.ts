import type { CallbackRequest } from "@/lib/callback-request-store";
import { formatCzechDayCount } from "@/lib/czech";
import { CONTACT, SITE_META, SITE_URL } from "@/lib/site-config";
import type { ContainerOrder } from "@/lib/types";

export type EmailTemplatePayload = {
  subject: string;
  text: string;
  html: string;
};

type DetailRow = {
  label: string;
  value: string;
  emphasize?: boolean;
};

type StatusMode = "confirmed" | "rescheduled" | "cancelled";

type LayoutSection = {
  title: string;
  bodyHtml: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatCurrency(czk: number) {
  return `${new Intl.NumberFormat("cs-CZ").format(czk)} Kč`;
}

function optionalText(value: string | undefined | null, fallback = "neuvedeno") {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : fallback;
}

function formatDateCz(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return value;
  }

  return `${day}. ${month}. ${year}`;
}

function formatDateTimeCz(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("cs-CZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

function multilineToHtml(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

function orderAddressLine(order: ContainerOrder) {
  return `${order.street} ${order.houseNumber}, ${order.city}, ${order.postalCode}`;
}

function requestedTermLine(order: ContainerOrder) {
  const from = formatDateCz(order.deliveryDateRequested);
  const to = order.deliveryDateEndRequested ? formatDateCz(order.deliveryDateEndRequested) : "";
  const dateRange = to ? `${from} - ${to}` : from;
  return `${dateRange} (${order.timeWindowRequested})`;
}

function confirmedTermLine(order: ContainerOrder) {
  if (!order.deliveryDateConfirmed || !order.timeWindowConfirmed) {
    return "Termín zatím není potvrzen.";
  }

  return `${formatDateCz(order.deliveryDateConfirmed)} (${order.timeWindowConfirmed})`;
}

function detailRowsToText(rows: DetailRow[]) {
  return rows.map((row) => `${row.label}: ${row.value}`).join("\n");
}

function renderDetailRows(rows: DetailRow[]) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${rows
        .map((row, index) => {
          const borderStyle = index === rows.length - 1 ? "none" : "1px solid #e5e7eb";
          return `
            <tr>
              <td style="padding:10px 12px;border-bottom:${borderStyle};font-size:13px;line-height:1.4;color:#4b5563;vertical-align:top;width:38%;">
                ${escapeHtml(row.label)}
              </td>
              <td style="padding:10px 12px;border-bottom:${borderStyle};font-size:14px;line-height:1.45;color:${row.emphasize ? "#111827" : "#1f2937"};font-weight:${row.emphasize ? "700" : "500"};vertical-align:top;">
                ${multilineToHtml(row.value)}
              </td>
            </tr>
          `;
        })
        .join("")}
    </table>
  `;
}

function renderList(items: string[]) {
  return `
    <ul style="margin:0;padding:0 0 0 20px;color:#1f2937;font-size:14px;line-height:1.55;">
      ${items.map((item) => `<li style="margin:0 0 6px 0;">${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderSection(section: LayoutSection) {
  return `
    <tr>
      <td style="padding:0 28px 22px 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e7eb;border-radius:10px;">
          <tr>
            <td style="padding:12px 14px;border-bottom:1px solid #e5e7eb;background:#fafafa;font-size:13px;line-height:1.4;font-weight:700;color:#374151;">
              ${escapeHtml(section.title)}
            </td>
          </tr>
          <tr>
            <td style="padding:14px;background:#ffffff;">
              ${section.bodyHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function renderLayout(input: {
  preheader: string;
  headline: string;
  intro: string;
  sections: LayoutSection[];
  footer: string;
}) {
  const logoUrl = `${SITE_URL}/brand/logo-original.png`;
  const escapedHeadline = escapeHtml(input.headline);
  const escapedIntro = escapeHtml(input.intro);
  const escapedFooter = escapeHtml(input.footer);

  return `<!doctype html>
<html lang="cs">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapedHeadline}</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;color:#111827;">
    <div style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;">
      ${escapeHtml(input.preheader)}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f3f4f6;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:22px 28px 18px 28px;background:#111827;border-bottom:4px solid #f2c400;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(SITE_META.brandName)}" width="172" height="46" style="display:block;width:172px;height:auto;border:0;outline:none;text-decoration:none;" />
                    </td>
                    <td align="right" style="vertical-align:middle;font-size:12px;line-height:1.3;color:#e5e7eb;font-weight:600;">
                      ${escapeHtml(SITE_META.brandName)}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 16px 28px;">
                <h1 style="margin:0 0 10px 0;font-size:23px;line-height:1.25;color:#111827;">
                  ${escapedHeadline}
                </h1>
                <p style="margin:0;font-size:14px;line-height:1.6;color:#374151;">
                  ${escapedIntro}
                </p>
              </td>
            </tr>
            ${input.sections.map((section) => renderSection(section)).join("")}
            <tr>
              <td style="padding:8px 28px 24px 28px;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;">
                  ${escapedFooter}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function companyIdentityLine(order: ContainerOrder) {
  if (order.customerType !== "firma") {
    return "Fyzická osoba";
  }

  const companyParts = [optionalText(order.companyName, "Firma neuvedena")];
  if (order.ico) companyParts.push(`IČO: ${order.ico}`);
  if (order.dic) companyParts.push(`DIČ: ${order.dic}`);

  return companyParts.join(" | ");
}

function pinLocationLine(order: ContainerOrder) {
  if (!order.pinLocation) return "neuvedeno";
  return `${order.pinLocation.lat.toFixed(6)}, ${order.pinLocation.lng.toFixed(6)}`;
}

function asOptionalString(value: unknown) {
  if (typeof value !== "string") return "";
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : "";
}

function asOptionalNumber(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value;
}

function snapshotRows(snapshot?: Record<string, unknown>): DetailRow[] {
  if (!snapshot) {
    return [{ label: "Souhrn", value: "Neposkytnuto" }];
  }

  const addressParts = [
    asOptionalString(snapshot.street),
    asOptionalString(snapshot.houseNumber),
    asOptionalString(snapshot.city),
    asOptionalString(snapshot.postalCode),
  ].filter(Boolean);

  const deliveryDateRequested = asOptionalString(snapshot.deliveryDateRequested);
  const deliveryDateEndRequested = asOptionalString(snapshot.deliveryDateEndRequested);
  const timeWindowRequested = asOptionalString(snapshot.timeWindowRequested);

  const dateFrom = deliveryDateRequested ? formatDateCz(deliveryDateRequested) : "";
  const dateTo = deliveryDateEndRequested ? formatDateCz(deliveryDateEndRequested) : "";
  const dateRange = dateFrom ? `${dateFrom}${dateTo ? ` - ${dateTo}` : ""}` : "";
  const termLine = dateRange
    ? `${dateRange}${timeWindowRequested ? ` (${timeWindowRequested})` : ""}`
    : "neuvedeno";

  const rentalDays = asOptionalNumber(snapshot.rentalDays);
  const flexibilityDays = asOptionalNumber(snapshot.deliveryFlexibilityDays);
  const containerCount = asOptionalNumber(snapshot.containerCount);

  return [
    { label: "Adresa", value: addressParts.length > 0 ? addressParts.join(" ") : "neuvedeno" },
    { label: "Typ odpadu", value: asOptionalString(snapshot.wasteType) || "neuvedeno" },
    { label: "Počet kontejnerů", value: containerCount ? String(containerCount) : "neuvedeno" },
    { label: "Doba pronájmu", value: rentalDays ? formatCzechDayCount(rentalDays) : "neuvedeno" },
    {
      label: "Flexibilita termínu",
      value: flexibilityDays ? `±${formatCzechDayCount(flexibilityDays)}` : "neuvedeno",
    },
    { label: "Termín", value: termLine },
  ];
}

export function buildCustomerReceivedTemplate(order: ContainerOrder): EmailTemplatePayload {
  const subject = `Objednávku ${order.id} jsme přijali`;

  const recapRows: DetailRow[] = [
    { label: "Číslo objednávky", value: order.id, emphasize: true },
    { label: "Adresa přistavení", value: orderAddressLine(order) },
    { label: "Požadovaný termín", value: requestedTermLine(order) },
    { label: "Doba pronájmu", value: formatCzechDayCount(order.rentalDays) },
  ];

  if (order.deliveryFlexibilityDays) {
    recapRows.push({
      label: "Flexibilita termínu",
      value: `±${formatCzechDayCount(order.deliveryFlexibilityDays)}`,
    });
  }

  recapRows.push({
    label: "Orientační cena",
    value: `${formatCurrency(order.priceEstimate.total)} (finální cenu potvrzuje operátor)`,
    emphasize: true,
  });

  const text =
    `Děkujeme, objednávku ${order.id} jsme přijali.\n` +
    `\n` +
    `Co bude následovat:\n` +
    `- Operátor zkontroluje dostupnost a potvrdí vám přesný termín.\n` +
    `- Pokud bude potřeba upřesnění, ozveme se vám telefonicky.\n` +
    `- Po potvrzení termínu vám pošleme další e-mail.\n` +
    `\n` +
    `Rekapitulace objednávky:\n` +
    `${detailRowsToText(recapRows)}\n` +
    `\n` +
    `V případě dotazů volejte ${CONTACT.phone} nebo pište na ${CONTACT.email}.`;

  const html = renderLayout({
    preheader: `Objednávka ${order.id} byla přijata`,
    headline: `Objednávku ${order.id} jsme přijali`,
    intro: "Děkujeme za odeslání objednávky. Níže najdete stručnou rekapitulaci a další postup.",
    sections: [
      {
        title: "Rekapitulace objednávky",
        bodyHtml: renderDetailRows(recapRows),
      },
      {
        title: "Co bude následovat",
        bodyHtml: renderList([
          "Operátor zkontroluje dostupnost a potvrdí vám přesný termín.",
          "Pokud bude potřeba upřesnění, ozveme se vám telefonicky.",
          "Po potvrzení termínu vám pošleme další e-mail.",
        ]),
      },
    ],
    footer: `V případě dotazů volejte ${CONTACT.phone} nebo pište na ${CONTACT.email}.`,
  });

  return { subject, text, html };
}

export function buildInternalNewOrderTemplate(
  order: ContainerOrder,
  wasteTypeLabel: string,
): EmailTemplatePayload {
  const subject = `Nová objednávka ${order.id}`;

  const detailRows: DetailRow[] = [
    { label: "Objednávka", value: order.id, emphasize: true },
    { label: "Vytvořeno", value: formatDateTimeCz(order.createdAt) },
    { label: "Zákazník", value: order.name },
    { label: "Typ zákazníka", value: companyIdentityLine(order) },
    { label: "Telefon", value: order.phone },
    { label: "E-mail", value: order.email },
    { label: "Adresa", value: orderAddressLine(order) },
    { label: "Bod na mapě", value: pinLocationLine(order) },
    { label: "Typ odpadu", value: wasteTypeLabel },
    { label: "Kontejner", value: `${order.containerSizeM3}m³, počet ${order.containerCount}` },
    { label: "Doba pronájmu", value: formatCzechDayCount(order.rentalDays) },
  ];

  if (order.deliveryFlexibilityDays) {
    detailRows.push({
      label: "Flexibilita termínu",
      value: `±${formatCzechDayCount(order.deliveryFlexibilityDays)}`,
    });
  }

  detailRows.push(
    { label: "Požadovaný termín", value: requestedTermLine(order) },
    { label: "Orientační cena", value: formatCurrency(order.priceEstimate.total), emphasize: true },
    { label: "Poznámka zákazníka", value: optionalText(order.note, "bez poznámky") },
    { label: "Poznámka ke zpětnému zavolání", value: optionalText(order.callbackNote, "bez poznámky") },
  );

  const text =
    `Nová objednávka ${order.id}\n` +
    `${detailRowsToText(detailRows)}\n` +
    `\n` +
    `Interní notifikace ${SITE_META.companyName}.`;

  const html = renderLayout({
    preheader: `Nová objednávka ${order.id}`,
    headline: `Nová objednávka ${order.id}`,
    intro: "Přišla nová objednávka z webu. Níže je kompletní technická rekapitulace.",
    sections: [
      {
        title: "Detaily objednávky",
        bodyHtml: renderDetailRows(detailRows),
      },
    ],
    footer: `Interní notifikace ${SITE_META.companyName}.`,
  });

  return { subject, text, html };
}

export function buildCustomerConfirmedTemplate(
  order: ContainerOrder,
  mode: "confirmed" | "rescheduled",
): EmailTemplatePayload {
  const subject =
    mode === "confirmed"
      ? `Potvrzení termínu objednávky ${order.id}`
      : `Upravený termín objednávky ${order.id}`;
  const headline =
    mode === "confirmed"
      ? `Termín objednávky ${order.id} je potvrzen`
      : `Termín objednávky ${order.id} byl upraven`;

  const rows: DetailRow[] = [
    { label: "Číslo objednávky", value: order.id, emphasize: true },
    { label: "Potvrzený termín", value: confirmedTermLine(order), emphasize: true },
    { label: "Adresa přistavení", value: orderAddressLine(order) },
  ];

  const text =
    `${mode === "confirmed" ? "Termín objednávky byl potvrzen." : "Termín objednávky byl upraven."}\n` +
    `${detailRowsToText(rows)}\n` +
    `\n` +
    `Pokud potřebujete změnu, kontaktujte nás na ${CONTACT.phone} nebo ${CONTACT.email}.`;

  const html = renderLayout({
    preheader: headline,
    headline,
    intro:
      mode === "confirmed"
        ? "Děkujeme za objednávku. Potvrzený termín najdete níže."
        : "Děkujeme za trpělivost. Aktualizovaný termín najdete níže.",
    sections: [
      {
        title: "Potvrzené údaje",
        bodyHtml: renderDetailRows(rows),
      },
    ],
    footer: `Pokud potřebujete změnu, kontaktujte nás na ${CONTACT.phone} nebo ${CONTACT.email}.`,
  });

  return { subject, text, html };
}

export function buildCustomerCancelledTemplate(order: ContainerOrder): EmailTemplatePayload {
  const subject = `Objednávka ${order.id} byla stornována`;
  const cancelReason = optionalText(order.cancelReason, "bez upřesnění");

  const rows: DetailRow[] = [
    { label: "Číslo objednávky", value: order.id, emphasize: true },
    { label: "Důvod storna", value: cancelReason },
    { label: "Adresa", value: orderAddressLine(order) },
  ];

  const text =
    `Objednávka ${order.id} byla stornována.\n` +
    `${detailRowsToText(rows)}\n` +
    `\n` +
    `Pokud chcete objednávku obnovit, kontaktujte dispečink na ${CONTACT.phone} nebo ${CONTACT.email}.`;

  const html = renderLayout({
    preheader: `Objednávka ${order.id} byla stornována`,
    headline: `Objednávka ${order.id} byla stornována`,
    intro: "Níže uvádíme stručnou rekapitulaci storna.",
    sections: [
      {
        title: "Rekapitulace storna",
        bodyHtml: renderDetailRows(rows),
      },
    ],
    footer: `Pokud chcete objednávku obnovit, kontaktujte dispečink na ${CONTACT.phone} nebo ${CONTACT.email}.`,
  });

  return { subject, text, html };
}

export function buildInternalStatusTemplate(
  order: ContainerOrder,
  mode: StatusMode,
): EmailTemplatePayload {
  const subjectByMode: Record<StatusMode, string> = {
    confirmed: `Objednávka ${order.id} potvrzena`,
    rescheduled: `Objednávka ${order.id} přeplánována`,
    cancelled: `Objednávka ${order.id} stornována`,
  };

  const stateByMode: Record<StatusMode, string> = {
    confirmed: "Potvrzena",
    rescheduled: "Přeplánována",
    cancelled: "Stornována",
  };

  const modeDetail: Record<StatusMode, string> = {
    confirmed: confirmedTermLine(order),
    rescheduled: confirmedTermLine(order),
    cancelled: `Důvod storna: ${optionalText(order.cancelReason, "bez upřesnění")}`,
  };

  const rows: DetailRow[] = [
    { label: "Objednávka", value: order.id, emphasize: true },
    { label: "Stav", value: stateByMode[mode], emphasize: true },
    {
      label: mode === "cancelled" ? "Detail storna" : "Potvrzený termín",
      value: modeDetail[mode],
    },
    { label: "Zákazník", value: order.name },
    { label: "Kontakt", value: `${order.phone}\n${order.email}` },
    { label: "Adresa", value: orderAddressLine(order) },
  ];

  const text =
    `${subjectByMode[mode]}\n` +
    `${detailRowsToText(rows)}\n` +
    `\n` +
    `Interní notifikace ${SITE_META.companyName}.`;

  const html = renderLayout({
    preheader: subjectByMode[mode],
    headline: subjectByMode[mode],
    intro: "Status objednávky byl změněn. Níže je aktuální stav.",
    sections: [
      {
        title: "Aktualizace objednávky",
        bodyHtml: renderDetailRows(rows),
      },
    ],
    footer: `Interní notifikace ${SITE_META.companyName}.`,
  });

  return {
    subject: subjectByMode[mode],
    text,
    html,
  };
}

export function buildCallbackRequestTemplate(callbackRequest: CallbackRequest): EmailTemplatePayload {
  const subject = `Nový požadavek na zpětné zavolání ${callbackRequest.id}`;

  const leadRows: DetailRow[] = [
    { label: "ID požadavku", value: callbackRequest.id, emphasize: true },
    { label: "Vytvořeno", value: formatDateTimeCz(callbackRequest.createdAt) },
    { label: "Telefon", value: callbackRequest.phone, emphasize: true },
    { label: "Jméno", value: optionalText(callbackRequest.name) },
    { label: "E-mail", value: optionalText(callbackRequest.email) },
    { label: "Preferovaný čas hovoru", value: optionalText(callbackRequest.preferredCallTime) },
    { label: "Poznámka", value: optionalText(callbackRequest.note, "bez poznámky") },
  ];

  const callbackSnapshotRows = snapshotRows(callbackRequest.wizardSnapshot);

  const text =
    `Nový požadavek na zpětné zavolání ${callbackRequest.id}\n` +
    `${detailRowsToText(leadRows)}\n` +
    `\n` +
    `Souhrn z formuláře:\n` +
    `${detailRowsToText(callbackSnapshotRows)}\n` +
    `\n` +
    `Interní notifikace ${SITE_META.companyName}.`;

  const html = renderLayout({
    preheader: `Nový požadavek na zpětné zavolání ${callbackRequest.id}`,
    headline: `Nový požadavek na zpětné zavolání ${callbackRequest.id}`,
    intro: "Přišel nový požadavek na zpětné zavolání.",
    sections: [
      {
        title: "Kontakt",
        bodyHtml: renderDetailRows(leadRows),
      },
      {
        title: "Souhrn z formuláře",
        bodyHtml: renderDetailRows(callbackSnapshotRows),
      },
    ],
    footer: `Interní notifikace ${SITE_META.companyName}.`,
  });

  return { subject, text, html };
}
