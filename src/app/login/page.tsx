'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [cod, setCod] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ cod_usuario: cod, password: pass }),
    });
    const j = await r.json();
    if (!r.ok) return setMsg(j.error || 'Error');
    window.location.href = '/'; // home protegida
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form onSubmit={doLogin} className="w-full max-w-sm space-y-4 border p-6 rounded-lg">
        <h1 className="text-xl font-semibold">Iniciar sesión</h1>
        {msg && <p className="text-red-600">{msg}</p>}
        <input className="w-full border p-2 rounded" placeholder="Código de usuario"
               value={cod} onChange={e=>setCod(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Contraseña" type="password"
               value={pass} onChange={e=>setPass(e.target.value)} />
        <button className="w-full bg-black text-white rounded py-2">Entrar</button>
      </form>
    </main>
  );
}
