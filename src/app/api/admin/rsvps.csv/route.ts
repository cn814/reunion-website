import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (key !== 'HUSKY2006') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as any).DB;

    const { results } = await db.prepare(
      `SELECT id, name, maiden_name, attending, guest_name, email, dietary, suggestions, created_at
       FROM rsvps ORDER BY created_at DESC`
    ).all();

    const rows = results || [];
    const header = ['ID', 'Name', 'Preferred Name', 'Attending', 'Guest', 'Email', 'Dietary', 'Suggestions', 'Submitted'];
    const csv = [
      header.join(','),
      ...rows.map((r: any) => [
        r.id,
        r.name,
        r.maiden_name || '',
        r.attending,
        r.guest_name || '',
        r.email,
        r.dietary || '',
        r.suggestions || '',
        r.created_at,
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'content-type': 'text/csv',
        'content-disposition': 'attachment; filename="rsvps.csv"',
      },
    });
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
