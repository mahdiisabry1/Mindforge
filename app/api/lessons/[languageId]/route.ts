import { NextResponse } from 'next/server';
import { lessonDb } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ languageId: string }> }
) {
  try {
    const { languageId } = await params;
    const lessons = await lessonDb.findByLanguage(languageId);
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}
