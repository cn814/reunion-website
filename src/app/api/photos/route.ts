import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const runtime = 'edge';

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.DB as any;

    const { results } = await db.prepare(
      "SELECT * FROM photos WHERE status = 'approved' ORDER BY created_at DESC"
    ).all();

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.DB as any;
    const bucket = env.BUCKET as any;

    if (!bucket) {
      return NextResponse.json({ error: 'R2 Bucket not configured' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;
    const uploadedBy = formData.get('uploaded_by') as string;

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
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }
}
