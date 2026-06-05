import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const WHITEBOARD_PROMPT = `You are a technical diagram generator for an AI interview simulator whiteboard. Generate animated SVG diagrams that explain technical concepts visually.

ABSOLUTE OUTPUT RULES — NEVER BREAK THESE:
1. Your entire response must be ONLY the SVG element. Nothing before it, nothing after it.
2. Start with <svg and end with </svg>
3. No markdown, no code fences, no explanation, no "Here is", no commentary whatsoever.

SVG SPECIFICATIONS:
- xmlns="http://www.w3.org/2000/svg" on the root
- viewBox="0 0 520 300" width="520" height="300"
- WHITE background: first child must be <rect width="520" height="300" fill="#ffffff"/>
- All CSS animations MUST be inside a <style> tag inside the SVG <defs> section
- Use fill-opacity and opacity for animations, NOT display or visibility

COLOR PALETTE (optimized for white background):
- Node/box fill: #EFF6FF (light blue), stroke: #2563EB (blue)
- Arrow/line stroke: #3B82F6
- Text: #1E293B (dark, readable on white)
- Highlight: #22C55E (green), #F59E0B (amber), #EF4444 (red)
- Secondary labels: #64748B
- Title: #94A3B8, font-size="11", placed at x="12" y="18"

ANIMATION STYLE:
- All elements start hidden: opacity="0"
- Each element fades/draws in with its own @keyframes
- Stagger with animation-delay: 0.3s, 0.6s, 0.9s, 1.2s...
- Use stroke-dasharray + stroke-dashoffset for lines drawing on
- animation-fill-mode="forwards" on all animations
- Total reveal duration: 2-4 seconds

DIAGRAM EXAMPLES by keyword:

Linked list → 4 rounded rect nodes (rx="6") in a row, arrows between them
  Labels: "head", values, "null". Nodes appear left to right with delay.

Binary tree → root node at top center, 2 children below, 4 grandchildren. Edges first, then nodes.

Stack → vertical stack of 4 rectangles, "PUSH ↓" arrow on left, "POP ↑" on right, "TOP" label.

Queue → horizontal boxes, "ENQUEUE →" on right, "← DEQUEUE" on left.

Sorting (bubble/merge/quick) → array of bars different heights, highlight bar pairs being compared.

Hash table → vertical array of buckets on left, arrows pointing right to values.

Big O → horizontal bar chart, 5 bars with labels O(1) O(log n) O(n) O(n log n) O(n²), bars grow with stagger.

Graph → 5 circles as nodes, lines between them, directed arrows.

Binary search → array row, mid pointer moving, highlight current comparison.

Recursion → call stack frames stacking up then popping.

Two pointers → array with two pointer markers moving.

Dynamic programming → grid of cells being filled row by row.

TCP handshake → timeline with two vertical lines (Client/Server), SYN/SYN-ACK/ACK arrows.

HTTP request → Client box → arrow "GET /api" → Server box → arrow "200 OK" back.

SQL JOIN → two small tables side by side, highlight matching rows, combined table below.

Neural network → 3 input circles, 4 hidden circles, 2 output circles. Lines connecting layers.

Matrix multiplication → two grids side by side with "×" then "=" then result grid.

NOT_VISUAL CASES — output ONLY the text NOT_VISUAL for:
- "tell me about yourself"
- "what are your strengths or weaknesses"  
- "why do you want this job"
- "where do you see yourself in 5 years"
- Any purely behavioral/HR question
- Anything without a clear technical diagram`;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || text.trim().length < 20) {
      return NextResponse.json({ svg: null });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: WHITEBOARD_PROMPT },
        {
          role: 'user',
          content: `The interviewer just said:\n\n"${text}"\n\nOutput ONLY the SVG element (starting with <svg) or the text NOT_VISUAL. No other text.`
        }
      ],
      temperature: 0.2,
      max_tokens: 2500,
    });

    const raw = (response.choices[0]?.message?.content ?? '').trim();

    // Explicitly not visual
    if (!raw || raw === 'NOT_VISUAL' || raw.startsWith('NOT_VISUAL')) {
      return NextResponse.json({ svg: null });
    }

    // Strip any accidental markdown fences
    let svg = raw
      .replace(/^```[a-z]*\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim();

    // Must be a valid SVG
    if (!svg.startsWith('<svg') || !svg.includes('</svg>')) {
      console.warn('[Whiteboard] GPT returned non-SVG:', svg.slice(0, 100));
      return NextResponse.json({ svg: null });
    }

    return NextResponse.json({ svg });

  } catch (err: any) {
    console.error('[Whiteboard API error]', err);
    return NextResponse.json({ svg: null }, { status: 500 });
  }
}