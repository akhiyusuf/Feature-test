import { NextRequest, NextResponse } from 'next/server';
import { alignRecitation, normalizeArabic } from '@/lib/arabic-aligner';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const expectedText = formData.get('expected_text')?.toString() || '';
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    if (!process.env.MODAL_API_URL) {
      console.error('MODAL_API_URL is not set in environment variables');
      return NextResponse.json({ error: 'Modal API URL not configured' }, { status: 500 });
    }

    // Forward the formData to Modal (including expected_text if supported by backend)
    const modalFormData = new FormData();
    modalFormData.append('audio', audioFile);
    if (expectedText) {
      modalFormData.append('expected_text', expectedText);
    }

    const response = await fetch(`${process.env.MODAL_API_URL}`, {
      method: 'POST',
      body: modalFormData,
      headers: {
        ...(process.env.MODAL_API_TOKEN ? { Authorization: `Bearer ${process.env.MODAL_API_TOKEN}` } : {}),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Modal API error: ${response.status} ${response.statusText}. Details: ${errorText}`);
      return NextResponse.json(
        { error: `Failed to process audio: ${response.status}. Details: ${errorText}` },
        { status: response.status }
      );
    }

    const text = await response.text();
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = { text };
    }

    const transcribedText = data.text || data.transcription || data.message || '';

    // If expected_text was provided, run word-level Arabic alignment and mistake detection
    let alignment = null;
    if (expectedText) {
      alignment = alignRecitation(transcribedText, expectedText);
    }

    return NextResponse.json({
      success: true,
      text: transcribedText,
      normalizedText: normalizeArabic(transcribedText),
      expectedText,
      alignment,
      isMatch: alignment ? alignment.isMatch : true,
      score: alignment ? alignment.score : 100,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in /api/recite:', error);
    return NextResponse.json({ error: `Internal server error: ${message}` }, { status: 500 });
  }
}
