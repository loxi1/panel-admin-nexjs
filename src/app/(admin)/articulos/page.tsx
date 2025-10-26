// src/app/(admin)/articulos/page.tsx
import DefaultLayout from "@/layout/DefaultLayout";

async function getData() {
  // ✅ relative path => Next envía cookies al API y evita HTML/redirects
  const r = await fetch("/api/articulos", { cache: "no-store" });
  if (!r.ok) return [];
  return r.json();
}

export default async function ArticulosPage() {
  const rows: any[] = await getData();

  return (
    <DefaultLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Artículos</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Listado desde SQL Server.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {rows.length} resultado(s)
          </div>
          <div className="relative w-full sm:w-72">
            <input
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-4 ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white"
              placeholder="Buscar por descripción…"
            />
            <span className="pointer-events-none absolute right-3 top-2.5 text-gray-400">⌘K</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="py-3 pr-4 text-xs font-medium">FAMILIA</th>
                <th className="py-3 pr-4 text-xs font-medium">CLASE</th>
                <th className="py-3 pr-4 text-xs font-medium">SUBCLASE</th>
                <th className="py-3 pr-4 text-xs font-medium">CÓD. ITEM</th>
                <th className="py-3 pr-4 text-xs font-medium">STANDARD</th>
                <th className="py-3 pr-4 text-xs font-medium">DESCRIPCIÓN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {rows.map((r) => (
                <tr key={`${r.COD_ITEM_ARTICULO}-${r.COD_FAMILIA}-${r.COD_CLASE}-${r.COD_SUBCLASE}`}>
                  <td className="py-3 pr-4 text-sm text-gray-700 dark:text-gray-300">{r.DSC_FAMILIA}</td>
                  <td className="py-3 pr-4 text-sm text-gray-700 dark:text-gray-300">{r.DSC_CLASE}</td>
                  <td className="py-3 pr-4 text-sm text-gray-700 dark:text-gray-300">{r.DSC_SUBCLASE}</td>
                  <td className="py-3 pr-4 text-sm text-gray-700 dark:text-gray-300">{r.COD_ITEM_ARTICULO}</td>
                  <td className="py-3 pr-4 text-sm text-gray-700 dark:text-gray-300">{r.COD_STANDARD}</td>
                  <td className="py-3 pr-4 text-sm text-gray-800 dark:text-gray-200">{r.DESCRIPCION_ARTICULO}</td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    Sin datos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
}
