'use client';

import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/app/store/authStore";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const restaurateurs = [
  { id: 1, name: "Le clos des sens", email: "contact@gmail.com" },
  { id: 2, name: "Macdo", email: "contact@gmail.com" },
];

export default function Page() {
  const { user } = useAuthStore();
  const [restaurateursList, setRestaurateursList] = useState(restaurateurs);

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Restaurateurs</h1>
          <Link href="/admin/restaurateurs/new" className="h-9 inline-flex items-center rounded-md bg-primary px-3 text-white text-sm">
            Ajouter un restaurateur
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Nom</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {restaurateurs.map((resto) => (
                  <tr key={resto.id}>
                    <td className="px-4 py-3 text-sm">{resto.id}</td>
                    <td className="px-4 py-3 text-sm">{resto.name}</td>
                    <td className="px-4 py-3 text-sm">{resto.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <Button variant="ghost" size="sm">Modifier</Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}


