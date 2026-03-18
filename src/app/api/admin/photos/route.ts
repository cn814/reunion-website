import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// GET all photos for admin
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    
    // Simple key check
    if (key !== 'HUSKY2006') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { env } = getRequestContext() as any;
    const db = env.DB;

    const { results } = await db.prepare(
      "SELECT * FROM photos ORDER BY created_at DESC"
    ).all();

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching admin photos:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

// POST update photo status
export async function POST(req: NextRequest) {
  try {
    const { id, status, key } = await req.json();

    if (key !== 'HUSKY2006') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { env } = getRequestContext() as any;
    const db = env.DB;

    await db.prepare(
      "UPDATE photos SET status = ? WHERE id = ?"
    ).bind(status, id).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating photo status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
