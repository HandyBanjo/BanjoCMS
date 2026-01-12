import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Content, ContentQuery } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Base params
    const status = searchParams.get('status');
    const contentType = searchParams.get('contentType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Advanced filters
    const platform = searchParams.get('platform');
    const parentId = searchParams.get('parentId'); // 'null' string checks for root items
    const updateType = searchParams.get('updateType');
    const search = searchParams.get('search');

    const db = await getDatabase();
    const collection = db.collection<Content>('content');

    const query: any = {};

    if (status && status !== 'all') query.status = status;
    if (contentType && contentType !== 'all') query.contentType = contentType;
    if (platform && platform !== 'all') query.platform = platform;
    if (updateType && updateType !== 'all') query.updateType = updateType;

    // Handle parentId filtering for Resources
    if (parentId !== null && parentId !== undefined) {
      if (parentId === 'root') {
        query.parentId = { $in: [null, undefined] };
      } else {
        query.parentId = parentId;
      }
    }

    // Unified Search
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [
        { title: searchRegex },
        { body: searchRegex },
        { summary: searchRegex },
        { excerpt: searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const [content, total] = await Promise.all([
      collection
        .find(query)
        .sort({ publishedAt: -1, createdAt: -1 }) // Sort by newest
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query),
    ]);

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

    const db = await getDatabase();
    const collection = db.collection<Content>('content');

    // Create base content object
    const newContent = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        views: 0,
        likes: 0,
        tags: body.metadata?.tags || [],
        categories: body.metadata?.categories || [],
        seo: body.metadata?.seo || {},
        ...(body.metadata || {}), // Spread remaining generic metadata
      },
    };

    // Auto-set publishedAt if status is published
    if (body.status === 'published' && !body.publishedAt) {
      newContent.publishedAt = new Date();
    }

    const result = await collection.insertOne(newContent as Content);

    return NextResponse.json(
      {
        message: 'Content created successfully',
        id: result.insertedId
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
