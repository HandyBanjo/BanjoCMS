// Cron job to keep Supabase active. This file will be triggered by a service like Vercel Cron.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/content?limit=1`);
    if (!response.ok) throw new Error('Cron ping failed');
    return Response.json({ status: 'ok', message: 'Database pinged successfully' });
  } catch (error: any) {
    return Response.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
