"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

// --- Íconos ligeros (SVG inline) ---
const DashboardIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 13h8V3H3v10zM13 21h8v-6h-8v6zM13 3v8h8V3h-8zM3 21h8v-6H3v6z" />
  </svg>
);

const UsersIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BoxesIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <path d="M7.5 4.21L12 6.5l4.5-2.29M12 6.5v11" />
  </svg>
);

// --- Tipado ---
type NavItem = {
  name: string;
  icon?: React.ReactNode;         // 👈 ahora es opcional
  path?: string;
  badge?: string;
  subItems?: { name: string; path: string }[];
};

// --- Menú principal ---
const navItems: NavItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: DashboardIcon },
  { name: "Usuarios", path: "/usuarios", icon: UsersIcon },
  { name: "Artículos", path: "/articulos", icon: BoxesIcon },
];

const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
  const subMenuRefs = useRef<Record<string, HTMLUListElement | null>>({});
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});

  const isActive = (href: string) => pathname === href;

  useEffect(() => { setOpenSubmenu(null); }, [pathname]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const el = subMenuRefs.current[key];
      if (el) setSubMenuHeight((prev) => ({ ...prev, [key]: el.scrollHeight }));
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index ? null : { type: menuType, index }
    );
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="space-y-1">
      {items.map((nav, index) => (
        <li key={`${menuType}-${nav.name}`}>
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
                {nav.icon ? <span className="menu-item-icon">{nav.icon}</span> : null}
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
                        isActive(sub.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Link
              href={nav.path || "#"}
              className={`menu-item group ${
                isActive(nav.path || "") ? "menu-item-active" : "menu-item-inactive"
              }`}
            >
              {nav.icon ? <span className="menu-item-icon">{nav.icon}</span> : null}
              <span className="menu-item-text">{nav.name}</span>
              {nav.badge && (
                <span
                  className={`menu-dropdown-badge ${
                    isActive(nav.path || "") ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"
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

      {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
    </aside>
  );
};

export default AppSidebar;