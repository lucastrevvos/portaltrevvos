import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE = process.env.NEXT_PUBLIC_ACCESS_COOKIE || "accessToken";

const PRIVATES = ["/new-post", "/edit-post", "/admin"];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const isPrivate = PRIVATES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (!isPrivate) return NextResponse.next();

  const token = req.cookies.get(ACCESS_COOKIE)?.value;
  if (token) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = `?next=${encodeURIComponent(pathname + search)}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/new-post", "/edit-post/:path*", "/admin/:path"],
};
