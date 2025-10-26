"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function TopProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // arrancar
    setVisible(true);
    // pequeña demora para que se vea aunque cargue rápido
    const t = setTimeout(() => setVisible(false), 500);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div
      className={`fixed left-0 top-0 z-[60] h-0.5 w-full transition-opacity ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="h-full w-0 animate-[grow_0.5s_ease-out_forwards] bg-brand-600 dark:bg-brand-400" />
      <style jsx>{`
        @keyframes grow {
          from { width: 0% }
          to   { width: 90% }
        }
      `}</style>
    </div>
  );
}
