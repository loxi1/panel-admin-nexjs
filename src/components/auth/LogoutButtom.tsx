"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    try {
      setLoading(true);
      await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
      router.replace("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-200 ${className}`}
    >
      {/* icono salida */}
      <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-70">
        <path fill="currentColor" d="M10 17v-2h4v-6h-4V7h6v10h-6zM5 7h2v10H5z"/>
      </svg>
      {loading ? "Saliendo…" : "Cerrar sesión"}
    </button>
  );
}
