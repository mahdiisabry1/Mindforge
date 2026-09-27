import { NextResponse } from 'next/server';
import { userProgressDb } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { hearts, progressId } = body;

    // Update user progress hearts
    const updatedProgress = await userProgressDb.update(progressId, {
      hearts,
    });

    if (!updatedProgress) {
      return NextResponse.json(
        { error: 'Progress not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProgress);
  } catch (error) {
    console.error('Error updating hearts:', error);
    return NextResponse.json(
      { error: 'Failed to update hearts' },
      { status: 500 }
    );
  }
}
