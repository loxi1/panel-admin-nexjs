import DefaultLayout from "@/layout/DefaultLayout";

type Usuario = {
  COD_USUARIO: string;
  PRIMER_NOMBRE: string | null;
  SEGUNDO_NOMBRE: string | null;
  APELLIDO_PATERNO: string | null;
  APELLIDO_MATERNO: string | null;
  CORREO_ELECTRONICO: string | null;
  COD_ESTADO_REGISTRO: number;
};

async function getData(): Promise<Usuario[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/usuarios`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("No se pudo cargar usuarios");
  return res.json();
}

export default async function UsuariosPage() {
  const data = await getData();

  return (
    <DefaultLayout>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Usuarios</h1>
        <p className="text-gray-500 dark:text-gray-400">Catálogo de usuarios (solo lectura).</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
        <table className="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-50 text-gray-600 dark:bg-white/5 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Nombres</th>
              <th className="px-4 py-3">Apellidos</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr key={u.COD_USUARIO} className="border-t border-gray-100 dark:border-white/10">
                <td className="px-4 py-2 font-mono">{u.COD_USUARIO}</td>
                <td className="px-4 py-2">
                  {[u.PRIMER_NOMBRE, u.SEGUNDO_NOMBRE].filter(Boolean).join(" ")}
                </td>
                <td className="px-4 py-2">
                  {[u.APELLIDO_PATERNO, u.APELLIDO_MATERNO].filter(Boolean).join(" ")}
                </td>
                <td className="px-4 py-2">{u.CORREO_ELECTRONICO ?? "-"}</td>
                <td className="px-4 py-2">{u.COD_ESTADO_REGISTRO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DefaultLayout>
  );
}
