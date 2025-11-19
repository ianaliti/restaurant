'use client';


import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

    const handleLogout = () => {
    logout();            
    router.push("/restaurants"); 
  };

  return (
    <nav aria-label="Navigation principale" className="w-full bg-white/80 backdrop-blur shadow-sm">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6">
        <Link
          href="/restaurants"
          className="text-lg font-semibold tracking-tight focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          aria-label="Aller à la page des restaurants"
        >
          Restaurants
        </Link>
        <ul className="flex items-center gap-6 text-sm list-none" role="list">
          <li>
            <Link 
              className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2" 
              href="/cart"
              aria-label="Voir le panier"
            >
              Panier
            </Link>
          </li>
          {user?.role === 'customer' && (
            <li>
              <Link
                className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2"
                href="/commands"
                aria-label="Voir mes commandes"
              >
                Commandes
              </Link>
            </li>
          )}
          {!user ? (
            <li>
              <Link
                className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2"
                href="/login"
                aria-label="Se connecter"
              >
                Se Connecter
              </Link>
            </li>
          ) : (
            <>
              <li>
                <button
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2"
                  onClick={handleLogout}
                  aria-label="Se déconnecter"
                >
                 Déconnexion
                </button>
              </li>
              {user.role === 'customer' && (
                <li>
                  <Link
                    className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2"
                    href="/profile"
                    aria-label="Voir mon profil"
                  >
                    Mon Profil
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
