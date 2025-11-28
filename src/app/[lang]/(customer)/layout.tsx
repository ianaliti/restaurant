import type { Metadata } from "next";
import Navbar from "@/app/[lang]/(customer)/components/navbar/Navbar";

export const metadata: Metadata = {
  title: "Customer | Resto Digital",
  description: "Customer area",
};

export default function CustomerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
      <div>
        <Navbar />
        {children}
      </div>
  );
}


