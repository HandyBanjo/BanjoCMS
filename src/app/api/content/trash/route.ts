import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: content, error } = await supabase
      .from('content')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('Trash API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trashed content', details: error.message },
      { status: 500 }
    );
  }
}
