// src/app/(admin)/articulos/page.tsx
import DefaultLayout from "@/layout/DefaultLayout";
import { cookies } from "next/headers";

async function getArticulos() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${base}/api/articulos`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  // Si el middleware te redirige, la respuesta NO es JSON
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    throw new Error("Respuesta no JSON (probable redirección por autenticación).");
  }
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API /articulos ${res.status}: ${txt}`);
  }
  return res.json();
}

export default async function ArticulosPage() {
  const data = await getArticulos();

  return (
    <DefaultLayout>
      <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">Artículos</h1>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <table className="min-w-[960px] w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 dark:bg-white/[0.04] dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Fam</th>
              <th className="px-4 py-3 text-left font-medium">Clase</th>
              <th className="px-4 py-3 text-left font-medium">Subclase</th>
              <th className="px-4 py-3 text-left font-medium">Item</th>
              <th className="px-4 py-3 text-left font-medium">Standard</th>
              <th className="px-4 py-3 text-left font-medium">Descripción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.map((a: any) => (
              <tr
                key={`${a.COD_FAMILIA}-${a.COD_CLASE}-${a.COD_SUBCLASE}-${a.COD_ITEM_ARTICULO}`}
                className="hover:bg-gray-50/60 dark:hover:bg-white/5"
              >
                <td className="px-4 py-3">{a.DSC_FAMILIA}</td>
                <td className="px-4 py-3">{a.DSC_CLASE}</td>
                <td className="px-4 py-3">{a.DSC_SUBCLASE}</td>
                <td className="px-4 py-3 font-mono">{a.COD_ITEM_ARTICULO}</td>
                <td className="px-4 py-3 font-mono">{a.COD_STANDARD}</td>
                <td className="px-4 py-3">{a.DESCRIPCION_ARTICULO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DefaultLayout>
  );
}