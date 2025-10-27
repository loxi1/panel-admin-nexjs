"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

export interface Column<T extends Record<string, unknown>> {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
}

export interface SmartDataTableProps<T extends Record<string, unknown>> {
  apiUrl: string;
  columns: Column<T>[];
  title?: string;
}

type ApiListResponse<T extends Record<string, unknown>> = {
  items: T[];
  total: number;
};

/** Dropdown custom para evitar bugs del <select> nativo */
function PageSizeSelect({
  value,
  onChange,
  options = [10, 25, 50, 100],
}: {
  value: number;
  onChange: (v: number) => void;
  options?: number[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 shadow-sm outline-none hover:bg-gray-50 focus:border-indigo-400 dark:border-gray-700 dark:bg-[#0B1221] dark:text-gray-200"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-xs text-gray-500 dark:text-gray-400">Registros:</span>
        <span className="font-medium">{value} / pág</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 20 20"
          className="opacity-70"
          aria-hidden="true"
        >
          <path fill="currentColor" d="M5 7l5 5 5-5H5z" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-1 w-32 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg dark:border-white/10 dark:bg-[#0B1221]"
        >
          {options.map((n) => (
            <li key={n}>
              <button
                type="button"
                role="option"
                aria-selected={n === value}
                className={`block w-full px-3 py-1 text-left hover:bg-gray-50 dark:hover:bg-white/5 ${
                  n === value ? "font-semibold text-gray-800 dark:text-gray-100" : "text-gray-700 dark:text-gray-200"
                }`}
                onClick={() => {
                  onChange(n);
                  setOpen(false);
                }}
              >
                {n} / pág
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SmartDataTable<T extends Record<string, unknown>>({
  apiUrl,
  columns,
  title = "Listado",
}: SmartDataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>(String(columns[0]?.key ?? ""));
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  const readJsonOrRedirect = async (res: Response) => {
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      if (typeof window !== "undefined") window.location.href = "/login";
      throw new Error("Respuesta no-JSON (posible sesión expirada).");
    }
    return (await res.json()) as unknown;
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const url =
        `${apiUrl}?page=${page}` +
        `&pageSize=${pageSize}` +
        `&q=${encodeURIComponent(search)}` +
        `&sort=${encodeURIComponent(sort)}` +
        `&order=${order}`;

      const res = await fetch(url, {
        cache: "no-store",
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          if (typeof window !== "undefined") window.location.href = "/login";
        }
        throw new Error(`API error ${res.status}`);
      }

      const json = await readJsonOrRedirect(res);
      // Soporta: 1) {items,total}  2) Array plano
      const { items, total } = Array.isArray(json)
        ? { items: (json as T[]) ?? [], total: (json as T[])?.length ?? 0 }
        : ({
            items: Array.isArray((json as ApiListResponse<T>)?.items)
              ? ((json as ApiListResponse<T>).items as T[])
              : [],
            total:
              typeof (json as ApiListResponse<T>)?.total === "number"
                ? (json as ApiListResponse<T>).total
                : Array.isArray((json as ApiListResponse<T>)?.items)
                ? ((json as ApiListResponse<T>).items as T[]).length
                : 0,
          } as { items: T[]; total: number });

      setData(items);
      setTotal(total);
    } catch (e) {
      console.error("Error al cargar:", e);
      setData([]);
      setTotal(0);
      setErrorMsg("No se pudo cargar la información. Intenta recargar la página.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, page, pageSize, search, sort, order]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleSort = (col: string) => {
    if (sort === col) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSort(col);
      setOrder("asc");
    }
  };

  const renderSortIcon = (col: string) => (col !== sort ? "⇅" : order === "asc" ? "▲" : "▼");

  async function exportData(fmt: "excel" | "csv" | "pdf") {
    const res = await fetch(
      `${apiUrl}?export=1&q=${encodeURIComponent(search)}&sort=${encodeURIComponent(sort)}&order=${order}`,
      { cache: "no-store", credentials: "include" },
    );
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const json = await readJsonOrRedirect(res);
    const { items } = Array.isArray(json)
      ? { items: (json as T[]) ?? [] }
      : ({ items: Array.isArray((json as ApiListResponse<T>)?.items) ? ((json as ApiListResponse<T>).items as T[]) : [] } as {
          items: T[];
        });

    if (fmt === "excel" || fmt === "csv") {
      const ws = XLSX.utils.json_to_sheet(items as unknown[]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, title);
      if (fmt === "excel") {
        const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
        saveAs(new Blob([buf]), `${title}.xlsx`);
      } else {
        const csv = XLSX.utils.sheet_to_csv(ws);
        saveAs(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `${title}.csv`);
      }
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });
    autoTable(doc, {
      head: [columns.map((c) => c.label)],
      body: items.map((row) =>
        columns.map((c) => {
          const obj = row as Record<string, unknown>;
          return String(obj[c.key as unknown as string] ?? "");
        }),
      ),
      styles: { fontSize: 7 },
    });
    doc.save(`${title}.pdf`);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between relative z-30">
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-transparent dark:text-white sm:w-1/3"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <div className="flex flex-wrap items-center gap-2">
          <PageSizeSelect
            value={pageSize}
            onChange={(n) => {
              setPageSize(n);
              setPage(1);
            }}
          />

          <div className="flex gap-2">
            <button
              onClick={() => void exportData("excel")}
              className="rounded bg-emerald-500 px-3 py-1.5 text-xs text-white hover:bg-emerald-600"
            >
              Excel
            </button>
            <button
              onClick={() => void exportData("csv")}
              className="rounded bg-indigo-500 px-3 py-1.5 text-xs text-white hover:bg-indigo-600"
            >
              CSV
            </button>
            <button
              onClick={() => void exportData("pdf")}
              className="rounded bg-rose-500 px-3 py-1.5 text-xs text-white hover:bg-rose-600"
            >
              PDF
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-500/10 dark:text-rose-300">
          {errorMsg}
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <p className="py-10 text-center text-gray-400">Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <tr>
                {columns.map((c) => {
                  const k = String(c.key);
                  return (
                    <th key={k} onClick={() => handleSort(k)} className="cursor-pointer select-none px-3 py-2">
                      {c.label} {renderSortIcon(k)}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-white/90">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-3 py-8 text-center text-gray-400">
                    Sin resultados
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
                  >
                    {columns.map((c) => (
                      <td key={String(c.key)} className="px-3 py-2">
                        {c.render
                          ? c.render(row)
                          : (() => {
                              const obj = row as Record<string, unknown>;
                              return String(obj[c.key as unknown as string] ?? "");
                            })()}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          Página {page} de {totalPages} ({total} registros)
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-gray-300 px-3 py-1 disabled:opacity-50 dark:border-gray-700"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-gray-300 px-3 py-1 disabled:opacity-50 dark:border-gray-700"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}