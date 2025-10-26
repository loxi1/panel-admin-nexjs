// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { cod_usuario, new_password } = await req.json();
  if (!cod_usuario || !new_password) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
  }

  const pool = await getPool();

  const rs = await pool.request()
    .input('COD', cod_usuario)
    .query(`
      SELECT TOP 1 COD_USUARIO, PASSWORD_HASH
      FROM dbo.USUARIO WITH (NOLOCK)
      WHERE COD_USUARIO = @COD
    `);

  const u = rs.recordset[0];
  if (!u) return NextResponse.json({ error: 'Usuario no existe' }, { status: 404 });

  if (u.PASSWORD_HASH && String(u.PASSWORD_HASH).trim() !== '') {
    return NextResponse.json({ error: 'Este usuario ya configuró contraseña' }, { status: 409 });
  }

  const hash = await bcrypt.hash(new_password, 10);

  await pool.request()
    .input('COD', cod_usuario)
    .input('HASH', hash)
    .query(`
      UPDATE dbo.USUARIO
      SET PASSWORD_HASH = @HASH,
          NEEDS_PASSWORD_MIG = 0,
          FIRST_LOGIN = 0,
          PASSWORD_SET_AT = GETDATE(),
          FEC_UPDATE = GETDATE()
      WHERE COD_USUARIO = @COD
    `);

  return NextResponse.json({ ok: true });
}
