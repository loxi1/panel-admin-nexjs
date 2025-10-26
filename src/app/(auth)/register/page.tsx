"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [cod, setCod] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOkMsg(null);
    if (pass1 !== pass2) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (pass1.length < 6) {
      setError("Usa mínimo 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cod_usuario: cod.trim(), new_password: pass1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo registrar");
      setOkMsg("¡Contraseña creada! Ahora puedes iniciar sesión.");
      setTimeout(() => router.push("/(auth)/login"), 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white/90">Configura tu acceso 🔐</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Valida tu código y crea tu contraseña</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Código de usuario</label>
              <input
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
                value={cod}
                onChange={(e) => setCod(e.target.value)}
                placeholder="Ej: VTAENR1"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nueva contraseña</label>
              <input
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
                type="password"
                value={pass1}
                onChange={(e) => setPass1(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Repite la contraseña</label>
              <input
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
                type="password"
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-200 px-3 py-2 text-sm">
                {error}
              </div>
            )}
            {okMsg && (
              <div className="rounded-lg bg-green-50 text-green-700 dark:bg-emerald-900/30 dark:text-emerald-200 px-3 py-2 text-sm">
                {okMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center items-center rounded-lg bg-brand-500 text-white font-medium py-2.5 hover:bg-brand-600 disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Crear contraseña"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            ¿Ya tienes contraseña?{" "}
            <Link href="/(auth)/login" className="text-brand-600 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
