// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Panel",
  icons: {
    icon: "/icon.svg",             // si creaste src/app/icon.svg
    apple: "/apple-touch-icon.png" // si tienes uno para iOS (opcional)
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 antialiased dark:bg-[#0B1221]">
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
