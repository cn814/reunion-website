import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

// Public endpoint — returns only name + attending status, no personal info
export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as any).DB;

    if (!db) {
      return NextResponse.json([], { status: 200 });
    }

    const { results } = await db.prepare(
      'SELECT name, attending FROM rsvps ORDER BY created_at DESC'
    ).all();

    return NextResponse.json(results || []);
  } catch {
    return NextResponse.json([]);
  }
}
