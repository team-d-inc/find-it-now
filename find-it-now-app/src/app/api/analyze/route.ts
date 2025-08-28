import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const edgeEndpoint = `${process.env.EDGE_FUNCTIONS_URL}/openai-lost-item-completion`;
    const req = await fetch(edgeEndpoint, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const result = await req.json();

    if (!result.ok) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Matching results API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
