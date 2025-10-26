import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await verifyJwt(token);

  const pool = await getPool();
  const rs = await pool.request().query(`
    SELECT TOP 200
      COD_USUARIO,
      PRIMER_NOMBRE,
      SEGUNDO_NOMBRE,
      APELLIDO_PATERNO,
      APELLIDO_MATERNO,
      CORREO_ELECTRONICO,
      COD_ESTADO_REGISTRO
    FROM dbo.USUARIO WITH (NOLOCK)
    ORDER BY COD_USUARIO
  `);

  return NextResponse.json(rs.recordset ?? []);
}
