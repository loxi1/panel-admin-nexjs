// src/lib/auth-session.ts
import "server-only";
import { cookies } from "next/headers";
import { jwtVerify, type JWTPayload } from "jose";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export type SessionUser = {
  cod: string;
  sub?: string | number;
  rol?: string | number;
};

type AppJwtPayload = JWTPayload & {
  sub?: string | number;
  cod?: string;
  rol?: string | number;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET));
    const p = payload as AppJwtPayload;
    const cod =
      p.cod ?? (typeof p.sub === "string" ? p.sub : p.sub != null ? String(p.sub) : "");

    if (!cod) return null;
    return { cod, sub: p.sub, rol: p.rol };
  } catch {
    return null;
  }
}