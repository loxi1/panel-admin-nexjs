import DefaultLayout from "@/layout/DefaultLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DefaultLayout>{children}</DefaultLayout>;
}