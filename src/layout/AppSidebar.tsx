"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { LayoutDashboard, Users, Boxes } from "lucide-react";
import Image from "next/image";

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
  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: "Usuarios", path: "/usuarios", icon: <Users className="h-5 w-5" /> },
  { name: "Artículos", path: "/articulos", icon: <Boxes className="h-5 w-5" /> },
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


      <div className="flex items-center justify-center px-6 py-5">
        <Image
          src="/images/logo/logo.svg"     // logo claro
          alt="ARASAC"
          width={160}
          height={36}
          priority
          className="block dark:hidden h-9 w-auto"
        />
        <Image
          src="/images/logo/auth-dark.svg" // logo oscuro
          alt="ARASAC"
          width={160}
          height={36}
          priority
          className="hidden dark:block h-9 w-auto"
        />
      </div>

      <nav className="p-4 overflow-y-auto">
        {renderMenuItems(navItems, "main")}
      </nav>
    </aside>
  );
};

export default AppSidebar;