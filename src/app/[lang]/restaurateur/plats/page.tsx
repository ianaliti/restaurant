"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMyMenu } from "@/hooks/useMenu";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import CardComponent from '@/components/card/CardComponent';
import { useDictionary } from "@/components/i18n/DictionaryProvider";

export default function PlatsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'fr';
  const dict = useDictionary();

  // restaurantId = user.id for restaurateur accounts
  const { dishes, isLoading } = useMyMenu(user?.id ?? '');

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
                <Link href={`/${lang}/restaurateur/plats/${dish.id}`} key={dish.id} aria-label={`Voir les détails de ${dish.name}`}>
                  <CardComponent name={dish.name} id={dish.id} image={dish.image} />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
}
