import { NextResponse } from 'next/server';
import { mockPlats } from '@/mock-data/data';

export async function GET() {
  return NextResponse.json({ data: mockPlats, error: null });
}

