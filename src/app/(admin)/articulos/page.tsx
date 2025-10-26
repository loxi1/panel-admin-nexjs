// SERVER COMPONENT – DataTable estilo TailAdmin
import DefaultLayout from "@/layout/DefaultLayout";
import PageHeader from "@/components/common/PageHeader";
import { getPool } from "@/lib/db";
import TableToolbar from "./table-toolbar"; // <- componente cliente (abajo)
import Link from "next/link";

type SearchParams = {
  page?: string;
  pageSize?: string;
  q?: string;
  sort?: string;
  order?: "asc" | "desc";
};

type Row = {
  familia: string;
  clase: string;
  subclase: string;
  codItem: number;
  standard: string | null;
  descripcion: string;
};

export const revalidate = 30; // cache suave; pon 0 si necesitas “tiempo real”

function parseParams(sp: SearchParams) {
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const pageSize = [5, 10, 25, 50].includes(Number(sp.pageSize)) ? Number(sp.pageSize) : 10;
  const q = (sp.q ?? "").trim();
  const sortWhitelist = new Map([
    ["familia", "familia"],
    ["clase", "clase"],
    ["subclase", "subclase"],
    ["codItem", "codItem"],
    ["standard", "standard"],
    ["descripcion", "descripcion"],
  ]);
  const sortKey = sortWhitelist.get((sp.sort ?? "").toLowerCase()) ?? "descripcion";
  const order: "ASC" | "DESC" = (sp.order ?? "asc").toLowerCase() === "desc" ? "DESC" : "ASC";
  return { page, pageSize, q, sortKey, order };
}

async function getData({ page, pageSize, q, sortKey, order }: ReturnType<typeof parseParams>) {
  const pool = await getPool();

  // SQL Server 2008: paginación con ROW_NUMBER()
  // Búsqueda simple sobre DESCRIPCION_ARTICULO y COD_STANDARD (ajustable).
  const where = q
    ? "WHERE (A.DESCRIPCION_ARTICULO LIKE @Q OR A.COD_STANDARD LIKE @Q)"
    : "";

  const sortSql = {
    familia: "familia",
    clase: "clase",
    subclase: "subclase",
    codItem: "codItem",
    standard: "standard",
    descripcion: "descripcion",
  }[sortKey] as string;

  const start = (page - 1) * pageSize + 1;
  const finish = page * pageSize;

  const qry = `
;WITH CTE AS (
  SELECT
    DBO.F_DES_FAMILIA(A.COD_FAMILIA,1)                              AS familia,
    DBO.F_DES_CLASE(A.COD_FAMILIA,A.COD_CLASE,1)                    AS clase,
    DBO.F_DES_SUBCLASE(A.COD_FAMILIA,A.COD_CLASE,A.COD_SUBCLASE,1)  AS subclase,
    A.COD_ITEM_ARTICULO                                             AS codItem,
    A.COD_STANDARD                                                  AS standard,
    A.DESCRIPCION_ARTICULO                                          AS descripcion,
    ROW_NUMBER() OVER (ORDER BY ${sortSql} ${order})                AS rn
  FROM dbo.ARTICULO A WITH (NOLOCK)
  ${where}
)
SELECT * FROM CTE WHERE rn BETWEEN @START AND @FIN;

SELECT COUNT(1) AS total
FROM dbo.ARTICULO A WITH (NOLOCK)
${where};
`;

  const req = pool.request();
  if (q) req.input("Q", `%${q}%`);
  req.input("START", start).input("FIN", finish);

  const rs = await req.query(qry);
  const rows = rs.recordsets[0] as Row[];
  const total = (rs.recordsets[1]?.[0]?.total as number) ?? 0;

  return { rows, total };
}

export default async function ArticulosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page, pageSize, q, sortKey, order } = parseParams(searchParams);
  const { rows, total } = await getData({ page, pageSize, q, sortKey, order });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const cols: Array<{ key: keyof Row; label: string; align?: "left" | "right" }> = [
    { key: "familia", label: "FAMILIA" },
    { key: "clase", label: "CLASE" },
    { key: "subclase", label: "SUBCLASE" },
    { key: "codItem", label: "CÓD. ITEM" },
    { key: "standard", label: "STANDARD" },
    { key: "descripcion", label: "DESCRIPCIÓN" },
  ];

  const makeQS = (p: Partial<SearchParams>) => {
    const params = new URLSearchParams({
      page: String(p.page ?? page),
      pageSize: String(p.pageSize ?? pageSize),
      q: String(p.q ?? q),
      sort: String(p.sort ?? sortKey),
      order: String(p.order ?? order.toLowerCase()),
    });
    return `/articulos?${params.toString()}`;
  };

  return (
    <DefaultLayout>
      <PageHeader
        title="Artículos"
        subtitle="Listado desde SQL Server."
        // Botón de logout ya está en AppHeader
      />

      {/* Toolbar estilo TailAdmin */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Mostrando <span className="font-medium text-gray-700 dark:text-white/90">{rows.length}</span> de{" "}
          <span className="font-medium text-gray-700 dark:text-white/90">{total}</span>{" "}
          {total === 1 ? "registro" : "registros"}
        </div>

        <TableToolbar
          defaultQuery={q}
          defaultPageSize={pageSize}
          onChange={({ query, pageSize }) => makeQS({ q: query, page: 1, pageSize })}
        />
      </div>

      {/* Tabla */}
      <div className="rounded-2xl border border-gray-200 bg-white/70 p-0.5 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-500 dark:text-gray-400">
              <tr className="[&>th]:px-5 [&>th]:py-3">
                {cols.map((c) => {
                  const isSorted = c.key === (sortKey as keyof Row);
                  const nextOrder = isSorted && order === "ASC" ? "desc" : "asc";
                  return (
                    <th key={String(c.key)} className={c.align === "right" ? "text-right" : ""}>
                      <Link
                        href={makeQS({ sort: String(c.key), order: nextOrder, page: 1 })}
                        className={`inline-flex items-center gap-1 hover:text-brand-600 ${
                          isSorted ? "text-brand-600" : ""
                        }`}
                      >
                        {c.label}
                        <span className="text-xs">{isSorted ? (order === "ASC" ? "▲" : "▼") : "↕"}</span>
                      </Link>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-white/90">
              {rows.map((a, i) => (
                <tr key={`${a.codItem}-${i}`} className="border-t border-gray-100 dark:border-white/5">
                  <td className="px-5 py-3">{a.familia}</td>
                  <td className="px-5 py-3">{a.clase}</td>
                  <td className="px-5 py-3">{a.subclase}</td>
                  <td className="px-5 py-3">{a.codItem}</td>
                  <td className="px-5 py-3">{a.standard ?? "-"}</td>
                  <td className="px-5 py-3">{a.descripcion}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={cols.length} className="px-5 py-10 text-center text-gray-400">
                    Sin resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Página {page} de {totalPages}
          </div>
          <div className="flex gap-2">
            <Link
              href={makeQS({ page: Math.max(1, page - 1) })}
              aria-disabled={page <= 1}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                page <= 1
                  ? "cursor-not-allowed border-gray-200 text-gray-400 dark:border-white/10 dark:text-white/30"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-white/90 dark:hover:bg-white/[0.06]"
              }`}
            >
              Anterior
            </Link>
            <Link
              href={makeQS({ page: Math.min(totalPages, page + 1) })}
              aria-disabled={page >= totalPages}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                page >= totalPages
                  ? "cursor-not-allowed border-gray-200 text-gray-400 dark:border-white/10 dark:text-white/30"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-white/90 dark:hover:bg-white/[0.06]"
              }`}
            >
              Siguiente
            </Link>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
