import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';



export async function GET(_req: NextRequest) {
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

    // Proxy through Worker so private R2 bucket stays inaccessible directly
    const photos = (results || [])
      .filter((row: any) => row.url)
      .map((row: any) => {
        const rawUrl: string = row.url;
        const filename = rawUrl.startsWith('http') ? (rawUrl.split('/').pop() ?? rawUrl) : rawUrl;
        return { ...row, url: `/api/photos/${filename}` };
      });

    return NextResponse.json(photos, {
      headers: { 'cache-control': 'private, max-age=300' },
    });
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Generate a safe filename — never trust file.name from the client
    const ext = (file.type.split('/')[1] || 'jpg').replace(/[^a-z0-9]/g, '');
    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    await bucket.put(filename, file.stream(), {
      httpMetadata: { contentType: file.type }
    });

    await db.prepare(
      "INSERT INTO photos (url, caption, uploaded_by, status) VALUES (?, ?, ?, 'pending')"
    ).bind(filename, caption, uploadedBy).run();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error uploading photo:', error);
    return NextResponse.json({ error: `API Error (POST): ${error.message || 'Unknown'}` }, { status: 500 });
  }
}
