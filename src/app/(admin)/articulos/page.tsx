export const dynamic = "force-dynamic";
import PageHeader from "@/components/common/PageHeader";
import SmartDataTable, { type Column } from "@/components/common/SmartDataTable";

// Fila tal como la devuelve tu /api/articulos (en MAYÚSCULAS)
type Articulo = {
  COD_ITEM_ARTICULO: number;
  DSC_FAMILIA: string;
  DSC_CLASE: string;
  DESCRIPCION_ARTICULO: string;
  COD_STANDARD: string | null;
};

export default function ArticulosPage() {
  const columns: Column<Articulo>[] = [
    { key: "COD_ITEM_ARTICULO", label: "Código" },
    { key: "DSC_FAMILIA", label: "Familia" },
    { key: "DSC_CLASE", label: "Clase" },
    { key: "DESCRIPCION_ARTICULO", label: "Descripción" },
    { key: "COD_STANDARD", label: "Standard" },
  ];

  return (
    <>
      <PageHeader
        title="Artículos"
        subtitle="Listado general con búsqueda, paginación y exportación."
      />
      <SmartDataTable<Articulo>
        apiUrl="/api/articulos"
        title="Artículos"
        columns={columns}
      />
    </>
  );
}