'use client';

import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/app/store/authStore";
import { getAllRestaurateurs } from "@/app/store/userStore";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LazyConfirmDialog as ConfirmDialog } from "@/components/ui/LazyComponents";
import { useDictionary } from "@/components/i18n/DictionaryProvider";

export default function AdminPage() {
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'fr';
  const dict = useDictionary();
  const { user, deleteUser } = useAuthStore();
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

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async (id: string) => {
    try {
      await deleteUser(id);
      const restaurateursList = getAllRestaurateurs();
      setRestaurateurs(restaurateursList);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur lors de la suppression');
      setDeleteConfirm(null);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{dict.admin.title}</h1>
            <p className="text-muted-foreground">{dict.admin.welcome.replace('{{name}}', user?.name || '')}</p>
          </div>
        </div>

        <section aria-label={`Liste des ${dict.admin.restaurateurs.toLowerCase()}`} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{dict.admin.restaurateurs}</h2>
            <Link 
              href={`/${lang}/admin/new-restaurant`}
              className="h-9 inline-flex items-center rounded-md bg-primary px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={dict.admin.addRestaurateur}
            >
              {dict.admin.addRestaurateur}
            </Link>
          </div>
          
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full" role="table" aria-label={`Tableau des ${dict.admin.restaurateurs.toLowerCase()}`}>
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">{dict.profile.name}</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">{dict.profile.email}</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">{dict.orders.date}</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">{dict.common.actionsFor}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {restaurateurs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground" role="status" aria-live="polite">
                      {dict.admin.noRestaurateurs}
                    </td>
                  </tr>
                ) : (
                  restaurateurs.map((resto) => (
                    <tr key={resto.id}>
                      <td className="px-4 py-3 text-sm">{resto.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{resto.name}</td>
                      <td className="px-4 py-3 text-sm">{resto.email}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        <time dateTime={resto.createdAt}>
                          {new Date(resto.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR')}
                        </time>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            onClick={() => handleDelete(resto.id)}
                            aria-label={`${dict.common.delete} ${resto.name}`}
                          >
                            {dict.common.delete}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <ConfirmDialog
          isOpen={!!deleteConfirm}
          title={dict.admin.deleteTitle}
          message={dict.admin.deleteConfirm}
          confirmText={dict.common.delete}
          cancelText={dict.common.cancel}
          variant="danger"
          onConfirm={() => deleteConfirm && confirmDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      </div>
    </ProtectedRoute>
  );
}

