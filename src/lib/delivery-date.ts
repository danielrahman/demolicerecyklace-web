const DELIVERY_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function startOfLocalDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

export function parseIsoLocalDate(value: string) {
  if (!DELIVERY_DATE_REGEX.test(value)) return null;

  const [yearValue, monthValue, dayValue] = value.split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  const parsed = new Date(year, month - 1, day);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

export function formatIsoLocalDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayIsoLocalDate() {
  return formatIsoLocalDate(new Date());
}

export function isWeekendDate(value: Date) {
  const day = value.getDay();
  return day === 0 || day === 6;
}

export function validateDeliveryDateRequested(value: string, now = new Date()) {
  const parsed = parseIsoLocalDate(value);

  if (!parsed) {
    return "Zadejte platné datum přistavení";
  }

  const today = startOfLocalDay(now);
  if (parsed < today) {
    return "Datum přistavení musí být dnes nebo později";
  }

  if (isWeekendDate(parsed)) {
    return "Online objednávka nepodporuje víkendové datum přistavení";
  }

  return null;
}

export function isSelectableDeliveryDate(value: string, now = new Date()) {
  return validateDeliveryDateRequested(value, now) === null;
}
