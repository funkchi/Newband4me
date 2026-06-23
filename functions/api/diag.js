const KEY = "nb4m-diag-8h2k";
const UA = "Mozilla/5.0 (compatible; newband4me/1.0; +https://newband4me.com)";

export async function onRequestGet({ request }) {
  const u = new URL(request.url);
  if (u.searchParams.get("key") !== KEY) {
    return new Response("forbidden", { status: 403 });
  }
  const out = {};
  try {
    const r = await fetch(
      "https://bandcamp.com/api/discover/3/get_web?s=rand&p=1",
      { headers: { "user-agent": UA, accept: "application/json" } }
    );
    out.status = r.status;
    out.ctype = r.headers.get("content-type");
    const j = await r.json();
    out.itemCount = j.items ? j.items.length : 0;
    if (j.items && j.items.length) {
      const item = j.items[0];
      out.firstItemKeys = Object.keys(item);
      out.firstItem = item;
      out.directCandidates = {
        band_url: item.band_url,
        url: item.url,
        link: item.link,
        page_url: item.page_url
      };
      if (item.band_id != null) {
        try {
          const ri = await fetch(
            `https://bandcamp.com/api/band/3/info?band_id=${item.band_id}`,
            { headers: { "user-agent": UA, accept: "application/json" } }
          );
          out.bandInfoStatus = ri.status;
          const bi = await ri.json();
          out.bandInfoKeys = Object.keys(bi);
          out.bandInfoSubset = {
            band_url: bi.band_url,
            url: bi.url,
            subdomain: bi.subdomain,
            name: bi.name
          };
        } catch (e) {
          out.bandInfoError = e.message;
        }
      }
    }
  } catch (e) {
    out.fetchError = e.message;
  }
  return Response.json(out);
}
