// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/context/SidebarContext";

export const metadata: Metadata = {
  title: "Panel",
  description: "Admin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 antialiased dark:bg-[#0B1221]">
        <SidebarProvider>{children}</SidebarProvider>
      </body>
    </html>
  );
}
