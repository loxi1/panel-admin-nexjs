// src/layout/DefaultLayout.tsx
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="w-64 shrink-0">
        <AppSidebar />
      </div>
      <div className="min-h-screen flex-1">
        <AppHeader />
        <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}

