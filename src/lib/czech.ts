export function czechDayWord(count: number) {
  const normalized = Math.abs(Math.trunc(count));
  const mod100 = normalized % 100;
  const mod10 = normalized % 10;

  if (mod10 === 1 && mod100 !== 11) {
    return "den";
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return "dny";
  }

  return "dní";
}

export function formatCzechDayCount(count: number) {
  return `${count} ${czechDayWord(count)}`;
}
