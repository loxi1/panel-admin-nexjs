// middleware.ts (en la raíz del proyecto)
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export async function middleware(req: Request) {
  const url = new URL((req as any).url);
  const path = url.pathname;

  // APIs públicas de auth quedan libres
  if (path.startsWith("/api/auth")) return NextResponse.next();

  const needsAuth = path.startsWith("/(admin)") || path.startsWith("/api");
  if (!needsAuth) return NextResponse.next();

  const token = (req as any).cookies.get?.("auth")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/(auth)/login", url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(SECRET));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/(auth)/login", url));
  }
}

export const config = {
  matcher: ["/(admin)/:path*", "/api/:path*"],
};
