import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./navigation";

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);
  // Expose the requested (localized) pathname so the root layout can build
  // correct per-page hreflang alternates.
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  // Exclude Payload's admin UI (/admin) and its API (/payload-api) from the
  // next-intl locale middleware, plus the site's own /api, Next internals,
  // any file with an extension and the branded download route (/descargar/…).
  // Las landings de recursos (/g/…) ya van dentro del árbol de idiomas, con
  // el estilo de la web.
  matcher: ["/((?!api|payload-api|admin|descargar/|_next|_vercel|.*\\..*).*)"],
};
