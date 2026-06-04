"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMyMenu } from "@/hooks/useMenu";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import CardComponent from '@/components/card/CardComponent';
import { useDictionary } from "@/components/i18n/DictionaryProvider";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function PlatsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'fr';
  const dict = useDictionary();

  const { dishes, isLoading, removeDish } = useMyMenu(user?.id ?? '');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Supprimer "${name}" ?`)) return;
    setDeletingId(id);
    setDeleteError(null);
    try {
      await removeDish(id);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ProtectedRoute requiredRole={["restaurateur", "admin"]}>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">{dict.restaurateur.plats}</h1>
          <Button
            onClick={() => router.push(`/${lang}/restaurateur/plats/new-plat`)}
            aria-label={dict.restaurateur.addPlat}
            className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {dict.restaurateur.addPlat}
          </Button>
        </div>

        {deleteError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm" role="alert">
            {deleteError}
          </div>
        )}

        <section aria-label={dict.restaurateur.plats}>
          <h2 className="text-xl font-semibold mb-4">
            {dict.restaurateur.plats} ({isLoading ? '…' : dishes.length})
          </h2>

          {isLoading ? (
            <div className="p-8 text-center" role="status" aria-live="polite">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : dishes.length === 0 ? (
            <div className="p-8 text-center" role="status" aria-live="polite">
              <p className="text-muted-foreground mb-4">{dict.restaurateur.noPlats}</p>
              <Button onClick={() => router.push(`/${lang}/restaurateur/plats/new-plat`)} aria-label={dict.restaurateur.addPlat}>
                {dict.restaurateur.addPlat}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list">
              {dishes.map((dish) => (
                <div key={dish.id} className="relative group">
                  <Link href={`/${lang}/restaurateur/plats/${dish.id}`} aria-label={`Voir les détails de ${dish.name}`}>
                    <CardComponent name={dish.name} id={dish.id} image={dish.image} />
                  </Link>
                  <button
                    onClick={(e) => handleDelete(e, dish.id, dish.name)}
                    disabled={deletingId === dish.id}
                    aria-label={`Supprimer ${dish.name}`}
                    className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/90 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
}
