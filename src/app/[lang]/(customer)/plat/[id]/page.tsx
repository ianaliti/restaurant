import { getPlatWithRestaurant } from '@/lib/data/getPlats';
import { PlatDetailWrapper } from '@/components/plats/PlatDetailWrapper';
import { BackButton } from '@/components/ui/BackButton';
import { getDictionary } from '../../../dictionaries';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'fr' | 'en'; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  const idNumber = Number(id);
  const result = await getPlatWithRestaurant(idNumber);
  const dict = await getDictionary(lang);

  if (!result) {
    return {
      title: dict.restaurants.title,
    };
  }

  const { plat } = result;

  return {
    title: `${plat.name} - ${plat.price}€ | Resto Digital`,
    description: `Découvrez ${plat.name} - ${plat.price}€. Commandez en ligne sur Resto Digital.`,
    openGraph: {
      images: [plat.image],
    },
  };
}

export default async function PlatDetailPage({
  params,
}: {
  params: Promise<{ lang: 'fr' | 'en'; id: string }>;
}) {
  const { lang, id } = await params;
  const idNumber = Number(id);
  const result = await getPlatWithRestaurant(idNumber);

  return (
    <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <BackButton lang={lang} />
      <PlatDetailWrapper serverResult={result} id={idNumber} lang={lang} />
    </main>
  );
}
