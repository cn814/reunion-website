import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const runtime = 'edge';

export async function GET() {
  try {
    const context = await getCloudflareContext({ async: true });
    const env = (context as any)?.env;
    const db = env?.DB;

    if (!db) {
      return new Response('Database binding (DB) is missing. Check Cloudflare Pages/Workers configuration.', { status: 500 });
    }

    const { results } = await db.prepare(
      "SELECT * FROM photos WHERE status = 'approved' ORDER BY created_at DESC"
    ).all();

    return NextResponse.json(results || []);
  } catch (error: any) {
    console.error('Error fetching photos:', error);
    return new Response(`API Error (GET): ${error.message || 'Unknown'}`, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = await getCloudflareContext({ async: true });
    const env = (context as any)?.env;
    const db = env?.DB;
    const bucket = env?.BUCKET;

    if (!db || !bucket) {
      return new Response(`Bindings missing: DB=${!!db}, BUCKET=${!!bucket}`, { status: 500 });
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
    return new Response(`API Error (POST): ${error.message || 'Unknown'}`, { status: 500 });
  }
}
