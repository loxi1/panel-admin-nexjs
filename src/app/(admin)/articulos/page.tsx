import PageHeader from "@/components/common/PageHeader";
import { cookies, headers } from "next/headers";

async function getData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value ?? "";
  const hdrs = await headers();
  const host = hdrs.get("host")!;
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const url = `${proto}://${host}/api/articulos`;
  const res = await fetch(url, { headers: { cookie: `auth=${token}` }, cache: "no-store" });
  if (!res.ok) throw new Error(`API /api/articulos ${res.status}`);
  return res.json();
}

export default async function ArticulosPage() {
  const data: any[] = await getData();

  return (
    <>
      <PageHeader
        title="Artículos"
        subtitle="Listado desde SQL Server."
        actionsRight={
          <form className="hidden md:block">
            <input
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5"
              placeholder="Buscar por descripción…"
            />
          </form>
        }
      />

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-0 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 text-gray-500 dark:border-white/10 dark:text-gray-400">
              <tr>
                <th className="px-5 py-3">FAMILIA</th>
                <th className="px-5 py-3">CLASE</th>
                <th className="px-5 py-3">SUBCLASE</th>
                <th className="px-5 py-3">CÓD. ITEM</th>
                <th className="px-5 py-3">STANDARD</th>
                <th className="px-5 py-3">DESCRIPCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => (
                <tr key={`${r.COD_ITEM_ARTICULO}-${i}`} className="border-b border-gray-50 dark:border-white/5">
                  <td className="px-5 py-3">{r.DSC_FAMILIA}</td>
                  <td className="px-5 py-3">{r.DSC_CLASE}</td>
                  <td className="px-5 py-3">{r.DSC_SUBCLASE}</td>
                  <td className="px-5 py-3">{r.COD_ITEM_ARTICULO}</td>
                  <td className="px-5 py-3">{r.COD_STANDARD}</td>
                  <td className="px-5 py-3">{r.DESCRIPCION_ARTICULO}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                    Sin resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}