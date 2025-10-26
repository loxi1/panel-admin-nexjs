// src/app/api/articulos/route.ts
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
    SELECT TOP 50
      COD_FAMILIA AS COD_FAMILIA,
      DBO.F_DES_FAMILIA(COD_FAMILIA,1) AS DSC_FAMILIA,
      COD_CLASE AS COD_CLASE,
      DBO.F_DES_CLASE(COD_FAMILIA,COD_CLASE,1) AS DSC_CLASE,
      COD_SUBCLASE AS COD_SUBCLASE,
      DBO.F_DES_SUBCLASE(COD_FAMILIA,COD_CLASE,COD_SUBCLASE,1) AS DSC_SUBCLASE,
      COD_ITEM_ARTICULO AS COD_ITEM_ARTICULO,
      COD_STANDARD AS COD_STANDARD,
      DESCRIPCION_ARTICULO
    FROM dbo.ARTICULO WITH (NOLOCK)
    WHERE COD_FAMILIA IN (1)
    ORDER BY 1,3,5,7
  `);

  return NextResponse.json(rs.recordset ?? []);
}
