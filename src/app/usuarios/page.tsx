import DefaultLayout from "@/layout/DefaultLayout";

async function getData() {
  // ✅ relative path para que se envíen cookies al API
  const r = await fetch("/api/usuarios", { cache: "no-store" });
  if (!r.ok) return [];
  return r.json();
}

export default async function UsuariosPage() {
  const rows: any[] = await getData();

  return (
    <DefaultLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Usuarios</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Listado de usuarios del sistema.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {rows.length} usuario(s)
          </div>
          <div className="relative w-full sm:w-72">
            <input
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-4 ring-brand-500/20 dark:border-gray-700 dark:bg-transparent dark:text-white"
              placeholder="Buscar por código, nombre, email…"
            />
            <span className="pointer-events-none absolute right-3 top-2.5 text-gray-400">⌘K</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <th className="py-3 pr-4 text-xs font-medium">CÓDIGO</th>
                <th className="py-3 pr-4 text-xs font-medium">NOMBRE</th>
                <th className="py-3 pr-4 text-xs font-medium">EMAIL</th>
                <th className="py-3 pr-4 text-xs font-medium">ROL</th>
                <th className="py-3 pr-4 text-xs font-medium">ESTADO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {rows.map((u) => (
                <tr key={u.COD_USUARIO}>
                  <td className="py-3 pr-4 text-sm text-gray-700 dark:text-gray-300">{u.COD_USUARIO}</td>
                  <td className="py-3 pr-4 text-sm text-gray-800 dark:text-gray-200">
                    {u.name ?? `${u.PRIMER_NOMBRE ?? ""} ${u.APELLIDO_PATERNO ?? ""}`.trim()}
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-700 dark:text-gray-300">{u.email ?? u.CORREO_ELECTRONICO}</td>
                  <td className="py-3 pr-4 text-sm text-gray-700 dark:text-gray-300">{u.rol ?? u.rol_id ?? "-"}</td>
                  <td className="py-3 pr-4 text-sm">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                      (u.COD_ESTADO_REGISTRO ?? 1) === 1
                        ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300"
                        : "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300"
                    }`}>
                      {(u.COD_ESTADO_REGISTRO ?? 1) === 1 ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    Sin usuarios.
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
