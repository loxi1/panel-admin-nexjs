// src/middleware.ts
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export async function middleware(req: Request) {
  const url = new URL((req as any).url);
  const path = url.pathname;

  // Excepciones
  if (path.startsWith("/api/auth")) return NextResponse.next();
  if (path.startsWith("/_next") || path.startsWith("/favicon") || path.startsWith("/assets")) {
    return NextResponse.next();
  }

  // Rutas que requieren auth (URLs reales)
  const needsAuth =
    path.startsWith("/dashboard") ||
    path.startsWith("/articulos") ||
    path.startsWith("/usuarios") ||
    path.startsWith("/api");

  if (!needsAuth) return NextResponse.next();

  const token = (req as any).cookies.get?.("auth")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", url));

  try {
    await jwtVerify(token, new TextEncoder().encode(SECRET));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/articulos/:path*",
    "/usuarios/:path*",
    "/api/:path*",
  ],
};