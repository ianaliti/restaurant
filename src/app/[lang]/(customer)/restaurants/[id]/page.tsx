import { notFound } from 'next/navigation';
import { getRestaurantById } from '@/lib/data/getRestaurants';
import { getPlats } from '@/lib/data/getPlats';
import { RestaurantDetail } from '@/components/restaurants/RestaurantDetail';
import { getDictionary } from '../../../dictionaries';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: 'fr' | 'en'; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  const idNumber = Number(id);
  const restaurant = await getRestaurantById(idNumber);
  const dict = await getDictionary(lang);

  if (!restaurant) {
    return {
      title: dict.restaurants.title,
    };
  }

  return {
    title: `${restaurant.name} - Resto Digital`,
    description: `${restaurant.name} - ${restaurant.address}, ${restaurant.codePostal} ${restaurant.city}`,
    openGraph: {
      images: [restaurant.image],
    },
  };
}

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ lang: 'fr' | 'en'; id: string }>;
}) {
  const { lang, id } = await params;
  const idNumber = Number(id);
  const dict = await getDictionary(lang);
  
  const restaurant = await getRestaurantById(idNumber);
  const plats = await getPlats();

  return <RestaurantDetail restaurant={restaurant} plats={plats} lang={lang} dict={dict} />;
}
