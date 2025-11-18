import type { Metadata } from "next";
import AdminSidebar from "@/app/admin/components/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin | Resto Digital",
  description: "Admin area",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="max-w-7xl mx-auto py-8 w-auto">
        <div className="flex gap-6">
          <AdminSidebar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  );
}
