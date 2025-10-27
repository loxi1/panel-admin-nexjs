// src/app/(admin)/articulos/loading.tsx
export default function LoadingArticulos() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-7 w-48 rounded bg-gray-200 dark:bg-white/10" />
      <div className="h-10 w-full rounded bg-gray-200/70 dark:bg-white/5" />
      <div className="h-64 w-full rounded bg-gray-200/70 dark:bg-white/5" />
    </div>
  );
}
