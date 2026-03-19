import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const runtime = 'edge';

export async function GET() {
  try {
    const context = await getCloudflareContext({ async: true });
    const env = (context as any)?.env;
    const db = env?.DB;

    if (!db) {
      return NextResponse.json({ 
        error: 'Database binding (DB) is missing.', 
        suggestion: 'Go to your Cloudflare Pages dashboard > Settings > Functions > D1 Database Bindings and add a binding named "DB" to your "reunion-db" database.'
      }, { status: 500 });
    }

    const { results } = await db.prepare(
      "SELECT * FROM photos WHERE status = 'approved' ORDER BY created_at DESC"
    ).all();

    return NextResponse.json(results || []);
  } catch (error: any) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: `API Error (GET): ${error.message || 'Unknown'}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = await getCloudflareContext({ async: true });
    const env = (context as any)?.env;
    const db = env?.DB;
    const bucket = env?.BUCKET;

    if (!db || !bucket) {
      return NextResponse.json({ 
        error: 'Cloudflare bindings are missing.',
        details: `DB: ${!!db}, BUCKET: ${!!bucket}`,
        suggestion: 'Ensure D1 and R2 bindings are configured in your Cloudflare dashboard with names "DB" and "BUCKET".'
      }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const caption = (formData.get('caption') as string) || '';
    const uploadedBy = (formData.get('uploaded_by') as string) || 'Anonymous';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name}`;
    await bucket.put(filename, file.stream(), {
      httpMetadata: { contentType: file.type }
    });

    const url = `/api/photos/${filename}`;

    await db.prepare(
      "INSERT INTO photos (url, caption, uploaded_by, status) VALUES (?, ?, ?, 'pending')"
    ).bind(url, caption, uploadedBy).run();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error uploading photo:', error);
    return NextResponse.json({ error: `API Error (POST): ${error.message || 'Unknown'}` }, { status: 500 });
  }
}
