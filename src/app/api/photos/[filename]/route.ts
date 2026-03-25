import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';



export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const cookie = req.cookies.get('site_auth');
  if (!cookie || cookie.value !== 'ok') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { env } = await getCloudflareContext({ async: true });
    const bucket = env.BUCKET as any;

    if (!bucket) {
      return NextResponse.json({ error: 'R2 Bucket not configured' }, { status: 500 });
    }

    const { filename } = await params;
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
