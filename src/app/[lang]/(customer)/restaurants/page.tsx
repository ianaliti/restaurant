import { getRestaurants } from '@/lib/data/getRestaurants';
import { RestaurantsList } from '@/components/restaurants/RestaurantsList';
import { getDictionary } from '../../dictionaries';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'fr' | 'en' }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return {
    title: dict.restaurants.title,
    description: dict.restaurants.noRestaurants,
  };
}

export default async function RestaurantsPage({
  params,
}: {
  params: Promise<{ lang: 'fr' | 'en' }>;
}) {
  const { lang } = await params;
  const restaurants = await getRestaurants();
  const dict = await getDictionary(lang);

  return (
    <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold">{dict.restaurants.title}</h1>
      <RestaurantsList restaurants={restaurants} lang={lang} />
    </main>
  );
}
