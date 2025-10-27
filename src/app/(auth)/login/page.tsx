"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [cod, setCod] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cod_usuario: cod, password }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Error de autenticación");
      router.replace("/dashboard"); // tu dashboard inicial
    // en ambos
    } catch (e: unknown) {
      if (e instanceof Error) setErr(e.message);
      else setErr("Ocurrió un error");
    }
    finally {
        setLoading(false);
      }
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#0B1221]">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-white/[0.04]">
        <h1 className="mb-1 text-2xl font-semibold text-gray-800 dark:text-white">Iniciar sesión</h1>
        <p className="mb-6 text-gray-500 dark:text-gray-400">Accede con tu código de usuario.</p>

        {err && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-500/10 dark:text-red-300">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Código</label>
            <input
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand-500/20 focus:border-brand-500 focus:ring-4 dark:border-gray-700 dark:bg-transparent dark:text-white"
              value={cod}
              onChange={(e) => setCod(e.target.value)}
              placeholder="Ej: VTAENR1"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
            <input
              type="password"
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand-500/20 focus:border-brand-500 focus:ring-4 dark:border-gray-700 dark:bg-transparent dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          ¿Primera vez?{" "}
          <a href="/register" className="text-brand-600 hover:underline">Regístrate</a>
        </p>
      </div>
    </div>
  );
}
