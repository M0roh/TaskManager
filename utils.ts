import { DateTime } from "luxon";

const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const deviceLocale = Intl.DateTimeFormat().resolvedOptions().locale;

export const formatDate = (dateUtc: string) => {
  return DateTime.fromISO(dateUtc, { zone: "utc" })
    .setZone(deviceTimeZone)
    .setLocale(deviceLocale)
    .toLocaleString(DateTime.DATETIME_SHORT);
};
