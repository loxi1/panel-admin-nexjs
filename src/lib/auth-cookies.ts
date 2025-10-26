"use server";
import { cookies } from "next/headers";

/** Guarda el JWT en una cookie httpOnly */
export async function setAuthCookie(token: string) {
  const jar = await cookies();
  jar.set("auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 día
  });
}

/** Borra la cookie de sesión */
export async function clearAuthCookie() {
  const jar = await cookies();
  jar.set("auth", "", { path: "/", maxAge: 0 });
}

/** Lee el JWT desde la cookie (o null) */
export async function getAuthCookie(): Promise<string | null> {
  const jar = await cookies();
  return jar.get("auth")?.value ?? null;
}
