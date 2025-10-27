// src/app/usuarios/page.tsx
import DefaultLayout from "@/layout/DefaultLayout";
import PageHeader from "@/components/common/PageHeader";
import SmartDataTable, { type Column } from "@/components/common/SmartDataTable";

// El /api/usuarios devuelve campos en MAYÚSCULAS (según tu respuesta real)
type UsuarioApi = {
  COD_USUARIO: string;
  PRIMER_NOMBRE: string | null;
  APELLIDO_PATERNO: string | null;
  CORREO_ELECTRONICO: string | null;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function UsuariosPage() {
  const columns: Column<UsuarioApi>[] = [
    { key: "COD_USUARIO",       label: "Código" },
    { key: "PRIMER_NOMBRE",     label: "Nombre" },
    { key: "APELLIDO_PATERNO",  label: "Apellido" },
    { key: "CORREO_ELECTRONICO",label: "Correo" },
  ];

  return (
    <DefaultLayout>
      <PageHeader title="Usuarios" subtitle="Listado general de usuarios del sistema." />
      <SmartDataTable<UsuarioApi>
        apiUrl="/api/usuarios"   // ← usa el endpoint (no toca la BD en build)
        title="Usuarios"
        columns={columns}
      />
    </DefaultLayout>
  );
}