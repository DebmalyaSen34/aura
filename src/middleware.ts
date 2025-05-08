import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that should be protected (require authentication)
const protectedPaths = [
  "/home",
  "/profile",
  "/settings",
  "/notifications",
  "/messages",
];

// Add paths that should be accessible without authentication
const publicPaths = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isPublicPath = publicPaths.some((path) => pathname === path);

  // Get the access token from cookies
  const accessToken = request.cookies.get("access_token")?.value;

  // If it's a protected path and there's no access token, redirect to login
  if (isProtectedPath && !accessToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // If it's a public path (like login/register) and user is already authenticated,
  // redirect to home
  if (isPublicPath && accessToken) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Continue with the request
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
