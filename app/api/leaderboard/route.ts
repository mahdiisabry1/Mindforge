import { NextResponse } from 'next/server';
import { leaderboardDb } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const leaderboardEntry = await leaderboardDb.findByUserId(userId);
    return NextResponse.json(leaderboardEntry);
  } catch (error) {
    console.error('Error fetching leaderboard entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard entry' },
      { status: 500 }
    );
  }
}
