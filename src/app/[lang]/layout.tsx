import { getDictionary } from './dictionaries'
import { DictionaryProvider } from "@/components/i18n/DictionaryProvider";

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: 'fr' | 'en' }>;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <DictionaryProvider dictionary={dict}>
      {children}
    </DictionaryProvider>
  );
}
