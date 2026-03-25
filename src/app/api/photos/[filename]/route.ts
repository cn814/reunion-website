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

  // Check Cloudflare edge cache — serves instantly without hitting R2 or consuming Worker CPU
  const cache = (caches as any).default as Cache;
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

    // Read fully into memory so it can be safely cloned for the cache
    const buffer = await object.arrayBuffer();

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('cache-control', 'public, max-age=86400');

    const response = new NextResponse(buffer, { headers });

    // Store in Cloudflare edge cache — browser cache clears don't affect this
    await cache.put(cacheKey, response.clone());

    return response;
  } catch (error) {
    console.error('Error fetching image from R2:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
