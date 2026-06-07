import { NextRequest, NextResponse } from 'next/server';

const ML_URL = process.env.PYTHON_API_URL ?? 'http://localhost:8000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${ML_URL}/salary-predict`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
      signal:  AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'ML service error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'ML service unavailable', fallback: true },
      { status: 503 },
    );
  }
}
