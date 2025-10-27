// src/app/api/articulos/route.ts
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await verifyJwt(token);

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const pageSize = [5, 10, 25, 50].includes(Number(searchParams.get("pageSize")))
    ? Number(searchParams.get("pageSize"))
    : 10;
  const q = (searchParams.get("q") || "").trim();
  const sort = (searchParams.get("sort") || "descripcion").toLowerCase();
  const order: "ASC" | "DESC" = (searchParams.get("order") || "asc").toLowerCase() === "desc" ? "DESC" : "ASC";

  // Mapeo seguro (evita inyección)
  const sortExprMap: Record<string, string> = {
    // expresiones (funciones) son válidas en ORDER BY
    familia: "DBO.F_DES_FAMILIA(COD_FAMILIA,1)",
    clase: "DBO.F_DES_CLASE(COD_FAMILIA,COD_CLASE,1)",
    subclase: "DBO.F_DES_SUBCLASE(COD_FAMILIA,COD_CLASE,COD_SUBCLASE,1)",
    item: "COD_ITEM_ARTICULO",
    standard: "COD_STANDARD",
    // <- la que te daba error:
    descripcion: "DESCRIPCION_ARTICULO",
  };
  const orderExpr = sortExprMap[sort] ?? sortExprMap["descripcion"];
  const start = (page - 1) * pageSize + 1;
  const end = page * pageSize;

  const where = q ? "AND DESCRIPCION_ARTICULO LIKE @Q" : "";

  const sql = `
    WITH base AS (
      SELECT
        COD_FAMILIA,
        DBO.F_DES_FAMILIA(COD_FAMILIA,1) AS DSC_FAMILIA,
        COD_CLASE,
        DBO.F_DES_CLASE(COD_FAMILIA,COD_CLASE,1) AS DSC_CLASE,
        COD_SUBCLASE,
        DBO.F_DES_SUBCLASE(COD_FAMILIA,COD_CLASE,COD_SUBCLASE,1) AS DSC_SUBCLASE,
        COD_ITEM_ARTICULO,
        COD_STANDARD,
        DESCRIPCION_ARTICULO,
        ROW_NUMBER() OVER (ORDER BY ${orderExpr} ${order}) AS rn
      FROM ARTICULO WITH (NOLOCK)
      WHERE 1=1
        ${where}
    )
    SELECT
      COD_FAMILIA AS cod_familia,
      DSC_FAMILIA AS dsc_familia,
      COD_CLASE AS cod_clase,
      DSC_CLASE AS dsc_clase,
      COD_SUBCLASE AS cod_subclase,
      DSC_SUBCLASE AS dsc_subclase,
      COD_ITEM_ARTICULO AS cod_item_articulo,
      COD_STANDARD AS cod_standard,
      DESCRIPCION_ARTICULO AS descripcion
    FROM base
    WHERE rn BETWEEN @START AND @END;

    SELECT COUNT(1) AS total
    FROM ARTICULO WITH (NOLOCK)
    WHERE 1=1
      ${where};
  `;

  const pool = await getPool();
  const reqDb = pool.request();
  if (q) reqDb.input("Q", `%${q}%`);
  reqDb.input("START", start);
  reqDb.input("END", end);

  const rs = await reqDb.query(sql);
  const items = rs.recordsets[0] ?? [];
  const total = rs.recordsets[1]?.[0]?.total ?? 0;

  return NextResponse.json({ items, total, page, pageSize });
}
