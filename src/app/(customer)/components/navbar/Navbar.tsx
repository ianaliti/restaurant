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
    <nav className="w-full bg-white/80 backdrop-blur shadow-sm">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6">
        <Link
          href="/restaurants"
          className="text-lg font-semibold tracking-tight"
        >
          Restaurants
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link className="hover:text-primary transition-colors" href="/cart">
            Panier
          </Link>
          {user?.role === 'customer' && (
            <Link
              className="hover:text-primary transition-colors"
              href="/commands"
            >
              Commandes
            </Link>
          )}
          {!user ? (
            <Link
              className="hover:text-primary transition-colors"
              href="/login"
            >
              Se Connecter
            </Link>
          ) : (
            <>
              <button
                className="hover:text-primary transition-colors"
                onClick={handleLogout}
              >
               Logout
              </button>
              {user.role === 'customer' && (
                <Link
                  className="hover:text-primary transition-colors"
                  href="/profile"
                >
                  Mon Profil
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
