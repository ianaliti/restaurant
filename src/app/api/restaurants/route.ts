import { NextResponse } from 'next/server';
import { mockRestaurants } from '@/mock-data/data';

export async function GET() {
  return NextResponse.json({
    data: mockRestaurants,
    error: null,
  });
}

