import { NextRequest, NextResponse } from 'next/server';
import { handleMatchRequest } from '@/lib/matching/handler';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> },
) {
  try {
    const resolvedParams = await params;
    const result = await handleMatchRequest(request, resolvedParams.reportId);

    if (!result.success) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Matching results API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
