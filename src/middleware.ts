import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/profile", "/logout", "/provider/home"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedPath = PROTECTED.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (!protectedPath) return NextResponse.next();

  const token = request.cookies.get("sh_access")?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/logout", "/provider/home"],
};
