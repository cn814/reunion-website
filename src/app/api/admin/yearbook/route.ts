import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

const R2_PUBLIC_BASE = 'https://pub-615a7ab081634ff89d67092401b432b0.r2.dev';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('key') !== 'HUSKY2006') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as any).DB;

    const { results } = await db.prepare(
      'SELECT id, name, photo_url FROM yearbook_photos ORDER BY name ASC'
    ).all();

    return NextResponse.json(results || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as any).DB;
    const bucket = (env as any).BUCKET;

    const formData = await req.formData();
    const key = formData.get('key') as string;
    const name = (formData.get('name') as string)?.trim();
    const file = formData.get('file') as File;

    if (key !== 'HUSKY2006') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!name || !file) {
      return NextResponse.json({ error: 'Name and file are required' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `yearbook/${name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.${ext}`;

    await bucket.put(filename, file.stream(), {
      httpMetadata: { contentType: file.type }
    });

    const photo_url = `${R2_PUBLIC_BASE}/${filename}`;

    await db.prepare(
      'INSERT INTO yearbook_photos (name, photo_url) VALUES (?, ?) ON CONFLICT(name) DO UPDATE SET photo_url = excluded.photo_url'
    ).bind(name, photo_url).run();

    return NextResponse.json({ success: true, photo_url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get('key') !== 'HUSKY2006') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json() as { id: number };
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as any).DB;

    await db.prepare('DELETE FROM yearbook_photos WHERE id = ?').bind(id).run();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
