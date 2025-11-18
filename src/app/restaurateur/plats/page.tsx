"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/app/store/authStore";
import { getPlatsByUserId, deletePlat } from "@/app/store/platStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CardComponent from '@/components/card/CardComponent';

export default function PlatsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [plats, setPlats] = useState<
    Array<{
      id: string;
      name: string;
      price: number;
      image: string;
    }>
  >([]);

  useEffect(() => {
    if (user?.id) {
      loadPlats();
    }
  }, [user?.id]);

  const loadPlats = () => {
    if (user?.id) {
      const userPlats = getPlatsByUserId(user.id);
      setPlats(userPlats);
    }
  };

  return (
    <ProtectedRoute requiredRole={["restaurateur", "admin"]}>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Mes Plats</h1>
          <Button onClick={() => router.push("/restaurateur/plats/new-plat")}>
            Ajouter un plat
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Liste des plats ({plats.length})
          </h2>

          {plats.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                Aucun plat pour le moment. Ajoutez votre premier plat!
              </p>
              <Button
                onClick={() => router.push("/restaurateur/plats/new-plat")}
              >
                Ajouter un plat
              </Button>
            </div>
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {plats.map((resto) => (
                  <Link href={`/restaurants/${resto.id}`} key={resto.id}>
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
        </div>
      </div>
    </ProtectedRoute>
  );
}
