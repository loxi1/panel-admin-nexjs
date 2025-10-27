// src/middleware.ts
import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  // APIs públicas de auth quedan libres
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  const needsAuth =
    pathname.startsWith("/(admin)") ||
    pathname.startsWith("/api") ||
    pathname === "/dashboard" ||
    pathname === "/articulos" ||
    pathname === "/usuarios";

  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("auth")?.value;
  if (!token) {
    const url = new URL("/login", origin);
    return NextResponse.redirect(url);
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(SECRET));
    return NextResponse.next();
  } catch {
    const url = new URL("/login", origin);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/(admin)/:path*", "/api/:path*", "/dashboard", "/articulos", "/usuarios"],
};
