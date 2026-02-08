
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = await createClient();

    // Base params
    const status = searchParams.get('status');
    const contentType = searchParams.get('contentType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Filter building
    let query = supabase
      .from('content')
      .select('*', { count: 'exact' });

    if (status && status !== 'all') query = query.eq('status', status);
    if (contentType && contentType !== 'all') query = query.eq('content_type', contentType);
    
    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data: content, error, count } = await query;

    if (error) throw error;

    const total = count || 0;
    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      content,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    });
  } catch (error: any) {
    console.error('Content API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Transform payload to match SQL schema
    const newContent = {
      title: body.title,
      slug: body.slug,
      content_type: body.content_type || body.contentType || 'post',
      status: body.status,
      body: body.body,
      excerpt: body.excerpt,
      featured_image: body.featured_image || body.featuredImage, // Support both snake/camel
      author_id: user.id,
      author_email: user.email,
      author_name: body.author?.name || 'Admin',
      
      // Specialized fields
      platform: body.platform,
      update_type: body.update_type,
      version: body.version,
      external_link: body.external_link,
      parent_id: body.parent_id,

      metadata: body.metadata || {},
      published_at: body.status === 'published' ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from('content')
      .insert(newContent)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        message: 'Content created successfully',
        content: data
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Content creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create content', details: error.message },
      { status: 500 }
    );
  }
}
