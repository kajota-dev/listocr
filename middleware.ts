import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas que requieren autenticación
const PROTECTED_ROUTES = ["/dashboard"];

// Rutas reservadas del sistema (no pueden usarse como slugs de usuario)
export const SYSTEM_ROUTES = [
  "registro",
  "login",
  "logout",
  "dashboard",
  "api",
  "admin",
  "u",
  "_next",
  "favicon.ico",
  "public",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rutas del dashboard
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    const token = request.cookies.get("listo-auth-token");
    if (!token) {
      const loginUrl = new URL("/registro", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
};
