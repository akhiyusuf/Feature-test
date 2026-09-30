import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  
  if (!process.env.MODAL_API_URL) {
    console.error('MODAL_API_URL is not set in environment variables');
    return NextResponse.json({ error: 'Modal API URL not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(`${process.env.MODAL_API_URL}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${process.env.MODAL_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Modal API error: ${response.status} ${response.statusText}. Details: ${errorText}`);
      return NextResponse.json({ error: `Failed to process audio: ${response.status}. Details: ${errorText}` }, { status: response.status });
    }

    const text = await response.text();
    console.log('Raw response from Modal:', text);
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error proxying to Modal:', error);
    return NextResponse.json({ error: `Internal server error: ${message}` }, { status: 500 });
  }
}
