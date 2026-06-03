import { NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await fetch(`${BACKEND}/api/restaurants/${id}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await fetch(`${BACKEND}/api/restaurants/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: request.headers.get('Authorization') ?? '',
    },
  });

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
