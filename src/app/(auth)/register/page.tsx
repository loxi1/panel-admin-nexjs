"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [cod, setCod] = useState("");
  const [password, setPassword] = useState("");
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOk(null); setErr(null); setLoading(true);
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cod_usuario: cod, new_password: password }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "No se pudo registrar");
      setOk("Contraseña establecida. Ya puedes iniciar sesión.");
      setCod(""); setPassword("");
    } catch (e: unknown) {
      if (e instanceof Error) setErr(e.message);
      else setErr("Ocurrió un error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#0B1221]">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-white/[0.04]">
        <h1 className="mb-1 text-2xl font-semibold text-gray-800 dark:text-white">Registro</h1>
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          Confirma tu código y define una nueva contraseña.
        </p>

        {ok && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-500/10 dark:text-emerald-300">
            {ok}
          </div>
        )}
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
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Nueva contraseña</label>
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
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-brand-600 hover:underline">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}
