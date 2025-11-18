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
      <div className="border-b bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <span className="font-semibold">Back Office</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6">
          <AdminSidebar />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  );
}
