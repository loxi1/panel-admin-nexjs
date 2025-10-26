import DefaultLayout from "@/layout/DefaultLayout";
import PageHeader from "@/components/common/PageHeader";
import { cookies, headers } from "next/headers";

async function getData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value ?? "";

  const hdrs = await headers();
  const host = hdrs.get("host")!;
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const url = `${proto}://${host}/api/usuarios`;

  const res = await fetch(url, {
    headers: { cookie: `auth=${token}` },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`API /api/usuarios ${res.status}`);
  return res.json();
}

export default async function UsuariosPage() {
  const rows: any[] = await getData();

  return (
    <DefaultLayout>
      <PageHeader
        title="Usuarios"
        subtitle="Listado de usuarios del sistema."
        actionsRight={
          <div className="hidden md:block">
            <input
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5"
              placeholder="Buscar por código, nombre, email…"
            />
          </div>
        }
      />

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-0 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 text-gray-500 dark:border-white/10 dark:text-gray-400">
              <tr>
                <th className="px-5 py-3">CÓDIGO</th>
                <th className="px-5 py-3">NOMBRE</th>
                <th className="px-5 py-3">EMAIL</th>
                <th className="px-5 py-3">ROL</th>
                <th className="px-5 py-3">ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u, i) => (
                <tr key={`${u.COD_USUARIO}-${i}`} className="border-b border-gray-50 dark:border-white/5">
                  <td className="px-5 py-3 font-mono">{u.COD_USUARIO}</td>
                  <td className="px-5 py-3">{u.name}</td>
                  <td className="px-5 py-3">{u.email}</td>
                  <td className="px-5 py-3">-</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                      Activo
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                    Sin resultados
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