// src/app/usuarios/page.tsx
import DefaultLayout from "@/layout/DefaultLayout";
import PageHeader from "@/components/common/PageHeader";
import SmartDataTable from "@/components/common/SmartDataTable";

export default function UsuariosPage() {
  return (
    <DefaultLayout>
      <PageHeader
        title="Usuarios"
        subtitle="Listado general de usuarios del sistema."
      />
      <SmartDataTable
        apiUrl="/api/usuarios"
        title="Usuarios"
        columns={[
          { key: "cod", label: "Código" },
          { key: "nombre", label: "Nombre completo" },
          { key: "email", label: "Correo electrónico" },
          { key: "activo", label: "Estado" },
        ]}
      />
    </DefaultLayout>
  );
}