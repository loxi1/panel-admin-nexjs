"use client";

import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { SidebarProvider } from "@/context/SidebarContext";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-[#0B1221]">
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <AppHeader />
          <main className="mx-auto w-full max-w-screen-2xl p-4 sm:p-6">
            {children}
          </main>
        </div>
        <Backdrop />
      </div>
    </SidebarProvider>
  );
}
