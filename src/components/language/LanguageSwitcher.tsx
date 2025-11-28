'use client';

import { usePathname, useRouter } from 'next/navigation';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLang = pathname?.split('/')[1] || 'fr';
  const nextLang = currentLang === 'fr' ? 'en' : 'fr';

  const toggleLanguage = () => {
    if (!pathname) return;
    const pathWithoutLang = pathname.split('/').slice(2).join('/');
    router.push(`/${nextLang}${pathWithoutLang ? `/${pathWithoutLang}` : ''}`);
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="text-xs font-medium px-2 py-1 border rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label={currentLang === 'fr' ? 'Passer le site en anglais' : 'Basculer le site en français'}
    >
      {currentLang === 'fr' ? 'FR / EN' : 'EN / FR'}
    </button>
  );
}

