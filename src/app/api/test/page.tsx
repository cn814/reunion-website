export const runtime = 'edge';

export default function DiagnosticsPage() {
  return (
    <html>
      <body style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Static Test Success</h1>
        <p>If you can see this, the Edge Runtime is working for static content.</p>
      </body>
    </html>
  );
}
