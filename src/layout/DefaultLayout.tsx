// src/layout/DefaultLayout.tsx
export default function DefaultLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}