import { NextResponse } from 'next/server';
import { mockRestaurants } from '@/mock-data/data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const idNumber = Number(id);
  const restaurant = mockRestaurants.find((r) => r.id === idNumber);
  
  if (!restaurant) {
    return NextResponse.json(
      { data: null, error: 'Restaurant not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ data: restaurant, error: null });
}

