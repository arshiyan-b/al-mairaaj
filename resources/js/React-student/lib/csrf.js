// Laravel automatically sets an encrypted `XSRF-TOKEN` cookie on every
// response for any request that goes through the `web` middleware group
// (session + VerifyCsrfToken) — no Blade template changes needed for this
// to exist. Axios reads it automatically; native fetch() does not, so we
// read it ourselves and send it back as the `X-XSRF-TOKEN` header, which
// Laravel's VerifyCsrfToken middleware checks in addition to the classic
// `X-CSRF-TOKEN` / _token approaches.
//
// Requires: fetch calls include `credentials: "same-origin"` (or
// "include" if the frontend and API are on different origins/ports) so
// the session + XSRF-TOKEN cookies are actually sent and received.

function getCookie(name) {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));

  if (!match) return null;

  const value = match.split("=").slice(1).join("=");
  return decodeURIComponent(value);
}

export function getCsrfToken() {
  return getCookie("XSRF-TOKEN");
}

export function withCsrfHeaders(extraHeaders = {}) {
  const token = getCsrfToken();

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { "X-XSRF-TOKEN": token } : {}),
    ...extraHeaders,
  };
}