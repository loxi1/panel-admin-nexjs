import DefaultLayout from "@/layout/DefaultLayout";
import PageHeader from "@/components/common/PageHeader";

export default function DashboardPage() {
  return (
    <DefaultLayout>
      <PageHeader title="Panel de control" subtitle="Bienvenido 👋 Aquí irá tu resumen." />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
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
    </DefaultLayout>
  );
}
