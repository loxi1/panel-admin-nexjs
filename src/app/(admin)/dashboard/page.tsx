// src/app/(admin)/dashboard/page.tsx
import Link from "next/link";
import { getPool } from "@/lib/db";
import { getSessionUser } from "@/lib/auth-session";

async function getCounts() {
  const pool = await getPool();
  const [ru, ra] = await Promise.all([
    pool.request().query(`
      SELECT COUNT(1) AS c
      FROM dbo.USUARIO WITH (NOLOCK)
      WHERE COD_ESTADO_REGISTRO = 1
    `),
    pool.request().query(`
      SELECT COUNT(1) AS c
      FROM dbo.ARTICULO WITH (NOLOCK)
    `),
  ]);

  const users = ru.recordset?.[0]?.c ?? 0;
  const articulos = ra.recordset?.[0]?.c ?? 0;

  return { users, articulos };
}

export default async function DashboardPage() {
  const { users, articulos } = await getCounts();
  const session = await getSessionUser();
  const nf = new Intl.NumberFormat("es-PE");

  return (
    <>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="xl:col-span-12">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Panel de control
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Bienvenido{session?.cod ? `, ${session.cod}` : ""} 👋 Aquí irá tu resumen.
          </p>
        </section>

        {/* Usuarios */}
        <Link
          href="/usuarios"
          className="xl:col-span-3 rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-sm dark:border-gray-800 dark:bg-white/[0.03] focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Ir a Usuarios"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Usuarios activos</p>
          <div className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
            {nf.format(users)}
          </div>
          <span className="mt-2 inline-block text-xs text-brand-600">Ver detalle →</span>
        </Link>

        {/* Artículos */}
        <Link
          href="/articulos"
          className="xl:col-span-3 rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-sm dark:border-gray-800 dark:bg-white/[0.03] focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Ir a Artículos"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Artículos</p>
          <div className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">
            {nf.format(articulos)}
          </div>
          <span className="mt-2 inline-block text-xs text-brand-600">Ver detalle →</span>
        </Link>

        {/* Ejemplo de bloque ancho, por si luego añades gráficos */}
        <div className="xl:col-span-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">Actividad reciente</p>
          <div className="mt-4 h-40 rounded-xl bg-gray-50 dark:bg-white/5" />
        </div>
      </div>
    </>
  );
}