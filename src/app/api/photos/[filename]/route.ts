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

  const { filename } = await params;

  // Check Cloudflare edge cache first — avoids R2 fetch and Worker CPU on repeat requests
  const cache = caches.default;
  const cacheKey = new Request(`https://cache.internal/photos/${filename}`);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const { env } = await getCloudflareContext({ async: true });
    const bucket = env.BUCKET as any;

    if (!bucket) {
      return NextResponse.json({ error: 'R2 Bucket not configured' }, { status: 500 });
    }

    const object = await bucket.get(filename);

    if (!object) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('cache-control', 'public, max-age=86400'); // 24h edge cache

    const response = new NextResponse(object.body, { headers });

    // Store in Cloudflare edge cache so future requests skip R2 entirely
    await cache.put(cacheKey, response.clone());

    return response;
  } catch (error) {
    console.error('Error fetching image from R2:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
