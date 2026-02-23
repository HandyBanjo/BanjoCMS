
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Content not found' }, { status: 404 });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch content', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createClient();

    // Map fields
    const updates: any = {
      title: body.title,
      slug: body.slug,
      body: body.body,
      excerpt: body.excerpt,
      status: body.status,
      featured_image: body.featured_image || body.featuredImage,
      metadata: body.metadata,
      
      // Specialized fields
      platform: body.platform,
      update_type: body.update_type,
      version: body.version,
      external_link: body.external_link,
      parent_id: body.parent_id,
      
      updated_at: new Date().toISOString(),
    };
    
    // Remove undefined
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const { data, error } = await supabase
      .from('content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update content', details: error.message },
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
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete content', details: error.message },
      { status: 500 }
    );
  }
}
