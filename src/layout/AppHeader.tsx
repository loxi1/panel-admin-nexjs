"use client";

import React from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useTheme } from "@/context/ThemeContext";

export default function AppHeader() {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center gap-2">
        <button className="rounded-lg border px-3 py-2 dark:border-gray-700" onClick={toggleSidebar}>
          Toggle
        </button>
        <button className="rounded-lg border px-3 py-2 lg:hidden dark:border-gray-700" onClick={toggleMobileSidebar}>
          Menu
        </button>
      </div>
      <button className="rounded-lg border px-3 py-2 dark:border-gray-700" onClick={toggleTheme}>
        Tema
      </button>
    </header>
  );
}
