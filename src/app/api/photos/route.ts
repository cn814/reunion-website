import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({ message: 'Minimal GET success' });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Minimal POST success' });
}
