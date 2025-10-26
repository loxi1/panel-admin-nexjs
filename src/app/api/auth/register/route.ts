import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const cod_usuario = String(body?.cod_usuario ?? "").trim();
    const new_password = String(body?.new_password ?? "");

    if (!cod_usuario || !new_password) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const pool = await getPool();

    // 1) Traer usuario por COD_USUARIO
    const result = await pool
      .request()
      .input("COD", cod_usuario)
      .query(`
        SELECT TOP 1 id, COD_USUARIO, password
        FROM USUARIO WITH (NOLOCK)
        WHERE COD_USUARIO = @COD
      `);

    const user = result.recordset?.[0];
    if (!user) {
      return NextResponse.json({ error: "Usuario no existe" }, { status: 404 });
    }

    // 2) Si ya tiene password definido, bloquea “registro”
    if (user.password && String(user.password).trim() !== "") {
      return NextResponse.json(
        { error: "Este usuario ya configuró contraseña" },
        { status: 409 }
      );
    }

    // 3) Setear nuevo hash
    const hash = await bcrypt.hash(new_password, 10);

    await pool
      .request()
      .input("COD", cod_usuario)
      .input("PASS", hash)
      .query(`
        UPDATE USUARIO
        SET password = @PASS
        -- , first_login_done = 1    -- (si agregas esta columna)
        WHERE COD_USUARIO = @COD
      `);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
