import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/app/(customer)/components/navbar/Navbar";

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


