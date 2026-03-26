import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function POST(req: NextRequest) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as any).DB;

    if (!db) {
      return NextResponse.json({ error: 'Database binding missing' }, { status: 500 });
    }

    const { name, maiden_name, attending, guest_name, email, dietary, suggestions } = await req.json() as any;

    if (!name || !email || !attending) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await db.prepare(
      `INSERT INTO rsvps (name, maiden_name, attending, guest_name, email, dietary, suggestions)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(name) DO UPDATE SET
         maiden_name = excluded.maiden_name,
         attending = excluded.attending,
         guest_name = excluded.guest_name,
         email = excluded.email,
         dietary = excluded.dietary,
         suggestions = excluded.suggestions,
         created_at = CURRENT_TIMESTAMP`
    ).bind(name, maiden_name || '', attending, guest_name || '', email, dietary || '', suggestions || '').run();

    const webhookUrl = (env as any).GOOGLE_SHEETS_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (webhookUrl) {
      const { ctx } = await getCloudflareContext({ async: true });
      ctx.waitUntil(
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, maiden_name: maiden_name || '', attending, guest_name: guest_name || '', email, dietary: dietary || '', suggestions: suggestions || '' }),
        }).catch(() => {})
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('RSVP error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save RSVP' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    if (key !== 'HUSKY2006') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { env } = await getCloudflareContext({ async: true });
    const db = (env as any).DB;

    const { results } = await db.prepare(
      `SELECT * FROM rsvps ORDER BY created_at DESC LIMIT 200`
    ).all();

    // Derive yearbook photo URL from name (static files)
    const enriched = (results || []).map((r: any) => ({
      ...r,
      yearbook_photo: `/photos/yearbook-photos/${encodeURIComponent(r.name)}.jpg`,
    }));

    return NextResponse.json(enriched);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
