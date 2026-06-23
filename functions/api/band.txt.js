import { resolveBand, corsHeaders } from "./_lib.js";

// GET /api/band.txt -> plain-text Bandcamp URL for today (or ?date=YYYY-MM-DD).
// Returns "<coming-soon>" for future dates.
export async function onRequestGet({ request, env }) {
  const { url, error } = await resolveBand(request, env);

  if (error) {
    return new Response(error + "\n", {
      status: 400,
      headers: { "content-type": "text/plain; charset=utf-8", ...corsHeaders }
    });
  }

  return new Response(url + "\n", {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      ...corsHeaders,
      "cache-control": "public, max-age=300"
    }
  });
}
