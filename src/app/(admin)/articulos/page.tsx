import DefaultLayout from "@/layout/DefaultLayout";

type Articulo = {
  COD_FAMILIA: number;
  DSC_FAMILIA: string;
  COD_CLASE: number;
  DSC_CLASE: string;
  COD_SUBCLASE: number;
  DSC_SUBCLASE: string;
  COD_ITEM_ARTICULO: number;
  COD_STANDARD: string | null;
  DESCRIPCION_ARTICULO: string;
};

async function getData(): Promise<Articulo[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/articulos`, {
    method: "GET",
    cache: "no-store",
    // cookies HTTPOnly via fetch del servidor -> se envían solas
  });
  if (!res.ok) throw new Error("No se pudo cargar artículos");
  return res.json();
}

export default async function ArticulosPage() {
  const data = await getData();

  return (
    <DefaultLayout>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Artículos</h1>
        <p className="text-gray-500 dark:text-gray-400">Listado desde SQL Server.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
        <table className="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-50 text-gray-600 dark:bg-white/5 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Familia</th>
              <th className="px-4 py-3">Clase</th>
              <th className="px-4 py-3">Subclase</th>
              <th className="px-4 py-3">Cód. Item</th>
              <th className="px-4 py-3">Standard</th>
              <th className="px-4 py-3">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={`${r.COD_ITEM_ARTICULO}-${i}`} className="border-t border-gray-100 dark:border-white/10">
                <td className="px-4 py-2">{r.DSC_FAMILIA}</td>
                <td className="px-4 py-2">{r.DSC_CLASE}</td>
                <td className="px-4 py-2">{r.DSC_SUBCLASE}</td>
                <td className="px-4 py-2 font-mono">{r.COD_ITEM_ARTICULO}</td>
                <td className="px-4 py-2">{r.COD_STANDARD ?? "-"}</td>
                <td className="px-4 py-2">{r.DESCRIPCION_ARTICULO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DefaultLayout>
  );
}
