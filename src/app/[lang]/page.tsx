import { redirect } from 'next/navigation';

export default async function LangPage({
  params,
}: {
  params: Promise<{ lang: 'fr' | 'en' }>;
}) {
  const { lang } = await params;
  redirect(`/${lang}/restaurants`);
}
