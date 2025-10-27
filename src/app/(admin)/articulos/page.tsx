// src/app/(admin)/articulos/page.tsx
import DefaultLayout from "@/layout/DefaultLayout";
import PageHeader from "@/components/common/PageHeader";
import Link from "next/link";
import { headers } from "next/headers";

type SearchParams = Record<string, string | string[] | undefined>;

function parseParams(sp: Record<string, string | undefined>) {
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const pageSize = [5, 10, 25, 50].includes(Number(sp.pageSize))
    ? Number(sp.pageSize)
    : 10;
  const q = (sp.q ?? "").trim();

  // claves “amigables” que llegan desde la UI
  const sortWhitelist = new Map([
    ["familia", "familia"],
    ["clase", "clase"],
    ["subclase", "subclase"],
    ["item", "item"],
    ["standard", "standard"],
    ["descripcion", "descripcion"], // <- mapearemos en la API a columna real
  ]);
  const sortKey = sortWhitelist.get((sp.sort ?? "").toLowerCase()) ?? "descripcion";
  const order: "ASC" | "DESC" =
    (sp.order ?? "asc").toLowerCase() === "desc" ? "DESC" : "ASC";

  return { page, pageSize, q, sortKey, order };
}

async function getData(params: {
  page: number;
  pageSize: number;
  q: string;
  sortKey: string;
  order: "ASC" | "DESC";
}) {
  const h = await headers();
  const host = h.get("host")!;
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const url = new URL(`${protocol}://${host}/api/articulos`);
  url.searchParams.set("page", String(params.page));
  url.searchParams.set("pageSize", String(params.pageSize));
  if (params.q) url.searchParams.set("q", params.q);
  url.searchParams.set("sort", params.sortKey);
  url.searchParams.set("order", params.order);

  const r = await fetch(url.toString(), { cache: "no-store" });
  if (!r.ok) throw new Error(`API error ${r.status}`);
  return (await r.json()) as {
    items: any[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export default async function ArticulosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>; // <- en Next 15 es promesa
}) {
  const spObj = Object.fromEntries(Object.entries(await searchParams).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
  const { page, pageSize, q, sortKey, order } = parseParams(spObj);
  const { items, total } = await getData({ page, pageSize, q, sortKey, order });

  return (
    <DefaultLayout>
      <PageHeader
        title="Artículos"
        subtitle="Listado desde SQL Server."
        right={<Link href="/dashboard" className="text-sm text-gray-500 hover:underline">Volver al dashboard</Link>}
      />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs uppercase text-gray-500 dark:text-gray-400">
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="px-6 py-3">Familia</th>
                <th className="px-6 py-3">Clase</th>
                <th className="px-6 py-3">Subclase</th>
                <th className="px-6 py-3">Cód. Item</th>
                <th className="px-6 py-3">Standard</th>
                <th className="px-6 py-3">Descripción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
              {items.map((it) => (
                <tr key={`${it.cod_item_articulo}-${it.cod_standard}`}>
                  <td className="px-6 py-3">{it.dsc_familia}</td>
                  <td className="px-6 py-3">{it.dsc_clase}</td>
                  <td className="px-6 py-3">{it.dsc_subclase}</td>
                  <td className="px-6 py-3">{it.cod_item_articulo}</td>
                  <td className="px-6 py-3">{it.cod_standard}</td>
                  <td className="px-6 py-3">{it.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
          <span>
            {items.length} de {total} resultado(s)
          </span>
          {/* botones de paginación (simple) */}
          <div className="space-x-2">
            <Link
              href={`/articulos?page=${Math.max(1, page - 1)}&pageSize=${pageSize}&q=${encodeURIComponent(q)}&sort=${sortKey}&order=${order}`}
              className="rounded-md border px-3 py-1 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
            >
              Anterior
            </Link>
            <Link
              href={`/articulos?page=${page + 1}&pageSize=${pageSize}&q=${encodeURIComponent(q)}&sort=${sortKey}&order=${order}`}
              className="rounded-md border px-3 py-1 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
            >
              Siguiente
            </Link>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
