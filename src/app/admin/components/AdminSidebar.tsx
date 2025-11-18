"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin", label: "Restaurants" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-50 shrink-0 border-r bg-white h-[calc(100vh-56px)] flex flex-col justify-start">
      <div className="p-3">
        <nav className="flex flex-col gap-2">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== '/admin' && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm px-3 py-2 rounded-lg transition-colors ${active ? "bg-primary text-white" : "hover:bg-gray-100"}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-0">
        <Button 
          onClick={handleLogout}
          variant={"outline"}
        >
          Déconnexion
        </Button>
      </div>
    </aside>
  );
}


