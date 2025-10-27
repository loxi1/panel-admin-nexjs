import { SignJWT, jwtVerify, JWTPayload } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");

export type AppJwtPayload = JWTPayload & {
  sub: string | number;
  cod: string;
  rol: string | number;
};

export async function signJwt(payload: AppJwtPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(SECRET);
}

export async function verifyJwt(token: string): Promise<AppJwtPayload> {
  const { payload } = await jwtVerify(token, SECRET);
  return payload as AppJwtPayload;
}
