export default function AdminLoading() {
  return (
    <div className="p-6">
      {/* título */}
      <div className="mb-6 h-7 w-56 rounded-lg bg-gray-200 dark:bg-white/10 animate-pulse" />
      {/* toolbar */}
      <div className="mb-6 flex gap-3">
        <div className="h-9 w-28 rounded-lg bg-gray-200 dark:bg-white/10 animate-pulse" />
        <div className="h-9 w-36 rounded-lg bg-gray-200 dark:bg白/10 animate-pulse" />
      </div>
      {/* tabla skeleton */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="mb-3 h-10 rounded-lg bg-gray-100 dark:bg-white/5 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
