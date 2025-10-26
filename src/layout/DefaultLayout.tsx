// src/layout/DefaultLayout.tsx
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <Backdrop />
      <div className="flex-1">
        <AppHeader />
        <main className="p-6 xl:p-10">{children}</main>
      </div>
    </div>
  );
}
