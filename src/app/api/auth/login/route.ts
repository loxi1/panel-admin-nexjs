// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signJwt } from '@/lib/jwt';
import { setAuthCookie } from '@/lib/auth-cookies';

export async function POST(req: Request) {
  const { cod_usuario, password } = await req.json();
  if (!cod_usuario || !password) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
  }

  const pool = await getPool();
  const rs = await pool.request()
    .input('COD', cod_usuario)
    .query(`
      SELECT TOP 1
        COD_USUARIO,
        PASSWORD_HASH,
        APELLIDO_PATERNO,
        APELLIDO_MATERNO,
        PRIMER_NOMBRE,
        SEGUNDO_NOMBRE,
        CORREO_ELECTRONICO
      FROM dbo.USUARIO WITH (NOLOCK)
      WHERE COD_USUARIO = @COD
    `);

  const u = rs.recordset[0];
  if (!u || !u.PASSWORD_HASH) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, String(u.PASSWORD_HASH));
  if (!ok) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  }

  const displayName = [
    u.PRIMER_NOMBRE,
    u.SEGUNDO_NOMBRE,
    u.APELLIDO_PATERNO,
    u.APELLIDO_MATERNO
  ].filter(Boolean).join(' ');

  // sub = COD_USUARIO como identificador
  const token = await signJwt({
    sub: u.COD_USUARIO,
    cod: u.COD_USUARIO,
    rol: u.ROL_ID ?? "user",
  });

  // cookie httpOnly
  await setAuthCookie(token);

  // marca last login
  await pool.request()
    .input('COD', u.COD_USUARIO)
    .query(`UPDATE dbo.USUARIO SET LAST_LOGIN_AT = GETDATE(), FEC_UPDATE = GETDATE() WHERE COD_USUARIO = @COD`);

  return NextResponse.json({
    ok: true,
    user: {
      cod: u.COD_USUARIO,
      name: displayName || u.COD_USUARIO,
      email: u.CORREO_ELECTRONICO || null
    }
  });
}
