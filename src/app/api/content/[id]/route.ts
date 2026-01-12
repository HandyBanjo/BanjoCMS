import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Content } from '@/lib/models';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const collection = db.collection<Content>('content');

    const content = await collection.findOne({ _id: new ObjectId(id) });

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { 'metadata.views': 1 } }
    );

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('Content fetch error:', error);
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

    const db = await getDatabase();
    const collection = db.collection<Content>('content');

    const updateData: any = {
      ...body,
      updatedAt: new Date(),
    };

    // Set publishedAt if status changed to published
    if (body.status === 'published' && !body.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Content updated successfully' });
  } catch (error: any) {
    console.error('Content update error:', error);
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
    const db = await getDatabase();
    const collection = db.collection<Content>('content');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error: any) {
    console.error('Content deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete content', details: error.message },
      { status: 500 }
    );
  }
}
