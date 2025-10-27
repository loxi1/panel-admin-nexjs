"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TableToolbar({
  defaultQuery,
  defaultPageSize = 10,
  onChange, // devuelve URL cuando algo cambia
}: {
  defaultQuery?: string;
  defaultPageSize?: number;
  onChange: (nextHref: string) => string | void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(defaultQuery ?? "");
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Debounce búsqueda
  useEffect(() => {
    const id = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", query);
      params.set("page", "1");
      params.set("pageSize", String(pageSize));
      const next = `${pathname}?${params.toString()}`;
      const maybe = onChange(next);
      if (!maybe) router.push(next);
    }, 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, pageSize]);

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-500 dark:text-gray-400">Mostrar</label>
        <select
          className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none dark:border-white/10 dark:bg-transparent dark:text-white/90"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[5, 10, 25, 50].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500 dark:text-gray-400">filas</span>
      </div>

      <div className="relative w-full sm:w-80">
        <input
          className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm outline-none ring-brand-500/20 focus:border-brand-500 focus:ring-4 dark:border-white/10 dark:bg-transparent dark:text-white"
          placeholder="Buscar descripción o standard…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
      </div>
    </div>
  );
}
