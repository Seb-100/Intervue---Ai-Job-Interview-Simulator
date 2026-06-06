import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─────────────────────────────────────────────────────────────────────────────
// System prompt — receives a clean user question, not noisy avatar speech
// ─────────────────────────────────────────────────────────────────────────────
const WHITEBOARD_PROMPT = `You are a technical diagram generator embedded in an AI interview simulator.

You receive the exact question a user asked their AI interviewer. Your job:
1. Decide if the question involves a concept that benefits from a visual diagram.
2. If yes → output ONLY a valid SVG diagram.
3. If no  → output ONLY the text: NOT_VISUAL

─── WHEN TO DRAW ───────────────────────────────────────────────────────────────
Draw for any question about:
- Data structures: array, stack, queue, linked list, doubly linked list, tree,
  binary tree, BST, heap, trie, graph, adjacency list/matrix, hash map/table,
  hash set, deque, priority queue
- Algorithms: binary search, linear search, bubble/merge/quick/insertion sort,
  DFS, BFS, Dijkstra, dynamic programming, two pointers, sliding window,
  recursion/call stack, backtracking
- Complexity: Big O notation, time/space complexity comparison
- System design: HTTP request/response, TCP handshake, REST API flow,
  load balancer, CDN, cache, pub/sub, message queue, microservices,
  database indexing, SQL JOIN, sharding
- CS concepts: memory layout, stack vs heap, pointers, garbage collection,
  process vs thread, mutex/semaphore, neural network layers, matrix operations

─── WHEN NOT TO DRAW (output NOT_VISUAL) ───────────────────────────────────────
- Behavioral questions ("tell me about yourself", "strengths/weaknesses")
- HR questions ("why this company", "where do you see yourself")
- Vague greetings or small talk
- Questions about soft skills, culture, salary, remote work

─── SVG RULES ──────────────────────────────────────────────────────────────────
ABSOLUTE: Your entire response is ONLY the SVG element. Zero text before or after.
Start with <svg   End with </svg>   No markdown. No explanation. No \`\`\`.

Specs:
- xmlns="http://www.w3.org/2000/svg"
- viewBox="0 0 520 300"  (do NOT add width/height — let the browser scale it)
- First child: <rect width="520" height="300" fill="#ffffff"/>
- All CSS animations inside <defs><style>…</style></defs>
- Use opacity for show/hide (never display:none)
- animation-fill-mode: forwards on every animation

Color palette (white background):
- Box fill: #EFF6FF   Box stroke: #2563EB
- Arrow/line: #3B82F6
- Text (primary): #1E293B    Text (secondary): #64748B
- Highlight green: #22C55E   Highlight amber: #F59E0B   Highlight red: #EF4444
- Title: font-size="11" fill="#94A3B8" at x="12" y="18"

Animations:
- All elements start at opacity="0"
- Stagger reveals: 0.3s, 0.6s, 0.9s, 1.2s, 1.5s …
- Lines: stroke-dasharray + stroke-dashoffset draw-on effect
- Total reveal: 2–4 seconds

─── DIAGRAM REFERENCE ──────────────────────────────────────────────────────────

STACK → vertical column of 4 rounded rects (rx="6"), top-to-bottom: "TOP", values, "BOTTOM"
  Left side: "PUSH ↓" arrow. Right side: "POP ↑" arrow. Title: "Stack – LIFO"

QUEUE → horizontal row of 4 rects. Left: "← DEQUEUE". Right: "ENQUEUE →". Title: "Queue – FIFO"

LINKED LIST → 4 rounded rects in a row, arrows between them, last points to "null". Label "head" under first.

DOUBLY LINKED LIST → like linked list but arrows go both directions (←→)

BINARY TREE → root centered top, 2 children below, 4 grandchildren. Edges drawn first, then nodes. Label each node.

BST → binary tree but left children < root < right children. Show values 50, 30, 70, 20, 40.

HEAP (max) → binary tree where parent > children. Show values 90, 70, 80, 50, 60.

HASH MAP → left column of 8 bucket boxes labeled [0]..[7]. Some buckets have →key:value arrows to the right.

GRAPH → 5 circles as nodes, labeled A-E. Lines/arrows connecting them. Show directed or undirected.

BINARY SEARCH → horizontal array of 8 boxes, "lo" pointer left, "hi" pointer right, "mid" pointer center highlighted. Show comparison step.

SORTING (bubble/merge/quick) → array of 6 bars different heights. Highlight the pair being compared/swapped. Show one pass.

BIG O → horizontal bar chart, 5 bars, labels: O(1) O(log n) O(n) O(n log n) O(n²). Color gradient green→red.

TWO POINTERS → array of 8 boxes. Left pointer "L →" at index 0, right pointer "← R" at last index. Show them moving inward.

SLIDING WINDOW → array of 8 boxes. Highlight a contiguous window of 3 boxes.

RECURSION / CALL STACK → 4 stacked frames, each labeled "fn(n)", "fn(n-1)" etc. Arrows showing call then return.

DYNAMIC PROGRAMMING → 5×5 grid of cells. Some cells filled with values. Arrow showing fill order (left→right, top→bottom).

TCP HANDSHAKE → two vertical timelines (Client | Server). Arrows: SYN →, ← SYN-ACK, ACK →. Labels on arrows.

HTTP REQUEST → "Client" box → arrow "GET /api/data" → "Server" box → arrow "200 OK + JSON" back to client.

SQL JOIN → two small tables (left: id,name; right: id,dept). Highlight matching rows. Result table below.

NEURAL NETWORK → 3 input nodes, 4 hidden nodes, 2 output nodes. Lines connecting all layers. Stagger reveal per layer.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support both old { text } and new { userQuestion } shapes
    const userQuestion: string = (body.userQuestion ?? body.text ?? '').trim();

    if (!userQuestion || userQuestion.length < 4) {
      return NextResponse.json({ svg: null });
    }

    console.log('[Whiteboard API] userQuestion:', userQuestion);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: WHITEBOARD_PROMPT },
        {
          role: 'user',
          content: `The interview candidate asked:\n\n"${userQuestion}"\n\nOutput ONLY the SVG element (starting with <svg and ending with </svg>) or the text NOT_VISUAL. Absolutely nothing else.`,
        },
      ],
      temperature: 0.1,   // very deterministic — we want the exact diagram
      max_tokens: 3000,
    });

    const raw = (response.choices[0]?.message?.content ?? '').trim();
    console.log('[Whiteboard API] raw first 120 chars:', raw.slice(0, 120));

    // Not visual
    if (!raw || raw === 'NOT_VISUAL' || raw.startsWith('NOT_VISUAL')) {
      console.log('[Whiteboard API] → NOT_VISUAL');
      return NextResponse.json({ svg: null });
    }

    // Strip accidental markdown fences
    let svg = raw
      .replace(/^```[a-z]*\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim();

    // Validate
    if (!svg.startsWith('<svg') || !svg.includes('</svg>')) {
      console.warn('[Whiteboard API] invalid SVG, first 120 chars:', svg.slice(0, 120));
      return NextResponse.json({ svg: null });
    }

    console.log('[Whiteboard API] → valid SVG, length:', svg.length);
    return NextResponse.json({ svg });

  } catch (err: any) {
    console.error('[Whiteboard API error]', err);
    return NextResponse.json({ svg: null }, { status: 500 });
  }
}
