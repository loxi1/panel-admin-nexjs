import DefaultLayout from "@/layout/DefaultLayout";
import PageHeader from "@/components/common/PageHeader";

async function getData() {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000";
  const res = await fetch(`${base}/api/usuarios`, {
    cache: "no-store",
    headers: { "x-req-from": "page" },
  });
  if (!res.ok) throw new Error("Error al cargar usuarios");
  return res.json();
}

export default async function UsuariosPage() {
  const rows: any[] = await getData();

  return (
    <DefaultLayout>
      <PageHeader title="Usuarios" subtitle="Listado de usuarios del sistema." />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800 sm:px-6">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {rows.length} usuario(s)
          </span>
          <div className="relative">
            <input
              className="h-9 w-72 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none ring-brand-500/20 focus:border-brand-500 focus:ring-4 dark:border-gray-700 dark:bg-transparent dark:text-white"
              placeholder="Buscar por código, nombre, email…"
            />
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none text-xs text-gray-400">
              ⌘K
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/70 dark:bg-white/[0.02]">
              <tr className="text-gray-500 dark:text-gray-400">
                <th className="px-6 py-3 font-medium">CÓDIGO</th>
                <th className="px-6 py-3 font-medium">NOMBRE</th>
                <th className="px-6 py-3 font-medium">EMAIL</th>
                <th className="px-6 py-3 font-medium">ROL</th>
                <th className="px-6 py-3 font-medium">ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 last:border-0 dark:border-white/5">
                  <td className="px-6 py-3">{u.cod}</td>
                  <td className="px-6 py-3">{u.name}</td>
                  <td className="px-6 py-3">{u.email}</td>
                  <td className="px-6 py-3">-</td>
                  <td className="px-6 py-3">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                      Activo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
}
