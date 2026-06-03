import { NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function GET() {
  const res = await fetch(`${BACKEND}/api/restaurants`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: Request) {
  const body = await request.text();
  const res = await fetch(`${BACKEND}/api/restaurants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: request.headers.get('Authorization') ?? '',
    },
    body,
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
