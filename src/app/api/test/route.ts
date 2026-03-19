export const runtime = 'edge';

export async function GET() {
  return new Response('{"message": "Strictly Zero Import Success"}', {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
