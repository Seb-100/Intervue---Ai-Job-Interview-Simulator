import { NextResponse } from 'next/server';

const ML_URL = process.env.PYTHON_API_URL ?? 'http://localhost:8000';

// Called silently on dashboard load to pre-warm the Render free tier instance.
// Render spins down after 15min inactivity — this gives it a 35s head start
// so it's awake by the time the user actually uses a feature.
export async function GET() {
  try {
    const res = await fetch(`${ML_URL}/health`, {
      signal: AbortSignal.timeout(35_000),
    });
    const data = await res.json();
    return NextResponse.json({ awake: true, ...data });
  } catch {
    return NextResponse.json({ awake: false }, { status: 200 }); // never fail — fire-and-forget
  }
}
