import type { Metadata } from "next";
import RestoSidebar from "./components/RestoSidebar";

export const metadata: Metadata = {
  title: "Restaurateur | Resto Digital",
  description: "Restaurateur area",
};

export default function RestaurateurLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="max-w-7xl mx-auto py-8 w-auto">
        <div className="flex gap-6">
          <RestoSidebar />
          <main id='main-content' className="flex-1">{children}</main>
        </div>
      </div>
    </>   
  );
}
