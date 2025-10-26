import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const cod_usuario = String(body?.cod_usuario ?? "").trim();
    const password = String(body?.password ?? "");

    if (!cod_usuario || !password) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const pool = await getPool();
    const rs = await pool
      .request()
      .input("COD", cod_usuario)
      .query(`
        SELECT TOP 1 id, COD_USUARIO, name, email, rol_id, password
        FROM USUARIO WITH (NOLOCK)
        WHERE COD_USUARIO = @COD
      `);

    const u = rs.recordset?.[0];
    if (!u || !u.password) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, String(u.password));
    if (!ok) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const token = await signJwt({
      sub: String(u.id),
      cod: String(u.COD_USUARIO),
      rol: Number(u.rol_id ?? 0),
    });

    const res = NextResponse.json({
      ok: true,
      user: { id: u.id, cod: u.COD_USUARIO, name: u.name, email: u.email },
    });

    // Set cookie de forma directa en la respuesta (route handler)
    res.cookies.set("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 día
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
