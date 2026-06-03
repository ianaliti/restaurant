'use client';

import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LazyConfirmDialog as ConfirmDialog } from "@/components/ui/LazyComponents";
import { useDictionary } from "@/components/i18n/DictionaryProvider";
import { getRestaurantsService, deleteRestaurantService } from "@/services/restaurant.service";
import type { RestaurantData } from "@/types/restaurants.type";

export default function AdminPage() {
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'fr';
  const dict = useDictionary();
  const { user } = useAuth();
  const [restaurateurs, setRestaurateurs] = useState<RestaurantData[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    getRestaurantsService()
      .then(setRestaurateurs)
      .catch(console.error);
  }, []);

  const confirmDelete = async (id: string) => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteRestaurantService(id);
      setRestaurateurs((prev) => prev.filter((r) => r.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleteLoading(false);
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
            >
              {dict.admin.addRestaurateur}
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border">
            <table className="w-full" role="table">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">{dict.profile.name}</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">{dict.profile.email}</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold">{dict.common.actionsFor}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {restaurateurs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground" role="status">{dict.admin.noRestaurateurs}</td>
                  </tr>
                ) : (
                  restaurateurs.map((resto) => (
                    <tr key={resto.id}>
                      <td className="px-4 py-3 text-sm">{resto.id.slice(0, 8)}…</td>
                      <td className="px-4 py-3 text-sm font-medium">{resto.name}</td>
                      <td className="px-4 py-3 text-sm">{resto.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeleteConfirm(resto.id)}>
                          {dict.common.delete}
                        </Button>
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
          isLoading={deleteLoading}
          error={deleteError}
          onConfirm={() => deleteConfirm && confirmDelete(deleteConfirm)}
          onCancel={() => { setDeleteConfirm(null); setDeleteError(null); }}
        />
      </div>
    </ProtectedRoute>
  );
}
