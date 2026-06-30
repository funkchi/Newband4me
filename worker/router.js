const PAGES_ORIGIN = "https://newband4me.pages.dev";
const CLI_USER_AGENT =
  /\b(curl|wget|httpie|python-requests|go-http-client|libwww-perl|postmanruntime|insomnia)\b/i;

function isCliRequest(request) {
  return CLI_USER_AGENT.test(request.headers.get("user-agent") || "");
}

function clientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for") || "";

  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    forwardedFor.split(",")[0].trim()
  );
}

function plainIp(ip) {
  return new Response(`${ip}\n`, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*"
    }
  });
}

function pagesRequest(request) {
  const url = new URL(request.url);
  const target = new URL(`${url.pathname}${url.search}`, PAGES_ORIGIN);

  return new Request(target, request);
}

export async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname === "/" && isCliRequest(request)) {
    const ip = clientIp(request);

    if (!ip) {
      return new Response("Client IP unavailable\n", {
        status: 502,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-store"
        }
      });
    }

    return plainIp(ip);
  }

  return fetch(pagesRequest(request));
}

export default {
  fetch: handleRequest
};
