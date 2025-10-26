import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// Ajusta según las rutas reales de tu TailAdmin
const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/favicon.ico",
  "/favicon.svg",
  "/robots.txt",
  "/sitemap.xml",
  "/_next",              // assets
  "/images", "/fonts",   // estáticos
  "/.well-known",        // ese json de chrome
];

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/ecommerce",
  "/tables",
  "/users",
  "/reports",
  "/api", // si quieres proteger API (excepto auth)
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Público
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // ¿Necesita auth?
  const needsAuth = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("auth")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(SECRET));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Matchea todo y filtramos dentro (más simple de mantener)
export const config = {
  matcher: ["/:path*"],
};