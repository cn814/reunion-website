import { getCloudflareContext } from '@opennextjs/cloudflare';

export const runtime = 'edge';

export default async function DiagnosticsPage() {
  let dbStatus = 'Unknown';
  let bucketStatus = 'Unknown';
  let error = null;

  try {
    const context = await getCloudflareContext({ async: true });
    const env = (context as any)?.env;
    dbStatus = env?.DB ? 'Connected' : 'Missing';
    bucketStatus = env?.BUCKET ? 'Connected' : 'Missing';
  } catch (e: any) {
    error = e.message;
  }

  return (
    <html>
      <body style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Production Diagnostics</h1>
        <p><strong>D1 Database (DB):</strong> {dbStatus}</p>
        <p><strong>R2 Bucket (BUCKET):</strong> {bucketStatus}</p>
        {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
        {dbStatus === 'Connected' && bucketStatus === 'Connected' && (
          <p style={{ color: 'green' }}>✅ All bindings are present! The upload crash is likely a schema or permission issue.</p>
        )}
        <hr />
        <p><small>If either say "Missing," please double check your Cloudflare Pages Settings > Functions > Bindings.</small></p>
      </body>
    </html>
  );
}
