// Fetches a CSRF token straight from the server instead of trusting the
// snapshot baked into the page's initial HTML (a `data-csrf` attribute on
// the #app div). That snapshot goes stale - and the request comes back as
// "CSRF token mismatch" - once the tab has been left open past the
// session's lifetime, and it's simply missing whenever this page was
// reached via client-side <Link> navigation from a different auth page
// instead of a full document load (the #app div then still carries the
// attributes from whichever page the browser actually loaded).
export async function fetchCsrfToken() {
  const response = await fetch("/csrf-token", {
    headers: { Accept: "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Could not obtain a CSRF token.");
  }

  const data = await response.json();
  return data.csrf_token;
}
