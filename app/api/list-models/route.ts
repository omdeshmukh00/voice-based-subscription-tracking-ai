import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not set in environment variables' },
      { status: 500 }
    );
  }

  try {
    // The Google Generative AI SDK for Node.js does not currently expose a listModels method directly
    // on the GoogleGenerativeAI client class in the same way as the Python SDK.
    // We use the REST API directly to list available models.
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Google API responded with ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error listing models:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list models' },
      { status: 500 }
    );
  }
}
