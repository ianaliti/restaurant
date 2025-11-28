"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { useDictionary } from "@/components/i18n/DictionaryProvider";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const dict = useDictionary();

  const lang = pathname?.split('/')[1] || 'fr';
  const adminHref = `/${lang}/admin`;

  const handleLogout = () => {
    logout();
    router.push(`/${lang}/login`);
  };

  const isActive = pathname === adminHref || pathname?.startsWith(`/${lang}/admin`);

  return (
    <aside aria-label={`${dict.admin.title} - ${dict.common.mainNavigation}`} className='w-50 shrink-0 border-r bg-white sticky top-0 h-[calc(100vh-4rem)] flex flex-col'>
      <div className="p-3 flex-1 overflow-y-auto">
        <nav aria-label={dict.common.mainNavigation} className="flex flex-col gap-2">
          <Link
            href={adminHref}
            className={`text-sm px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 inline-flex items-center justify-center ${
              isActive 
                ? "bg-primary text-white" 
                : "hover:bg-gray-100 bg-white border border-gray-300"
            }`}
            aria-current={isActive ? 'page' : undefined}
            aria-label={dict.common.goToRestaurantsPage}
          >
            {dict.common.restaurants}
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


