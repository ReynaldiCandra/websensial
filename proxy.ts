import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: Parameters<typeof handleI18nRouting>[0]) {
  if (request.nextUrl.pathname === "/admin" || request.nextUrl.pathname.startsWith("/admin/")) {
    return NextResponse.next();
  }
  return handleI18nRouting(request);
}

export const config = {
  // Skip API routes, Next internals, and files with extensions.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
