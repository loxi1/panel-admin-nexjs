// src/middleware.ts
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export async function middleware(req: Request) {
  const url = new URL((req as any).url);

  // APIs públicas de auth quedan libres
  if (url.pathname.startsWith("/api/auth")) return NextResponse.next();

  // Rutas protegidas
  const needsAuth =
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/articulos") ||
    url.pathname.startsWith("/usuarios") ||
    url.pathname.startsWith("/api/");

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
    "/(admin)/:path*",
    "/dashboard",
    "/usuarios",
    "/articulos",
    "/api/:path*",
  ],
};
