import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as any).DB;

    if (!db) {
      return NextResponse.json({ error: 'Database binding missing' }, { status: 500 });
    }

    const { results } = await db.prepare(
      'SELECT name, photo_url FROM yearbook_photos ORDER BY name ASC'
    ).all();

    return NextResponse.json(results || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
