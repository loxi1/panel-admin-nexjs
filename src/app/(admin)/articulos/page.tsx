import DefaultLayout from "@/layout/DefaultLayout";
import PageHeader from "@/components/common/PageHeader";

async function getData() {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000";
  const res = await fetch(`${base}/api/articulos`, {
    cache: "no-store",
    headers: { "x-req-from": "page" },
  });
  if (!res.ok) throw new Error("Error al cargar artículos");
  return res.json();
}

export default async function ArticulosPage() {
  const data: any[] = await getData();

  return (
    <DefaultLayout>
      <PageHeader title="Artículos" subtitle="Listado desde SQL Server." />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Topbar de tabla */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800 sm:px-6">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {data.length} resultado(s)
          </span>

          <div className="relative">
            <input
              className="h-9 w-72 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none ring-brand-500/20 focus:border-brand-500 focus:ring-4 dark:border-gray-700 dark:bg-transparent dark:text-white"
              placeholder="Buscar por descripción…"
            />
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none text-xs text-gray-400">
              ⌘K
            </span>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/70 dark:bg-white/[0.02]">
              <tr className="text-gray-500 dark:text-gray-400">
                <th className="px-6 py-3 font-medium">FAMILIA</th>
                <th className="px-6 py-3 font-medium">CLASE</th>
                <th className="px-6 py-3 font-medium">SUBCLASE</th>
                <th className="px-6 py-3 font-medium">CÓD. ITEM</th>
                <th className="px-6 py-3 font-medium">STANDARD</th>
                <th className="px-6 py-3 font-medium">DESCRIPCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => (
                <tr
                  key={`${r.COD_ITEM_ARTICULO}-${i}`}
                  className="border-b border-gray-100 last:border-0 dark:border-white/5"
                >
                  <td className="px-6 py-3">{r.DSC_FAMILIA}</td>
                  <td className="px-6 py-3">{r.DSC_CLASE}</td>
                  <td className="px-6 py-3">{r.DSC_SUBCLASE}</td>
                  <td className="px-6 py-3">{r.COD_ITEM_ARTICULO}</td>
                  <td className="px-6 py-3">{r.COD_STANDARD}</td>
                  <td className="px-6 py-3">{r.DESCRIPCION_ARTICULO}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
}
