import { getDictionary } from './dictionaries'
import { DictionaryProvider } from "@/components/i18n/DictionaryProvider";

export async function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const validLang = (lang === 'en' || lang === 'fr') ? lang : 'fr';
  const dict = await getDictionary(validLang);

  return (
    <DictionaryProvider dictionary={dict}>
      {children}
    </DictionaryProvider>
  );
}
