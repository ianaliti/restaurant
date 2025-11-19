"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/app/store/authStore";
import { usePlatStore } from "@/app/store/platStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CardComponent from '@/components/card/CardComponent';

export default function PlatsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const getPlatsByUserId = usePlatStore(state => state.getPlatsByUserId);
  const plats = user?.id ? getPlatsByUserId(user.id) : [];


  return (
    <ProtectedRoute requiredRole={["restaurateur", "admin"]}>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Mes Plats</h1>
          <Button 
            onClick={() => router.push("/restaurateur/plats/new-plat")}
            aria-label="Ajouter un nouveau plat"
            className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Ajouter un plat
          </Button>
        </div>

        <section aria-label="Liste des plats">
          <h2 className="text-xl font-semibold mb-4">
            Liste des plats ({plats.length})
          </h2>

          {plats.length === 0 ? (
            <div className="p-8 text-center" role="status" aria-live="polite">
              <p className="text-muted-foreground mb-4">
                Aucun plat pour le moment. Ajoutez votre premier plat!
              </p>
              <Button
                onClick={() => router.push("/restaurateur/plats/new-plat")}
                aria-label="Ajouter votre premier plat"
                className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Ajouter un plat
              </Button>
            </div>
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list">
                {plats.map((resto) => (
                  <Link 
                    href={`/restaurants/${resto.id}`} 
                    key={resto.id}
                    aria-label={`Voir les détails de ${resto.name}`}
                  >
                    <CardComponent
                      key={resto.id}
                      name={resto.name}
                      id={resto.id}
                      image={resto.image}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
}
