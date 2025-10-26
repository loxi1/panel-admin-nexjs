export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <section className="xl:col-span-12">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Panel de control
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Bienvenido 👋 Aquí irá tu resumen.
        </p>
      </section>

      {/* Cards */}
      <div className="xl:col-span-3 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">Usuarios activos</p>
        <div className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">32</div>
      </div>

      <div className="xl:col-span-3 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">Artículos</p>
        <div className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">9,845</div>
      </div>

      <div className="xl:col-span-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">Actividad reciente</p>
        <div className="mt-4 h-40 rounded-xl bg-gray-50 dark:bg-white/5" />
      </div>
    </div>
  );
}