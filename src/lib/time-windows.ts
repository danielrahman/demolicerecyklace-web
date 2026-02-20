export const TIME_WINDOW_VALUES = [
  "06:00-07:00",
  "07:00-08:00",
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
  "17:00-18:00",
] as const;

export type TimeWindowValue = (typeof TIME_WINDOW_VALUES)[number];

export const TIME_WINDOW_LABELS: Record<TimeWindowValue, string> = {
  "06:00-07:00": "06:00-07:00",
  "07:00-08:00": "07:00-08:00",
  "08:00-09:00": "08:00-09:00",
  "09:00-10:00": "09:00-10:00",
  "10:00-11:00": "10:00-11:00",
  "11:00-12:00": "11:00-12:00",
  "12:00-13:00": "12:00-13:00",
  "13:00-14:00": "13:00-14:00",
  "14:00-15:00": "14:00-15:00",
  "15:00-16:00": "15:00-16:00",
  "16:00-17:00": "16:00-17:00",
  "17:00-18:00": "17:00-18:00",
};

export function isTimeWindow(value: string): value is TimeWindowValue {
  return TIME_WINDOW_VALUES.includes(value as TimeWindowValue);
}
