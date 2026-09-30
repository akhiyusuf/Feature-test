import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  
  if (!process.env.MODAL_API_URL) {
    return NextResponse.json({ error: 'Modal API URL not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(`${process.env.MODAL_API_URL}/process-audio`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${process.env.MODAL_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error(`Modal API error: ${response.status} ${response.statusText}`);
      return NextResponse.json({ error: `Failed to process audio: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to Modal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
