import {
  bandOfTheDay,
  parseUtcDate,
  isFutureDate,
  COMING_SOON
} from "../../src/band.js";

// Resolve the requested date and the band URL for it.
// - Honors `?date=YYYY-MM-DD` (defaults to now, UTC).
// - Returns { error } on a malformed date.
// - Returns { date, url } where url is the Bandcamp page, or COMING_SOON
//   when the requested date is strictly in the future.
export function resolveBand(request) {
  const requestUrl = new URL(request.url);
  let date = new Date();

  if (requestUrl.searchParams.has("date")) {
    const parsed = parseUtcDate(requestUrl.searchParams.get("date"));

    if (!parsed) {
      return { error: "Invalid date. Use YYYY-MM-DD." };
    }

    date = parsed;
  }

  const url = isFutureDate(date) ? COMING_SOON : bandOfTheDay(date);

  return { date, url };
}

export const corsHeaders = {
  "access-control-allow-origin": "*"
};

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders,
      "cache-control": "public, max-age=300"
    }
  });
}
