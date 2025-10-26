// src/app/(admin)/articulos/page.tsx
import React from "react";

async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/articulos`, {
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) throw new Error("No se pudo cargar Artículos");
  return res.json() as Promise<any[]>;
}

export default async function ArticulosPage() {
  const rows = await getData();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Artículos</h1>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03]">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/40">
            <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th]:font-semibold">
              <th>Familia</th>
              <th>Clase</th>
              <th>Subclase</th>
              <th>Item</th>
              <th>Standard</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/80 dark:divide-gray-800/80">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50/70 dark:hover:bg-white/5">
                <td className="px-4 py-2">{r.DSC_FAMILIA}</td>
                <td className="px-4 py-2">{r.DSC_CLASE}</td>
                <td className="px-4 py-2">{r.DSC_SUBCLASE}</td>
                <td className="px-4 py-2 tabular-nums">{r.COD_ITEM_ARTICULO}</td>
                <td className="px-4 py-2">{r.COD_STANDARD}</td>
                <td className="px-4 py-2">{r.DESCRIPCION_ARTICULO}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500 dark:text-gray-400" colSpan={6}>
                  Sin registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
