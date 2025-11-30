"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { useDictionary } from "@/components/i18n/DictionaryProvider";
import { Button } from "@/components/ui/button";

export default function RestoSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const dict = useDictionary();

  const lang = pathname?.split('/')[1] || 'fr';
  const dashboardHref = `/${lang}/restaurateur`;
  const platsHref = `/${lang}/restaurateur/plats`;
  const commandesHref = `/${lang}/restaurateur/commandes`;

  const handleLogout = () => {
    logout();
    router.push(`/${lang}/restaurants`);
  };

  const isDashboardActive = pathname === dashboardHref;
  const isPlatsActive = pathname === platsHref || pathname?.startsWith(platsHref);
  const isCommandesActive = pathname === commandesHref || pathname?.startsWith(commandesHref);

  return (
    <aside aria-label={`${dict.restaurateur.restaurant} - ${dict.common.mainNavigation}`} className="w-48 shrink-0 border-r bg-white sticky top-0 h-[calc(100vh-4rem)] flex flex-col">
      <div className="p-3 flex-1 overflow-y-auto">
        <nav aria-label={dict.common.mainNavigation} className="flex flex-col gap-2">
          <Link
            href={dashboardHref}
            className={`text-sm px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 inline-flex items-center justify-center ${
              isDashboardActive 
                ? "bg-primary text-white" 
                : "hover:bg-gray-100 bg-white border border-gray-300"
            }`}
            aria-current={isDashboardActive ? "page" : undefined}
            aria-label={`${dict.common.back} ${dict.restaurateur.dashboard}`}
          >
            {dict.restaurateur.dashboard}
          </Link>
          <Link
            href={platsHref}
            className={`text-sm px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 inline-flex items-center justify-center ${
              isPlatsActive 
                ? "bg-primary text-white" 
                : "hover:bg-gray-100 bg-white border border-gray-300"
            }`}
            aria-current={isPlatsActive ? "page" : undefined}
            aria-label={`${dict.common.back} ${dict.restaurateur.plats}`}
          >
            {dict.restaurateur.plats}
          </Link>
          <Link
            href={commandesHref}
            className={`text-sm px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 inline-flex items-center justify-center ${
              isCommandesActive 
                ? "bg-primary text-white" 
                : "hover:bg-gray-100 bg-white border border-gray-300"
            }`}
            aria-current={isCommandesActive ? "page" : undefined}
            aria-label={`${dict.common.back} ${dict.restaurateur.orders}`}
          >
            {dict.restaurateur.orders}
          </Link>
        </nav>
      </div>
      <div className="p-3 space-y-2 border-t shrink-0">
        <div className="flex justify-center">
          <LanguageSwitcher />
        </div>
        <Button 
          onClick={handleLogout}
          variant={"outline"}
          aria-label={dict.common.logout}
          className='w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
        >
          {dict.common.logout}
        </Button>
      </div>
    </aside>
  );
}


