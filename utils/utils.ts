import { DateTime } from "luxon";
import Location from "../types/location";

const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const deviceLocale = Intl.DateTimeFormat().resolvedOptions().locale;

export const formatDate = (dateUtc: string) => {
  return DateTime.fromISO(dateUtc, { zone: "utc" })
    .setZone(deviceTimeZone)
    .setLocale(deviceLocale)
    .toLocaleString(DateTime.DATETIME_SHORT);
};

export const getCoordinatesFromAddress = async (
  address: string,
): Promise<Location | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&accept-language=en,ru`,
      {
        headers: {
          "User-Agent": "TaskManager/0.2",
        },
      },
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return {
        address: result.display_name,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};
