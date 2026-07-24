import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;
  const adminSecret = process.env.ADMIN_ROUTE_URL_SECRET;

  // Check if route is an admin page or admin API endpoint
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (isAdminRoute) {
    // Allow admin login POST API route to proceed
    if (pathname === "/api/admin/login") {
      return NextResponse.next();
    }

    const paramSecret =
      searchParams.get("key") ||
      searchParams.get("secret") ||
      searchParams.get("admin_secret");
    const headerSecret = req.headers.get("x-admin-secret");
    const cookieSecret = req.cookies.get("admin_route_secret")?.value;
    const adminSession = req.cookies.get("admin_session")?.value;

    const isAuthorized =
      (Boolean(adminSecret) &&
        (paramSecret === adminSecret ||
          cookieSecret === adminSecret ||
          headerSecret === adminSecret)) ||
      Boolean(adminSession);

    if (isAuthorized) {
      const response = NextResponse.next();
      if (paramSecret === adminSecret && cookieSecret !== adminSecret) {
        response.cookies.set("admin_route_secret", adminSecret, {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });
      }
      return response;
    }

    // Hide API routes with 418 status and VIP message for unauthorized requests
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json(
        {
          error: "🚫 Nice try! The admin zone isn't handing out VIP passes today. 😄",
        },
        { status: 418 }
      );
    }

    // Completely hide all /admin/** pages with 404 Not Found
    return NextResponse.rewrite(new URL("/_not-found", req.url));
  }

  // Public routes bypass
  if (
    pathname === "/login" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/college_logo.png" ||
    pathname === "/mitsprint.png" ||
    pathname === "/icon.png" ||
    pathname === "/icon-512.png" ||
    pathname === "/icon-192.png" ||
    pathname === "/site.webmanifest" ||
    pathname === "/apple-icon.png" ||
    pathname === "/apple-touch-icon.png" ||
    pathname === "/api/file" ||
    pathname === "/api/webhook" ||
    pathname === "/api/printer/status" ||
    pathname === "/api/file/update"
  ) {
    return NextResponse.next();
  }

  // NextAuth User Token check for user protected routes
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
