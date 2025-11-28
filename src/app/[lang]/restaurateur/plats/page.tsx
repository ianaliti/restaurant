"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/app/store/authStore";
import { usePlatStore } from "@/app/store/platStore";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import CardComponent from '@/components/card/CardComponent';
import { useDictionary } from "@/components/i18n/DictionaryProvider";

export default function PlatsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'fr';
  const dict = useDictionary();
  const getPlatsByUserId = usePlatStore(state => state.getPlatsByUserId);
  const plats = user?.id ? getPlatsByUserId(user.id) : [];


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

        <section aria-label={dict.restaurateur.plats}>
          <h2 className="text-xl font-semibold mb-4">
            {dict.restaurateur.plats} ({plats.length})
          </h2>

          {plats.length === 0 ? (
            <div className="p-8 text-center" role="status" aria-live="polite">
              <p className="text-muted-foreground mb-4">
                {dict.restaurateur.noPlats}
              </p>
              <Button
                onClick={() => router.push(`/${lang}/restaurateur/plats/new-plat`)}
                aria-label={dict.restaurateur.addPlat}
                className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {dict.restaurateur.addPlat}
              </Button>
            </div>
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list">
                {plats.map((resto) => (
                  <Link 
                    href={`/${lang}/restaurants/${resto.id}`}
                    key={resto.id}
                    aria-label={`Voir les détails de ${resto.name}`}
                  >
                    <CardComponent
                      key={resto.id}
                      name={resto.name}
                      id={Number(resto.id) || undefined}
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
