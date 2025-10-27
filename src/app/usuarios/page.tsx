// src/app/usuarios/page.tsx
import DefaultLayout from "@/layout/DefaultLayout";
import PageHeader from "@/components/common/PageHeader";
import { getPool } from "@/lib/db";

// Revalida cada 60s (si no necesitas “tiempo real”)
export const revalidate = 60;

type Usuario = {
  cod: string;
  nombre: string;
  email: string;
  activo: number;
};

async function getData(): Promise<Usuario[]> {
  const pool = await getPool();
  const rs = await pool.request().query(`
    SELECT TOP 200
      COD_USUARIO     AS cod,
      (PRIMER_NOMBRE + ' ' + APELLIDO_PATERNO) AS nombre,
      CORREO_ELECTRONICO AS email,
      1 AS activo
    FROM dbo.USUARIO WITH (NOLOCK)
    ORDER BY COD_USUARIO ASC
  `);
  return rs.recordset as Usuario[];
}

export default async function UsuariosPage() {
  const rows = await getData();

  return (
    <DefaultLayout>
      <PageHeader
        title="Usuarios"
        subtitle="Listado de usuarios del sistema."
        right={<div className="hidden sm:block text-gray-400 text-sm">{rows.length} usuario(s)</div>}
      />

      <div className="rounded-2xl border border-gray-200 bg-white/70 p-0.5 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-500 dark:text-gray-400">
              <tr className="[&>th]:px-5 [&>th]:py-3">
                <th>CÓDIGO</th>
                <th>NOMBRE</th>
                <th>EMAIL</th>
                <th>ESTADO</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-white/90">
              {rows.map((u) => (
                <tr key={u.cod} className="border-t border-gray-100 dark:border-white/5">
                  <td className="px-5 py-3">{u.cod}</td>
                  <td className="px-5 py-3">{u.nombre}</td>
                  <td className="px-5 py-3">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                      Activo
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-gray-400">
                    No hay usuarios para mostrar.
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