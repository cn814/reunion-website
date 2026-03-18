import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { env } = getRequestContext() as any;
    const bucket = env.BUCKET;

    if (!bucket) {
      return NextResponse.json({ error: 'R2 Bucket not configured' }, { status: 500 });
    }

    const { filename } = params;
    const object = await bucket.get(filename);

    if (!object) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);

    return new NextResponse(object.body, { headers });
  } catch (error) {
    console.error('Error fetching image from R2:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
