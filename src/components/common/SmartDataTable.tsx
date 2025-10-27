"use client";

import { useCallback, useEffect, useState } from "react";
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
  apiUrl: string;          // ej: "/api/articulos"
  columns: Column<T>[];    // columnas visibles y exportables
  title?: string;          // para nombrar los archivos exportados
}

type ApiListResponse<T extends Record<string, unknown>> = {
  items: T[];
  total: number;
};

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

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const url =
        `${apiUrl}?page=${page}` +
        `&pageSize=${pageSize}` +
        `&q=${encodeURIComponent(search)}` +
        `&sort=${encodeURIComponent(sort)}` +
        `&order=${order}`;

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`API error ${res.status}`);

      const json = (await res.json()) as ApiListResponse<T>;
      setData(Array.isArray(json.items) ? json.items : []);
      setTotal(typeof json.total === "number" ? json.total : 0);
    } catch (e) {
      console.error("Error al cargar:", e);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, page, pageSize, search, sort, order]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleSort = (col: string) => {
    if (sort === col) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(col);
      setOrder("asc");
    }
  };

  const renderSortIcon = (col: string) => {
    if (col !== sort) return "⇅";
    return order === "asc" ? "▲" : "▼";
  };

  async function exportData(fmt: "excel" | "csv" | "pdf") {
    const res = await fetch(
      `${apiUrl}?export=1&q=${encodeURIComponent(search)}&sort=${encodeURIComponent(
        sort,
      )}&order=${order}`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const json = (await res.json()) as ApiListResponse<T>;
    const items = Array.isArray(json.items) ? json.items : [];

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

    // PDF
    const doc = new jsPDF({ orientation: "landscape" });
    autoTable(doc, {
      head: [columns.map((c) => c.label)],
      body: items.map((row) => columns.map((c) => String(row[c.key] ?? ""))),
      styles: { fontSize: 7 },
    });
    doc.save(`${title}.pdf`);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

        <div className="flex gap-2">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-2 py-1 text-sm dark:border-gray-700 dark:bg-transparent dark:text-white"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} / pág
              </option>
            ))}
          </select>

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
                    <th
                      key={k}
                      onClick={() => handleSort(k)}
                      className="cursor-pointer select-none px-3 py-2"
                    >
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
                        {c.render ? c.render(row) : String(row[c.key] ?? "")}
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
          Página {page} de {Math.max(1, Math.ceil(total / pageSize))} ({total} registros)
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
            onClick={() => setPage((p) => Math.min(Math.max(1, Math.ceil(total / pageSize)), p + 1))}
            disabled={page >= Math.max(1, Math.ceil(total / pageSize))}
            className="rounded-lg border border-gray-300 px-3 py-1 disabled:opacity-50 dark:border-gray-700"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}