import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createClient();

    if (body.action === 'restore') {
      const { data, error } = await supabase
        .from('content')
        .update({ deleted_at: null })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to restore content', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Content permanently deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to permanently delete content', details: error.message },
      { status: 500 }
    );
  }
}
