// SERVER COMPONENT
import DefaultLayout from "@/layout/DefaultLayout";
import PageHeader from "@/components/common/PageHeader";
import { getPool } from "@/lib/db";

export const revalidate = 120; // cache de página 2 min

async function getData() {
  const pool = await getPool();
  const rs = await pool.request().query(`
    SELECT TOP 200
      DBO.F_DES_FAMILIA(COD_FAMILIA,1)                   AS familia,
      DBO.F_DES_CLASE(COD_FAMILIA,COD_CLASE,1)           AS clase,
      DBO.F_DES_SUBCLASE(COD_FAMILIA,COD_CLASE,COD_SUBCLASE,1) AS subclase,
      COD_ITEM_ARTICULO                                   AS codItem,
      COD_STANDARD                                        AS standard,
      DESCRIPCION_ARTICULO                                AS descripcion
    FROM dbo.ARTICULO WITH (NOLOCK)
    ORDER BY COD_FAMILIA, COD_CLASE, COD_SUBCLASE, COD_ITEM_ARTICULO
  `);
  return rs.recordset as Array<{
    familia: string; clase: string; subclase: string;
    codItem: number; standard: string; descripcion: string;
  }>;
}

export default async function ArticulosPage() {
  const rows = await getData();

  return (
    <DefaultLayout>
      <PageHeader
        title="Artículos"
        subtitle="Listado desde SQL Server."
        actions={<div className="hidden sm:block text-gray-400 text-sm">{rows.length} resultado(s)</div>}
      />
      <div className="rounded-2xl border border-gray-200 bg-white/70 p-0.5 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-500 dark:text-gray-400">
              <tr className="[&>th]:px-5 [&>th]:py-3">
                <th>FAMILIA</th><th>CLASE</th><th>SUBCLASE</th><th>CÓD. ITEM</th><th>STANDARD</th><th>DESCRIPCIÓN</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-white/90">
              {rows.map((a, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-white/5">
                  <td className="px-5 py-3">{a.familia}</td>
                  <td className="px-5 py-3">{a.clase}</td>
                  <td className="px-5 py-3">{a.subclase}</td>
                  <td className="px-5 py-3">{a.codItem}</td>
                  <td className="px-5 py-3">{a.standard}</td>
                  <td className="px-5 py-3">{a.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
}
