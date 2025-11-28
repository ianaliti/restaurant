import { NextResponse } from 'next/server';
import { mockPlats } from '@/mock-data/data';
import { mockRestaurants } from '@/mock-data/data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const plat = mockPlats.find((p) => p.id === id);
  
  if (!plat) {
    return NextResponse.json(
      { data: null, error: 'Plat not found' },
      { status: 404 }
    );
  }
  
  const restaurant = mockRestaurants.find((r) => r.userId === plat.userId);
  
  return NextResponse.json({
    data: {
      plat,
      restaurantId: restaurant?.id || null,
    },
    error: null,
  });
}

