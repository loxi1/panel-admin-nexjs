// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { cod_usuario, new_password } = await req.json();
    if (!cod_usuario || !new_password) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const pool = await getPool();

    const result = await pool.request()
      .input('COD', cod_usuario)
      .query(`
        SELECT TOP 1 id, COD_USUARIO, password
        FROM USUARIO WITH (NOLOCK)
        WHERE COD_USUARIO = @COD
      `);

    const user = result.recordset[0];
    if (!user) {
      return NextResponse.json({ error: 'Usuario no existe' }, { status: 404 });
    }

    if (user.password && String(user.password).trim() !== '') {
      return NextResponse.json({ error: 'Este usuario ya configuró contraseña' }, { status: 409 });
    }

    const hash = await bcrypt.hash(new_password, 10);

    await pool.request()
      .input('COD', cod_usuario)
      .input('PASS', hash)
      .query(`
        UPDATE USUARIO
        SET password = @PASS
        WHERE COD_USUARIO = @COD
      `);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[REGISTER] Error:', err);
    const msg = process.env.NODE_ENV !== 'production' ? String(err?.message || err) : 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
