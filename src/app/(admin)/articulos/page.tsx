// src/app/(admin)/articulos/page.tsx
import DefaultLayout from "@/layout/DefaultLayout";
import PageHeader from "@/components/common/PageHeader";
import SmartDataTable from "@/components/common/SmartDataTable";

export default function ArticulosPage() {
  return (
    <>
      <PageHeader
        title="Artículos"
        subtitle="Listado general con búsqueda, paginación y exportación."
      />
      <SmartDataTable
        apiUrl="/api/articulos"
        title="Artículos"
        columns={[
          { key: "cod_item_articulo", label: "Código" },
          { key: "dsc_familia", label: "Familia" },
          { key: "dsc_clase", label: "Clase" },
          { key: "dsc_subclase", label: "Subclase" },
          { key: "cod_standard", label: "Standard" },
          { key: "descripcion", label: "Descripción" },
        ]}
      />
    </>
  );
}
