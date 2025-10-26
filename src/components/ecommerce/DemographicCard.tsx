// src/components/ecommerce/DemographicCard.tsx
"use client";
import Image from "next/image";
import { useState } from "react";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Customers Demographic
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Number of customers by country
          </p>
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* BLOQUE intermedio (reemplazo del mapa) */}
      <div className="px-4 py-6 my-6 overflow-hidden border rounded-2xl bg-gray-50 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Total customers
            </p>
            <p className="mt-1 text-xl font-semibold text-gray-800 dark:text-white/90">
              3,128
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Countries
            </p>
            <p className="mt-1 text-xl font-semibold text-gray-800 dark:text-white/90">
              12
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Last 7d
            </p>
            <p className="mt-1 text-xl font-semibold text-emerald-600 dark:text-emerald-400">
              +8.4%
            </p>
          </div>
        </div>

        {/* Placeholder visual (sin dependencias) */}
        <div className="mt-5 flex h-48 items-center justify-center rounded-xl border border-dashed border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400">
          <div className="text-center">
            <p className="font-medium">Mapa deshabilitado</p>
            <p className="text-xs mt-1">
              Puedes activar el mapa más adelante o dejar este resumen.
            </p>
          </div>
        </div>
      </div>

      {/* Lista de países (ya estaba en el componente) */}
      <div className="space-y-5">
        {/* USA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="items-center w-full rounded-full max-w-8">
              <Image
                width={48}
                height={48}
                src="/images/country/country-01.svg"
                alt="usa"
                className="w-full"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                USA
              </p>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                2,379 Customers
              </span>
            </div>
          </div>

          <div className="flex w-full max-w-[140px] items-center gap-3">
            <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
              <div className="absolute left-0 top-0 h-full w-[79%] rounded-sm bg-brand-500"></div>
            </div>
            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">79%</p>
          </div>
        </div>

        {/* France */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="items-center w-full rounded-full max-w-8">
              <Image
                width={48}
                height={48}
                className="w-full"
                src="/images/country/country-02.svg"
                alt="france"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                France
              </p>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                589 Customers
              </span>
            </div>
          </div>

          <div className="flex w-full max-w-[140px] items-center gap-3">
            <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
              <div className="absolute left-0 top-0 h-full w-[23%] rounded-sm bg-brand-500"></div>
            </div>
            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">23%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
