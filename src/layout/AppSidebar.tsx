"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  badge?: string;
  subItems?: { name: string; path: string }[];
};

// 🔹 Menú principal (puedes modificar o añadir más rutas)
const navItems: NavItem[] = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Usuarios", path: "/usuarios" },
  { name: "Artículos", path: "/articulos" },
];

const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const subMenuRefs = useRef<Record<string, HTMLUListElement | null>>({});
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});

  const isActive = (href: string) => pathname === href;

  // 🔹 Cerrar submenús al cambiar de ruta
  useEffect(() => {
    setOpenSubmenu(null);
  }, [pathname]);

  // 🔹 Calcula la altura de submenús
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const el = subMenuRefs.current[key];
      if (el) setSubMenuHeight((prev) => ({ ...prev, [key]: el.scrollHeight }));
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index
        ? null
        : { type: menuType, index }
    );
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => {
    return (
      <ul className="space-y-1">
        {items.map((nav, index) => (
          <li key={`${menuType}-${nav.name}`}>
            {/* 🔹 Submenú */}
            {nav.subItems ? (
              <>
                <button
                  onClick={() => handleSubmenuToggle(index, menuType)}
                  className={`menu-item group w-full text-left ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <span className="menu-item-text">{nav.name}</span>
                  <span
                    className={`menu-item-arrow ${
                      openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? "menu-item-arrow-active"
                        : "menu-item-arrow-inactive"
                    }`}
                  >
                    ▼
                  </span>
                </button>
                <ul
                  ref={(el) => (subMenuRefs.current[`${menuType}-${index}`] = el)}
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    height:
                      openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? `${subMenuHeight[`${menuType}-${index}`] || "auto"}px`
                        : "0px",
                  }}
                >
                  {nav.subItems.map((sub) => (
                    <li key={sub.path}>
                      <Link
                        href={sub.path}
                        className={`menu-dropdown-item ${
                          isActive(sub.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              /* 🔹 Enlace normal */
              <Link
                href={nav.path || "#"}
                className={`menu-item group ${
                  isActive(nav.path || "")
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span className="menu-item-text">{nav.name}</span>
                {nav.badge && (
                  <span
                    className={`menu-dropdown-badge ${
                      isActive(nav.path || "")
                        ? "menu-dropdown-badge-active"
                        : "menu-dropdown-badge-inactive"
                    }`}
                  >
                    {nav.badge}
                  </span>
                )}
              </Link>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-sm transition-transform dark:bg-[#0B1221]
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <div className="flex h-16 items-center justify-center border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">TailAdmin</h1>
      </div>

      <nav className="p-4 overflow-y-auto">
        {renderMenuItems(navItems, "main")}
      </nav>
    </aside>
  );
};

export default AppSidebar;