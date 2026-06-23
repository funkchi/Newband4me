import { dateKey } from "../../src/band.js";
import { resolveBand, json } from "./_lib.js";

// GET /api/band -> { date: "YYYY-MM-DD", url: "https://...bandcamp.com" }
// `url` is "<coming-soon>" for future dates. ?date=YYYY-MM-DD overrides today.
export function onRequestGet({ request }) {
  const { date, url, error } = resolveBand(request);

  if (error) {
    return json({ error }, 400);
  }

  return json({ date: dateKey(date), url });
}
