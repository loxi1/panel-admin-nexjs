// src/layout/DefaultLayout.tsx
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-[#0B1221] dark:text-white">
      {/* Sidebar fijo a la izquierda */}
      <AppSidebar />

      {/* Contenido principal: reserva el ancho del sidebar en desktop */}
      <main className="min-h-screen lg:pl-64">
        {/* Barra superior (una sola vez) */}
        <AppHeader />

        {/* Contenedor de página */}
        <div className="mx-auto max-w-7xl p-6">{children}</div>
      </main>
    </div>
  );
}