'use client';

import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthStore, getAllRestaurateurs } from "@/app/store/authStore";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { user, logout, deleteUser } = useAuthStore();
  const router = useRouter();
  const [restaurateurs, setRestaurateurs] = useState<Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }>>([]);

  useEffect(() => {
    const loadRestaurateurs = () => {
      const restaurateursList = getAllRestaurateurs();
      setRestaurateurs(restaurateursList);
    };
    
    loadRestaurateurs();
    const interval = setInterval(loadRestaurateurs, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce restaurateur?')) {
      try {
        await deleteUser(id);
        const restaurateursList = getAllRestaurateurs();
        setRestaurateurs(restaurateursList);
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Administration</h1>
            <p className="text-muted-foreground">Bienvenue, {user?.name}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Restaurateurs</h2>
            <Link 
              href="/admin/new-restaurant" 
              className="h-9 inline-flex items-center rounded-md bg-primary px-3 text-white text-sm"
            >
              Ajouter un restaurateur
            </Link>
          </div>
          
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Nom</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date de création</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {restaurateurs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      Aucun restaurateur trouvé
                    </td>
                  </tr>
                ) : (
                  restaurateurs.map((resto) => (
                    <tr key={resto.id}>
                      <td className="px-4 py-3 text-sm">{resto.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{resto.name}</td>
                      <td className="px-4 py-3 text-sm">{resto.email}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(resto.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Modifier</Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600"
                            onClick={() => handleDelete(resto.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

