import { COMING_SOON } from "../../src/band.js";
import { resolveBand } from "./_lib.js";

// GET /api/redirect -> 302 to today's Bandcamp page (or ?date=YYYY-MM-DD).
// Future dates can't redirect, so they respond with the "<coming-soon>" text.
export async function onRequestGet({ request, env }) {
  const { url, error } = await resolveBand(request, env);

  if (error) {
    return new Response(error, { status: 400 });
  }

  if (url === COMING_SOON) {
    return new Response(COMING_SOON + "\n", {
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }

  return Response.redirect(url, 302);
}
