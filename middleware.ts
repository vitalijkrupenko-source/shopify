import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const ok = await verifySessionToken(token, process.env.DASHBOARD_PASSWORD);
  if (ok) return NextResponse.next();

  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const loginUrl = new URL("/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Everything except the login page/route, the cron route (bearer-token
  // protected), and Next.js static assets.
  matcher: [
    "/((?!login|api/login|api/cron|_next/static|_next/image|favicon.ico|icon.svg).*)",
  ],
};
