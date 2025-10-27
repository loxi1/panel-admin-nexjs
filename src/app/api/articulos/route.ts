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
  const order: "ASC" | "DESC" =
    (searchParams.get("order") || "asc").toLowerCase() === "desc" ? "DESC" : "ASC";

  // Mapeo seguro para ORDER BY
  const sortExprMap: Record<string, string> = {
    familia: "DBO.F_DES_FAMILIA(COD_FAMILIA,1)",
    clase: "DBO.F_DES_CLASE(COD_FAMILIA,COD_CLASE,1)",
    subclase: "DBO.F_DES_SUBCLASE(COD_FAMILIA,COD_CLASE,COD_SUBCLASE,1)",
    item: "COD_ITEM_ARTICULO",
    standard: "COD_STANDARD",
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
      COD_FAMILIA AS COD_FAMILIA,
      DSC_FAMILIA AS DSC_FAMILIA,
      COD_CLASE AS COD_CLASE,
      DSC_CLASE AS DSC_CLASE,
      COD_SUBCLASE AS COD_SUBCLASE,
      DSC_SUBCLASE AS DSC_SUBCLASE,
      COD_ITEM_ARTICULO AS COD_ITEM_ARTICULO,
      COD_STANDARD AS COD_STANDARD,
      DESCRIPCION_ARTICULO AS DESCRIPCION_ARTICULO
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

  // 🔧 Fix de tipos (TS) al leer recordsets
  const items = ((rs as unknown as { recordsets?: unknown[][]; recordset?: unknown[] }).recordsets?.[0]
    ?? (rs as unknown as { recordset?: unknown[] }).recordset
    ?? []) as unknown[];

  const total = Number(
    (rs as unknown as { recordsets?: Array<Array<{ total?: number }>> }).recordsets?.[1]?.[0]?.total ?? 0
  );

  return NextResponse.json({ items, total, page, pageSize });
}