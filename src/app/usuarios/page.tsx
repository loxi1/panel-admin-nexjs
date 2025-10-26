// src/app/usuarios/page.tsx
import DefaultLayout from "@/layout/DefaultLayout";
import { cookies } from "next/headers";

async function getUsuarios() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${base}/api/usuarios`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    throw new Error("Respuesta no JSON (probable redirección por autenticación).");
  }
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API /usuarios ${res.status}: ${txt}`);
  }
  return res.json();
}

export default async function UsuariosPage() {
  const data = await getUsuarios();

  return (
    <DefaultLayout>
      <h1 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">Usuarios</h1>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 dark:bg-white/[0.04] dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Código</th>
              <th className="px-4 py-3 text-left font-medium">Nombre</th>
              <th className="px-4 py-3 text-left font-medium">Correo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.map((u: any) => {
              const nombre = [u.PRIMER_NOMBRE, u.SEGUNDO_NOMBRE, u.APELLIDO_PATERNO, u.APELLIDO_MATERNO]
                .filter(Boolean)
                .join(" ");
              return (
                <tr key={u.COD_USUARIO} className="hover:bg-gray-50/60 dark:hover:bg-white/5">
                  <td className="px-4 py-3 font-mono">{u.COD_USUARIO}</td>
                  <td className="px-4 py-3">{nombre}</td>
                  <td className="px-4 py-3">{u.CORREO_ELECTRONICO}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DefaultLayout>
  );
}