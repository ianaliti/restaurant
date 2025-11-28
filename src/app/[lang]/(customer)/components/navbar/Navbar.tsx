'use client';

import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useDictionary } from "@/components/i18n/DictionaryProvider";
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const dict = useDictionary();
  
  const lang = pathname?.split('/')[1] || 'fr';

  const handleLogout = () => {
    logout();            
    router.push(`/${lang}/restaurants`); 
  };

  return (
    <nav aria-label={dict.common.mainNavigation} className="w-full bg-white/80 backdrop-blur shadow-sm">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6">
        <Link
          href={`/${lang}/restaurants`}
          className="text-lg font-semibold tracking-tight focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          aria-label={dict.common.goToRestaurantsPage}
        >
          {dict.common.restaurants}
        </Link>
        <ul className="flex items-center gap-6 text-sm list-none" role="list">
          <li>
            <Link 
              className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2" 
              href={`/${lang}/cart`}
              aria-label={dict.common.viewCart}
            >
              {dict.common.cart}
            </Link>
          </li>
          {user?.role === 'customer' && (
            <li>
              <Link
                className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2"
                href={`/${lang}/commands`}
                aria-label={dict.common.viewOrders}
              >
                {dict.common.orders}
              </Link>
            </li>
          )}
          {!user ? (
            <li>
              <Link
                className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2"
                href={`/${lang}/login`}
                aria-label={dict.common.login}
              >
                {dict.common.login}
              </Link>
            </li>
          ) : (
            <>
              <li>
                <button
                  className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2"
                  onClick={handleLogout}
                  aria-label={dict.common.logout}
                >
                 {dict.common.logout}
                </button>
              </li>
              {user.role === 'customer' && (
                <li>
                  <Link
                    className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2"
                    href={`/${lang}/profile`}
                    aria-label={dict.common.viewProfile}
                  >
                    {dict.common.profile}
                  </Link>
                </li>
              )}
            </>
          )}
          <li>
            <LanguageSwitcher />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
