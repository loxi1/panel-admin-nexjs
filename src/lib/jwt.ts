import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const alg = 'HS256';

export async function signJwt(payload: object, expires = process.env.JWT_EXPIRES || '1d') {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(secret);
}

export async function verifyJwt<T = any>(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as T;
}
