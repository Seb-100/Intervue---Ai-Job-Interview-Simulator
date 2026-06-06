// ─────────────────────────────────────────────────────────────────────────────
// diagrams.ts
// Pre-built animated SVG diagrams for common CS/interview concepts.
// No API calls — instant, free, offline-capable.
//
// Usage:
//   import { conceptFromQuestion, buildDiagram } from '@/lib/diagrams';
//   const concept = conceptFromQuestion("explain a linked list");  // "linked-list"
//   const svg     = buildDiagram(concept);                         // SVG string | null
// ─────────────────────────────────────────────────────────────────────────────

// ── Keyword → concept mapping ────────────────────────────────────────────────
const KEYWORD_MAP: [RegExp, string][] = [
  [/doubly.?linked/i,                              'doubly-linked-list'],
  [/linked.?list|singly.?linked/i,                 'linked-list'],
  [/\bstack\b|lifo/i,                              'stack'],
  [/\bqueue\b(?!.*(priority))|fifo/i,              'queue'],
  [/priority.?queue|\bmin.?heap\b|\bmax.?heap\b/i, 'heap'],
  [/binary.?search.?tree|\bbst\b/i,                'bst'],
  [/binary.?tree/i,                                'binary-tree'],
  [/\btrie\b/i,                                    'trie'],
  [/hash.?map|hash.?table|hash.?set|\bdict\b/i,   'hash-map'],
  [/\bgraph\b|adjacency.?list/i,                   'graph'],
  [/binary.?search/i,                              'binary-search'],
  [/bubble.?sort/i,                                'bubble-sort'],
  [/merge.?sort/i,                                 'merge-sort'],
  [/quick.?sort/i,                                 'quick-sort'],
  [/\bsorting\b/i,                                 'bubble-sort'],
  [/big.?o|time.?complexity|space.?complexity/i,   'big-o'],
  [/two.?pointer/i,                                'two-pointers'],
  [/sliding.?window/i,                             'sliding-window'],
  [/dynamic.?programming|\bdp\b|memoiz/i,          'dynamic-programming'],
  [/tcp.?handshake/i,                              'tcp-handshake'],
  [/http.?request|rest.?api/i,                     'http-request'],
  [/recursion|recursive|call.?stack/i,             'recursion'],
  [/\barray\b/i,                                   'array'],
  // ── Biology ─────────────────────────────────────────────────────────────────
  [/\bneuron\b|neural.?cell|axon|synapse|dendrite/i,               'neuron'],
  [/\bdna\b|double.?helix|nucleotide|base.?pair/i,                 'dna'],
  [/animal.?cell|\bcell\b.*(organelle|structure)|organelle/i,      'cell'],
  [/photosynthesis|chlorophyll|chloroplast/i,                      'photosynthesis'],
  [/mitosis|cell.?division|meiosis|chromosome/i,                   'mitosis'],
  [/food.?chain|food.?web|trophic/i,                               'food-chain'],
  // ── Chemistry ───────────────────────────────────────────────────────────────
  [/atomic.?structure|bohr.?model|\batom\b.*(shell|electron)/i,    'atomic-structure'],
  [/\bph\b.*(scale|level)|acid.*(base|alkaline)|acidity/i,         'ph-scale'],
  [/ionic.?bond|covalent.?bond|chemical.?bond|electron.?transfer/i,'chemical-bond'],
  [/periodic.?table|element.?group/i,                              'periodic-table'],
  // ── Physics ─────────────────────────────────────────────────────────────────
  [/electrical?.?circuit|ohm.?law|series.?circuit/i,               'circuit'],
  [/\bwave\b.*(length|amplitude|frequency)|transverse.?wave/i,     'wave'],
  [/\bforce\b|free.?body|newton.?law|friction|normal.?force/i,     'forces'],
  [/electro.?magnetic.?spectrum|em.?spectrum|infrared|ultraviolet/i,'em-spectrum'],
  [/kinematics|velocity.?time|acceleration|displacement/i,         'kinematics'],
  // ── Mathematics ─────────────────────────────────────────────────────────────
  [/venn.?diagram|set.?theory|intersection|union.*(set)/i,         'venn-diagram'],
  [/quadratic|parabola|vertex.*(graph)|ax\^2/i,                    'quadratic'],
  [/probability.?tree|decision.?tree|conditional.?prob/i,          'probability-tree'],
  [/\bmatrix\b|matrices|determinant|linear.?algebra/i,             'matrix'],
  [/normal.?distribution|bell.?curve|standard.?deviation/i,        'normal-distribution'],
  // ── Economics ───────────────────────────────────────────────────────────────
  [/supply.*(demand)|demand.*(supply)|market.?equilibrium/i,       'supply-demand'],
  [/\bgdp\b|gross.?domestic.?product|national.?income/i,           'gdp'],
  [/inflation|price.?level|consumer.?price/i,                      'inflation'],
];

export function conceptFromQuestion(question: string): string | null {
  for (const [regex, concept] of KEYWORD_MAP) {
    if (regex.test(question)) return concept;
  }
  return null;
}

// ── Shared SVG helpers ───────────────────────────────────────────────────────
const BASE_STYLE = `
  <defs><style>
    @keyframes fi { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
    @keyframes fw { from { opacity:0 } to { opacity:1 } }
    @keyframes drawLine { from { stroke-dashoffset: 200 } to { stroke-dashoffset: 0 } }
    @keyframes barGrow  { from { transform: scaleX(0); transform-origin: left } to { transform: scaleX(1); transform-origin: left } }
    .n0  { animation: fi .4s .2s both }
    .n1  { animation: fi .4s .4s both }
    .n2  { animation: fi .4s .6s both }
    .n3  { animation: fi .4s .8s both }
    .n4  { animation: fi .4s 1.0s both }
    .n5  { animation: fi .4s 1.2s both }
    .n6  { animation: fi .4s 1.4s both }
    .n7  { animation: fi .4s 1.6s both }
    .l0  { animation: fw .5s .3s both; stroke-dasharray:200; stroke-dashoffset:200; animation: drawLine .6s .3s both }
    .l1  { animation: drawLine .6s .5s both; stroke-dasharray:200; stroke-dashoffset:200 }
    .l2  { animation: drawLine .6s .7s both; stroke-dasharray:200; stroke-dashoffset:200 }
    .l3  { animation: drawLine .6s .9s both; stroke-dasharray:200; stroke-dashoffset:200 }
    .l4  { animation: drawLine .6s 1.1s both; stroke-dasharray:200; stroke-dashoffset:200 }
    .l5  { animation: drawLine .6s 1.3s both; stroke-dasharray:200; stroke-dashoffset:200 }
  </style></defs>`;

function wrap(inner: string, title: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 300">
  <rect width="520" height="300" fill="#fff"/>
  <text x="12" y="18" font-size="11" fill="#94a3b8" font-family="system-ui">${title}</text>
  ${BASE_STYLE}
  ${inner}
</svg>`;
}

// ── Diagram builders ─────────────────────────────────────────────────────────

function linkedList(): string {
  const nodes = ['head', '12', '37', '99', 'null'];
  const bw = 72, bh = 38, gap = 24, y = 130;
  const totalW = nodes.length * bw + (nodes.length - 1) * gap;
  const x0 = (520 - totalW) / 2;
  let parts = '';
  nodes.forEach((lbl, i) => {
    const x = x0 + i * (bw + gap);
    const isNull = lbl === 'null';
    parts += `<g class="n${i}">
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="7"
        fill="${isNull ? '#f8fafc' : '#eff6ff'}" stroke="${isNull ? '#cbd5e1' : '#2563eb'}" stroke-width="1.5"/>
      <text x="${x + bw / 2}" y="${y + bh / 2 + 1}" text-anchor="middle" dominant-baseline="middle"
        font-size="13" fill="${isNull ? '#94a3b8' : '#1e3a5f'}" font-family="system-ui" font-weight="500">${lbl}</text>
    </g>`;
    if (i === 0) {
      parts += `<text x="${x + bw / 2}" y="${y + bh + 16}" text-anchor="middle"
        font-size="10" fill="#64748b" font-family="system-ui" class="n${i}">head</text>`;
    }
    if (i < nodes.length - 1) {
      const ax = x + bw + 3, ay = y + bh / 2;
      parts += `<line x1="${ax}" y1="${ay}" x2="${ax + gap - 6}" y2="${ay}"
        stroke="#3b82f6" stroke-width="1.5" class="l${i}"/>
      <polygon points="${ax + gap - 6},${ay - 4} ${ax + gap},${ay} ${ax + gap - 6},${ay + 4}"
        fill="#3b82f6" class="n${i + 1}"/>`;
    }
  });
  return wrap(parts, 'Singly Linked List');
}

function doublyLinkedList(): string {
  const nodes = ['null', 'A', 'B', 'C', 'null'];
  const bw = 64, bh = 36, gap = 28, y = 130;
  const totalW = nodes.length * bw + (nodes.length - 1) * gap;
  const x0 = (520 - totalW) / 2;
  let parts = '';
  nodes.forEach((lbl, i) => {
    const x = x0 + i * (bw + gap);
    const isNull = lbl === 'null';
    parts += `<g class="n${i}">
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="7"
        fill="${isNull ? '#f8fafc' : '#eff6ff'}" stroke="${isNull ? '#cbd5e1' : '#2563eb'}" stroke-width="1.5"/>
      <text x="${x + bw / 2}" y="${y + bh / 2 + 1}" text-anchor="middle" dominant-baseline="middle"
        font-size="13" fill="${isNull ? '#94a3b8' : '#1e3a5f'}" font-family="system-ui" font-weight="500">${lbl}</text>
    </g>`;
    if (i < nodes.length - 1) {
      const ax = x + bw + 3, ay1 = y + bh / 2 - 5, ay2 = y + bh / 2 + 5;
      const ex = ax + gap - 6;
      // forward arrow
      parts += `<line x1="${ax}" y1="${ay1}" x2="${ex}" y2="${ay1}" stroke="#3b82f6" stroke-width="1.3" class="l${i}"/>
        <polygon points="${ex},${ay1 - 3} ${ex + 6},${ay1} ${ex},${ay1 + 3}" fill="#3b82f6" class="n${i + 1}"/>`;
      // backward arrow
      parts += `<line x1="${ex}" y1="${ay2}" x2="${ax}" y2="${ay2}" stroke="#f59e0b" stroke-width="1.3" class="l${i}"/>
        <polygon points="${ax},${ay2 - 3} ${ax - 6},${ay2} ${ax},${ay2 + 3}" fill="#f59e0b" class="n${i + 1}"/>`;
    }
  });
  parts += `<text x="260" y="200" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n4">← prev / next →</text>`;
  return wrap(parts, 'Doubly Linked List');
}

function stack(): string {
  const items = [
    { lbl: '30  ← TOP', fill: '#eff6ff', stroke: '#2563eb', text: '#1e3a5f' },
    { lbl: '20',        fill: '#f0fdf4', stroke: '#16a34a', text: '#14532d' },
    { lbl: '10',        fill: '#fffbeb', stroke: '#d97706', text: '#78350f' },
    { lbl: 'BOTTOM',    fill: '#f8fafc', stroke: '#94a3b8', text: '#64748b' },
  ];
  const bw = 140, bh = 40, x = 190, y0 = 48;
  let parts = '';
  items.forEach(({ lbl, fill, stroke, text }, i) => {
    const y = y0 + i * (bh + 4);
    parts += `<g class="n${i}">
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="6"
        fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <text x="${x + bw / 2}" y="${y + bh / 2 + 1}" text-anchor="middle" dominant-baseline="middle"
        font-size="12" fill="${text}" font-family="system-ui" font-weight="500">${lbl}</text>
    </g>`;
  });
  // PUSH arrow
  parts += `<g class="n4">
    <line x1="162" y1="50" x2="162" y2="88" stroke="#2563eb" stroke-width="1.5"/>
    <polygon points="157,88 162,96 167,88" fill="#2563eb"/>
    <text x="162" y="44" text-anchor="middle" font-size="10" fill="#2563eb" font-family="system-ui">PUSH ↓</text>
  </g>`;
  // POP arrow
  parts += `<g class="n5">
    <line x1="358" y1="88" x2="358" y2="50" stroke="#ef4444" stroke-width="1.5"/>
    <polygon points="353,50 358,42 363,50" fill="#ef4444"/>
    <text x="358" y="104" text-anchor="middle" font-size="10" fill="#ef4444" font-family="system-ui">POP ↑</text>
  </g>`;
  parts += `<text x="260" y="248" text-anchor="middle" font-size="11" fill="#64748b" font-family="system-ui" class="n5">LIFO — Last In, First Out</text>`;
  return wrap(parts, 'Stack');
}

function queue(): string {
  const items = ['FRONT', '10', '20', '30', 'REAR'];
  const bw = 66, bh = 40, gap = 4, y = 128;
  const totalW = items.length * bw + (items.length - 1) * gap;
  const x0 = (520 - totalW) / 2;
  let parts = '';
  items.forEach((lbl, i) => {
    const x = x0 + i * (bw + gap);
    const isMeta = lbl === 'FRONT' || lbl === 'REAR';
    parts += `<g class="n${i}">
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="5"
        fill="${isMeta ? '#f0fdf4' : '#eff6ff'}" stroke="${isMeta ? '#16a34a' : '#2563eb'}" stroke-width="1.5"/>
      <text x="${x + bw / 2}" y="${y + bh / 2 + 1}" text-anchor="middle" dominant-baseline="middle"
        font-size="12" fill="${isMeta ? '#14532d' : '#1e3a5f'}" font-family="system-ui" font-weight="500">${lbl}</text>
    </g>`;
  });
  // ENQUEUE arrow
  parts += `<g class="n5">
    <text x="${x0 + items.length * (bw + gap) + 8}" y="${y + bh / 2 + 4}" font-size="10" fill="#2563eb" font-family="system-ui">ENQUEUE→</text>
  </g>`;
  // DEQUEUE arrow
  parts += `<g class="n6">
    <text x="${x0 - 80}" y="${y + bh / 2 + 4}" font-size="10" fill="#ef4444" font-family="system-ui">←DEQUEUE</text>
  </g>`;
  parts += `<text x="260" y="218" text-anchor="middle" font-size="11" fill="#64748b" font-family="system-ui" class="n6">FIFO — First In, First Out</text>`;
  return wrap(parts, 'Queue');
}

function binaryTree(bst = false): string {
  // nodes: [value, cx, cy]
  const nodes = bst
    ? [[50, 260, 55], [30, 155, 115], [70, 365, 115], [20, 100, 175], [40, 210, 175], [60, 310, 175], [80, 420, 175]]
    : [[1,  260, 55], [2,  155, 115], [3,  365, 115], [4,  100, 175], [5,  210, 175], [6,  310, 175], [7,  420, 175]];
  const r = 22;
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
  let parts = '';
  // edges first
  edges.forEach(([p, c], i) => {
    const [,px,py] = nodes[p] as number[];
    const [,cx,cy] = nodes[c] as number[];
    parts += `<line x1="${px}" y1="${py + r}" x2="${cx}" y2="${cy - r}"
      stroke="#3b82f6" stroke-width="1.5" class="l${i}"/>`;
  });
  // nodes
  nodes.forEach(([v, cx, cy], i) => {
    parts += `<g class="n${i}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
      <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
        font-size="13" fill="#1e3a5f" font-family="system-ui" font-weight="600">${v}</text>
    </g>`;
  });
  if (bst) {
    parts += `<text x="260" y="240" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n6">Left &lt; Root &lt; Right</text>`;
  }
  return wrap(parts, bst ? 'Binary Search Tree (BST)' : 'Binary Tree');
}

function heap(): string {
  const nodes = [[90,260,55],[70,155,115],[80,365,115],[50,100,175],[60,210,175],[65,310,175],[75,420,175]];
  const r = 22;
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
  let parts = '';
  edges.forEach(([p, c], i) => {
    const [,px,py] = nodes[p] as number[];
    const [,cx,cy] = nodes[c] as number[];
    parts += `<line x1="${px}" y1="${py + r}" x2="${cx}" y2="${cy - r}"
      stroke="#3b82f6" stroke-width="1.5" class="l${i}"/>`;
  });
  nodes.forEach(([v, cx, cy], i) => {
    parts += `<g class="n${i}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${i===0?'#fef9c3':'#eff6ff'}" stroke="${i===0?'#f59e0b':'#2563eb'}" stroke-width="1.5"/>
      <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
        font-size="13" fill="${i===0?'#78350f':'#1e3a5f'}" font-family="system-ui" font-weight="600">${v}</text>
    </g>`;
  });
  parts += `<text x="260" y="235" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n6">Max-Heap: parent ≥ children</text>`;
  return wrap(parts, 'Heap (Max-Heap)');
}

function hashMap(): string {
  const buckets = 7;
  const bx = 90, by0 = 40, bw = 60, bh = 28, gap = 8;
  const pairs = ['–', '"cat":3', '"dog":1', '–', '"fox":7', '–', '"hen":2'];
  let parts = '';
  for (let i = 0; i < buckets; i++) {
    const y = by0 + i * (bh + gap);
    const hasPair = pairs[i] !== '–';
    parts += `<g class="n${i}">
      <rect x="${bx}" y="${y}" width="${bw}" height="${bh}" rx="4"
        fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2"/>
      <text x="${bx + bw / 2}" y="${y + bh / 2 + 1}" text-anchor="middle" dominant-baseline="middle"
        font-size="10" fill="#94a3b8" font-family="system-ui">[${i}]</text>
    </g>`;
    if (hasPair) {
      const vx = bx + bw + 40;
      parts += `<g class="n${i}">
        <line x1="${bx + bw}" y1="${y + bh/2}" x2="${vx}" y2="${y + bh/2}"
          stroke="#3b82f6" stroke-width="1.2" stroke-dasharray="3,2"/>
        <rect x="${vx}" y="${y}" width="120" height="${bh}" rx="4"
          fill="#eff6ff" stroke="#2563eb" stroke-width="1.2"/>
        <text x="${vx + 60}" y="${y + bh/2 + 1}" text-anchor="middle" dominant-baseline="middle"
          font-size="10" fill="#1e3a5f" font-family="system-ui">${pairs[i]}</text>
      </g>`;
    }
  }
  parts += `<text x="260" y="268" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n6">hash(key) → bucket index → value</text>`;
  return wrap(parts, 'Hash Map');
}

function graph(): string {
  // 5 nodes + directed edges
  const nodes: [string, number, number][] = [
    ['A', 260, 60], ['B', 130, 150], ['C', 390, 150], ['D', 160, 250], ['E', 360, 250],
  ];
  const edges: [number, number][] = [[0,1],[0,2],[1,3],[2,4],[3,4],[1,2]];
  const r = 24;
  let parts = '';
  edges.forEach(([s, t], i) => {
    const [, sx, sy] = nodes[s];
    const [, tx, ty] = nodes[t];
    const dx = tx - sx, dy = ty - sy, len = Math.sqrt(dx*dx + dy*dy);
    const nx = dx/len, ny = dy/len;
    const x1 = sx + nx*r, y1 = sy + ny*r, x2 = tx - nx*r, y2 = ty - ny*r;
    parts += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"
      stroke="#3b82f6" stroke-width="1.5" class="l${i}" marker-end="url(#arrow)"/>`;
  });
  nodes.forEach(([lbl, cx, cy], i) => {
    parts += `<g class="n${i}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
      <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
        font-size="14" fill="#1e3a5f" font-family="system-ui" font-weight="700">${lbl}</text>
    </g>`;
  });
  const arrowDef = `<defs><marker id="arrow" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
    <polygon points="0,0 8,3 0,6" fill="#3b82f6"/></marker></defs>`;
  return wrap(arrowDef + parts, 'Directed Graph');
}

function binarySearch(): string {
  const vals = [2, 5, 8, 12, 16, 23, 38, 45];
  const bw = 44, bh = 40, gap = 4;
  const totalW = vals.length * bw + (vals.length - 1) * gap;
  const x0 = (520 - totalW) / 2;
  const y = 100;
  const loIdx = 0, hiIdx = 7, midIdx = 3;
  let parts = '';
  vals.forEach((v, i) => {
    const x = x0 + i * (bw + gap);
    const isMid = i === midIdx;
    parts += `<g class="n${Math.min(i, 7)}">
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="5"
        fill="${isMid ? '#fef9c3' : '#eff6ff'}" stroke="${isMid ? '#f59e0b' : '#2563eb'}" stroke-width="${isMid ? 2 : 1.5}"/>
      <text x="${x + bw/2}" y="${y + bh/2 + 1}" text-anchor="middle" dominant-baseline="middle"
        font-size="13" fill="${isMid ? '#78350f' : '#1e3a5f'}" font-family="system-ui" font-weight="500">${v}</text>
    </g>`;
  });
  // Pointer labels
  const loX = x0 + loIdx * (bw + gap) + bw/2;
  const hiX = x0 + hiIdx * (bw + gap) + bw/2;
  const midX = x0 + midIdx * (bw + gap) + bw/2;
  parts += `
    <text x="${loX}" y="${y + bh + 18}" text-anchor="middle" font-size="10" fill="#22c55e" font-family="system-ui" font-weight="600" class="n0">lo</text>
    <text x="${hiX}" y="${y + bh + 18}" text-anchor="middle" font-size="10" fill="#ef4444" font-family="system-ui" font-weight="600" class="n7">hi</text>
    <text x="${midX}" y="${y - 12}" text-anchor="middle" font-size="10" fill="#f59e0b" font-family="system-ui" font-weight="600" class="n3">mid</text>
    <text x="260" y="215" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n7">Compare target with arr[mid] → halve the search space</text>`;
  return wrap(parts, 'Binary Search  — O(log n)');
}

function bigO(): string {
  const bars: [string, number, string][] = [
    ['O(1)',      0.06, '#22c55e'],
    ['O(log n)',  0.18, '#3b82f6'],
    ['O(n)',      0.42, '#f59e0b'],
    ['O(n log n)',0.62, '#f97316'],
    ['O(n²)',     0.92, '#ef4444'],
  ];
  const lw = 74, maxBarW = 310, bh = 30, gap = 12, x0 = 100, y0 = 50;
  let parts = '';
  bars.forEach(([lbl, ratio, color], i) => {
    const y = y0 + i * (bh + gap);
    const bw = maxBarW * ratio;
    parts += `<g class="n${i}">
      <text x="${x0 - 6}" y="${y + bh/2 + 1}" text-anchor="end" dominant-baseline="middle"
        font-size="11" fill="#1e293b" font-family="system-ui,monospace">${lbl}</text>
      <rect x="${x0}" y="${y}" width="${maxBarW}" height="${bh}" rx="4" fill="#f1f5f9"/>
      <rect x="${x0}" y="${y}" width="${bw}" height="${bh}" rx="4" fill="${color}"/>
    </g>`;
  });
  parts += `<text x="260" y="262" text-anchor="middle" font-size="10" fill="#94a3b8" font-family="system-ui" class="n4">← Faster    Slower →</text>`;
  return wrap(parts, 'Time Complexity — Big O');
}

function twoPointers(): string {
  const vals = [1, 4, 6, 8, 11, 14, 18, 21];
  const bw = 44, bh = 40, gap = 4;
  const totalW = vals.length * bw + (vals.length - 1) * gap;
  const x0 = (520 - totalW) / 2;
  const y = 110;
  let parts = '';
  vals.forEach((v, i) => {
    const x = x0 + i * (bw + gap);
    const isL = i === 0, isR = i === vals.length - 1;
    parts += `<g class="n${Math.min(i, 7)}">
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="5"
        fill="${isL ? '#ecfdf5' : isR ? '#fef2f2' : '#f8fafc'}"
        stroke="${isL ? '#22c55e' : isR ? '#ef4444' : '#cbd5e1'}" stroke-width="${(isL||isR)?2:1.2}"/>
      <text x="${x+bw/2}" y="${y+bh/2+1}" text-anchor="middle" dominant-baseline="middle"
        font-size="13" fill="#1e293b" font-family="system-ui">${v}</text>
    </g>`;
  });
  const lx = x0 + bw/2, rx = x0 + (vals.length-1)*(bw+gap) + bw/2;
  parts += `
    <text x="${lx}" y="${y+bh+18}" text-anchor="middle" font-size="11" fill="#22c55e" font-family="system-ui" font-weight="700" class="n0">L →</text>
    <text x="${rx}" y="${y+bh+18}" text-anchor="middle" font-size="11" fill="#ef4444" font-family="system-ui" font-weight="700" class="n7">← R</text>
    <text x="260" y="218" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n7">Move pointers inward until they meet</text>`;
  return wrap(parts, 'Two Pointers');
}

function slidingWindow(): string {
  const vals = [3, 1, 4, 7, 2, 9, 5, 6];
  const bw = 44, bh = 40, gap = 4;
  const totalW = vals.length * bw + (vals.length - 1) * gap;
  const x0 = (520 - totalW) / 2;
  const y = 100;
  const winStart = 2, winEnd = 4;
  let parts = '';
  vals.forEach((v, i) => {
    const x = x0 + i * (bw + gap);
    const inWin = i >= winStart && i <= winEnd;
    parts += `<g class="n${Math.min(i, 7)}">
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="5"
        fill="${inWin ? '#fef9c3' : '#f8fafc'}" stroke="${inWin ? '#f59e0b' : '#cbd5e1'}" stroke-width="${inWin?2:1.2}"/>
      <text x="${x+bw/2}" y="${y+bh/2+1}" text-anchor="middle" dominant-baseline="middle"
        font-size="13" fill="${inWin?'#78350f':'#64748b'}" font-family="system-ui">${v}</text>
    </g>`;
  });
  const wx1 = x0 + winStart*(bw+gap), wx2 = x0 + winEnd*(bw+gap) + bw;
  parts += `
    <rect x="${wx1-3}" y="${y-6}" width="${wx2-wx1+6}" height="${bh+12}" rx="6"
      fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5,3" class="n5"/>
    <text x="${(wx1+wx2)/2}" y="${y+bh+20}" text-anchor="middle" font-size="10" fill="#f59e0b" font-family="system-ui" class="n5">window</text>
    <text x="260" y="215" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n7">Slide the window right to find optimal subarray</text>`;
  return wrap(parts, 'Sliding Window');
}

function dynamicProgramming(): string {
  const rows = 5, cols = 6;
  const cw = 46, ch = 32, gap = 3;
  const totalW = cols * cw + (cols-1)*gap, totalH = rows * ch + (rows-1)*gap;
  const x0 = (520 - totalW) / 2, y0 = 40;
  const vals = [
    [0,0,0,0,0,0],
    [0,1,1,1,1,1],
    [0,1,2,2,2,2],
    [0,1,2,3,3,3],
    [0,1,2,3,4,4],
  ];
  let parts = '';
  vals.forEach((row, r) => {
    row.forEach((v, c) => {
      const x = x0 + c*(cw+gap), y = y0 + r*(ch+gap);
      const isFilled = v > 0;
      const idx = r * cols + c;
      parts += `<g class="n${Math.min(Math.floor(idx/4), 7)}">
        <rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="4"
          fill="${isFilled ? '#eff6ff' : '#f8fafc'}" stroke="${isFilled ? '#2563eb' : '#e2e8f0'}" stroke-width="${isFilled?1.5:1}"/>
        <text x="${x+cw/2}" y="${y+ch/2+1}" text-anchor="middle" dominant-baseline="middle"
          font-size="12" fill="${isFilled?'#1e3a5f':'#cbd5e1'}" font-family="system-ui" font-weight="${isFilled?'600':'400'}">${v}</text>
      </g>`;
    });
  });
  parts += `<text x="260" y="${y0+totalH+22}" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n7">Build solution bottom-up, reuse sub-problem results</text>`;
  return wrap(parts, 'Dynamic Programming — DP Table');
}

function bubbleSort(): string {
  const vals = [64, 34, 25, 12, 22, 11];
  const bw = 44, bh = 40, gap = 8;
  const totalW = vals.length * bw + (vals.length - 1) * gap;
  const x0 = (520 - totalW) / 2;
  const y = 80;
  // Show one comparison step: indices 0 and 1 are being compared/swapped
  const cmpA = 0, cmpB = 1;
  let parts = '';
  vals.forEach((v, i) => {
    const x = x0 + i * (bw + gap);
    const isCmp = i === cmpA || i === cmpB;
    parts += `<g class="n${Math.min(i,7)}">
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="5"
        fill="${isCmp ? '#fef2f2' : '#eff6ff'}" stroke="${isCmp ? '#ef4444' : '#2563eb'}" stroke-width="${isCmp?2:1.5}"/>
      <text x="${x+bw/2}" y="${y+bh/2+1}" text-anchor="middle" dominant-baseline="middle"
        font-size="13" fill="${isCmp?'#7f1d1d':'#1e3a5f'}" font-family="system-ui" font-weight="500">${v}</text>
    </g>`;
  });
  // Swap arrows
  const ax = x0 + cmpA*(bw+gap) + bw/2, bx2 = x0 + cmpB*(bw+gap) + bw/2;
  parts += `<g class="n5">
    <path d="M${ax},${y-8} C${ax},${y-28} ${bx2},${y-28} ${bx2},${y-8}"
      fill="none" stroke="#ef4444" stroke-width="1.5"/>
    <polygon points="${bx2-4},${y-14} ${bx2},${y-8} ${bx2+4},${y-14}" fill="#ef4444"/>
    <text x="${(ax+bx2)/2}" y="${y-32}" text-anchor="middle" font-size="10" fill="#ef4444" font-family="system-ui">swap if left > right</text>
  </g>`;
  parts += `<text x="260" y="${y+bh+30}" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n5">Bubble Sort — O(n²) — compare adjacent pairs</text>`;
  return wrap(parts, 'Bubble Sort');
}

function mergeSort(): string {
  // Show the split + merge steps
  const bw = 36, bh = 32, gap = 4;
  // Top row: full array
  const full = [38, 27, 43, 3, 9, 82, 10];
  const x0 = (520 - full.length*(bw+gap)) / 2;
  let parts = '';
  // Row 1: full array
  full.forEach((v, i) => {
    const x = x0 + i*(bw+gap);
    parts += `<g class="n0">
      <rect x="${x}" y="40" width="${bw}" height="${bh}" rx="4" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
      <text x="${x+bw/2}" y="${40+bh/2+1}" text-anchor="middle" dominant-baseline="middle"
        font-size="11" fill="#1e3a5f" font-family="system-ui">${v}</text>
    </g>`;
  });
  // Split arrows down
  parts += `<line x1="260" y1="74" x2="175" y2="94" stroke="#94a3b8" stroke-width="1" class="l0"/>
    <line x1="260" y1="74" x2="345" y2="94" stroke="#94a3b8" stroke-width="1" class="l0"/>`;
  // Row 2: two halves
  const left = [38,27,43], right = [3,9,82,10];
  const lx0 = 80, rx0 = 270;
  left.forEach((v,i) => {
    const x = lx0 + i*(bw+gap);
    parts += `<g class="n2">
      <rect x="${x}" y="96" width="${bw}" height="${bh}" rx="4" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
      <text x="${x+bw/2}" y="${96+bh/2+1}" text-anchor="middle" dominant-baseline="middle"
        font-size="11" fill="#14532d" font-family="system-ui">${v}</text>
    </g>`;
  });
  right.forEach((v,i) => {
    const x = rx0 + i*(bw+gap);
    parts += `<g class="n2">
      <rect x="${x}" y="96" width="${bw}" height="${bh}" rx="4" fill="#fff7ed" stroke="#f97316" stroke-width="1.5"/>
      <text x="${x+bw/2}" y="${96+bh/2+1}" text-anchor="middle" dominant-baseline="middle"
        font-size="11" fill="#7c2d12" font-family="system-ui">${v}</text>
    </g>`;
  });
  // Merge arrow
  parts += `<g class="n4">
    <line x1="175" y1="130" x2="260" y2="154" stroke="#94a3b8" stroke-width="1"/>
    <line x1="345" y1="130" x2="260" y2="154" stroke="#94a3b8" stroke-width="1"/>
  </g>`;
  // Row 3: merged sorted
  const sorted = [3,9,10,27,38,43,82];
  const sx0 = (520 - sorted.length*(bw+gap)) / 2;
  sorted.forEach((v,i) => {
    const x = sx0 + i*(bw+gap);
    parts += `<g class="n5">
      <rect x="${x}" y="156" width="${bw}" height="${bh}" rx="4" fill="#fef9c3" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="${x+bw/2}" y="${156+bh/2+1}" text-anchor="middle" dominant-baseline="middle"
        font-size="11" fill="#78350f" font-family="system-ui">${v}</text>
    </g>`;
  });
  parts += `<text x="260" y="218" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n5">Divide → Sort halves → Merge  — O(n log n)</text>`;
  return wrap(parts, 'Merge Sort');
}

function recursion(): string {
  const frames = ['factorial(4)  → 4 × 6', 'factorial(3)  → 3 × 2', 'factorial(2)  → 2 × 1', 'factorial(1)  → return 1'];
  const bw = 260, bh = 38, x = 130;
  let parts = '';
  frames.forEach((lbl, i) => {
    const y = 50 + i * 46;
    const alpha = 1 - i * 0.15;
    parts += `<g class="n${i}">
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="6"
        fill="#eff6ff" stroke="#2563eb" stroke-width="1.5" opacity="${alpha}"/>
      <text x="${x + bw/2}" y="${y + bh/2 + 1}" text-anchor="middle" dominant-baseline="middle"
        font-size="12" fill="#1e3a5f" font-family="system-ui,monospace">${lbl}</text>
    </g>`;
    if (i < frames.length - 1) {
      parts += `<line x1="${x + bw/2}" y1="${y + bh}" x2="${x + bw/2}" y2="${y + bh + 8}"
        stroke="#3b82f6" stroke-width="1.2" stroke-dasharray="3,2" class="n${i}"/>`;
    }
  });
  parts += `<text x="260" y="252" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n3">Each call waits on the stack until base case reached</text>`;
  return wrap(parts, 'Recursion — Call Stack');
}

function tcpHandshake(): string {
  const parts = `
    <line x1="130" y1="40" x2="130" y2="260" stroke="#2563eb" stroke-width="2" class="l0"/>
    <line x1="390" y1="40" x2="390" y2="260" stroke="#2563eb" stroke-width="2" class="l1"/>
    <text x="130" y="30" text-anchor="middle" font-size="12" fill="#1e293b" font-family="system-ui" font-weight="700" class="n0">Client</text>
    <text x="390" y="30" text-anchor="middle" font-size="12" fill="#1e293b" font-family="system-ui" font-weight="700" class="n1">Server</text>
    <g class="n2">
      <line x1="130" y1="90" x2="390" y2="120" stroke="#22c55e" stroke-width="1.5"/>
      <polygon points="384,116 390,120 383,123" fill="#22c55e"/>
      <text x="260" y="98" text-anchor="middle" font-size="11" fill="#15803d" font-family="system-ui" font-weight="600">SYN</text>
    </g>
    <g class="n3">
      <line x1="390" y1="150" x2="130" y2="180" stroke="#3b82f6" stroke-width="1.5"/>
      <polygon points="136,177 130,180 137,183" fill="#3b82f6"/>
      <text x="260" y="155" text-anchor="middle" font-size="11" fill="#1d4ed8" font-family="system-ui" font-weight="600">SYN-ACK</text>
    </g>
    <g class="n4">
      <line x1="130" y1="210" x2="390" y2="240" stroke="#f59e0b" stroke-width="1.5"/>
      <polygon points="384,236 390,240 383,243" fill="#f59e0b"/>
      <text x="260" y="215" text-anchor="middle" font-size="11" fill="#92400e" font-family="system-ui" font-weight="600">ACK</text>
    </g>
    <text x="260" y="278" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n4">Connection established ✓</text>`;
  return wrap(parts, 'TCP Three-Way Handshake');
}

function httpRequest(): string {
  const parts = `
    <rect x="60" y="110" width="120" height="60" rx="8" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5" class="n0"/>
    <text x="120" y="137" text-anchor="middle" font-size="13" fill="#1e3a5f" font-family="system-ui" font-weight="700" class="n0">Client</text>
    <text x="120" y="157" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n0">Browser / App</text>
    <rect x="340" y="110" width="120" height="60" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5" class="n1"/>
    <text x="400" y="137" text-anchor="middle" font-size="13" fill="#14532d" font-family="system-ui" font-weight="700" class="n1">Server</text>
    <text x="400" y="157" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n1">API / Backend</text>
    <g class="n2">
      <line x1="180" y1="130" x2="340" y2="130" stroke="#3b82f6" stroke-width="1.5"/>
      <polygon points="334,126 340,130 334,134" fill="#3b82f6"/>
      <text x="260" y="122" text-anchor="middle" font-size="10" fill="#1d4ed8" font-family="system-ui" font-weight="600">GET /api/data</text>
    </g>
    <g class="n3">
      <line x1="340" y1="150" x2="180" y2="150" stroke="#22c55e" stroke-width="1.5"/>
      <polygon points="186,146 180,150 186,154" fill="#22c55e"/>
      <text x="260" y="168" text-anchor="middle" font-size="10" fill="#15803d" font-family="system-ui" font-weight="600">200 OK  { data: [...] }</text>
    </g>
    <text x="260" y="220" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n3">Request → Process → Response</text>`;
  return wrap(parts, 'HTTP Request / Response');
}

function array(): string {
  const vals = [15, 7, 42, 3, 28, 9, 56];
  const bw = 52, bh = 44, gap = 4;
  const totalW = vals.length * bw + (vals.length - 1) * gap;
  const x0 = (520 - totalW) / 2;
  const y = 110;
  let parts = '';
  vals.forEach((v, i) => {
    const x = x0 + i * (bw + gap);
    parts += `<g class="n${Math.min(i, 7)}">
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="5"
        fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
      <text x="${x+bw/2}" y="${y+bh/2+1}" text-anchor="middle" dominant-baseline="middle"
        font-size="14" fill="#1e3a5f" font-family="system-ui" font-weight="500">${v}</text>
      <text x="${x+bw/2}" y="${y+bh+16}" text-anchor="middle"
        font-size="10" fill="#94a3b8" font-family="system-ui">[${i}]</text>
    </g>`;
  });
  parts += `<text x="260" y="210" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n6">O(1) random access by index</text>`;
  return wrap(parts, 'Array');
}

// ═══════════════════════════════════════════════════════════════════════════════
// BIOLOGY
// ═══════════════════════════════════════════════════════════════════════════════

function neuron(): string {
  const p = `
    <!-- Soma (cell body) -->
    <ellipse cx="200" cy="150" rx="38" ry="30" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5" class="n0"/>
    <circle cx="200" cy="150" r="10" fill="#bfdbfe" stroke="#2563eb" stroke-width="1" class="n0"/>
    <text x="200" y="196" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui" class="n0">Soma</text>
    <!-- Dendrites (left) -->
    <g class="n1">
      <line x1="162" y1="135" x2="115" y2="100" stroke="#3b82f6" stroke-width="1.5"/>
      <line x1="162" y1="150" x2="105" y2="148" stroke="#3b82f6" stroke-width="1.5"/>
      <line x1="162" y1="165" x2="115" y2="195" stroke="#3b82f6" stroke-width="1.5"/>
      <line x1="115" y1="100" x2="85" y2="80" stroke="#3b82f6" stroke-width="1"/>
      <line x1="115" y1="100" x2="88" y2="115" stroke="#3b82f6" stroke-width="1"/>
      <text x="95" y="72" font-size="9" fill="#64748b" font-family="system-ui">Dendrites</text>
    </g>
    <!-- Axon (right) -->
    <line x1="238" y1="150" x2="450" y2="150" stroke="#1d4ed8" stroke-width="2" class="l2"/>
    <text x="320" y="138" text-anchor="middle" font-size="9" fill="#1d4ed8" font-family="system-ui" class="n3">Axon</text>
    <!-- Myelin sheaths -->
    <g class="n3">
      <rect x="265" y="140" width="28" height="20" rx="4" fill="#fef9c3" stroke="#f59e0b" stroke-width="1"/>
      <rect x="320" y="140" width="28" height="20" rx="4" fill="#fef9c3" stroke="#f59e0b" stroke-width="1"/>
      <rect x="375" y="140" width="28" height="20" rx="4" fill="#fef9c3" stroke="#f59e0b" stroke-width="1"/>
      <text x="350" y="175" text-anchor="middle" font-size="9" fill="#92400e" font-family="system-ui">Myelin Sheath</text>
    </g>
    <!-- Synaptic terminals -->
    <g class="n5">
      <circle cx="460" cy="132" r="7" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
      <circle cx="460" cy="150" r="7" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
      <circle cx="460" cy="168" r="7" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
      <line x1="450" y1="150" x2="453" y2="132" stroke="#1d4ed8" stroke-width="1.5"/>
      <line x1="450" y1="150" x2="453" y2="168" stroke="#1d4ed8" stroke-width="1.5"/>
      <text x="480" y="154" font-size="9" fill="#15803d" font-family="system-ui">Terminals</text>
    </g>
    <!-- Direction arrow -->
    <text x="260" y="275" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n5">Signal travels: Dendrites → Soma → Axon → Terminal</text>`;
  return wrap(p, 'Neuron Structure');
}

function dna(): string {
  // Simplified DNA double helix — two sine-ish strands with connecting rungs
  const pairs = [
    ['A','T'], ['T','A'], ['G','C'], ['C','G'],
    ['A','T'], ['G','C'], ['T','A'], ['C','G'],
  ];
  const colors: Record<string,string> = { A:'#ef4444', T:'#3b82f6', G:'#22c55e', C:'#f59e0b' };
  let p = '';
  const xs = [120, 175, 240, 300, 355, 400, 440, 470]; // left strand x positions
  const xr = [400, 345, 280, 220, 165, 120,  80,  50]; // right strand x
  const ys = [50, 80, 120, 165, 205, 240, 265, 278];   // y positions
  // Strands
  p += `<polyline points="${xs.map((x,i)=>`${x},${ys[i]}`).join(' ')}" fill="none" stroke="#2563eb" stroke-width="2" stroke-linejoin="round" class="l0"/>`;
  p += `<polyline points="${xr.map((x,i)=>`${x},${ys[i]}`).join(' ')}" fill="none" stroke="#ef4444" stroke-width="2" stroke-linejoin="round" class="l1"/>`;
  // Base pairs (rungs)
  pairs.forEach(([l, r], i) => {
    const y = ys[i];
    const xl = xs[i], xrl = xr[i];
    const mid = (xl + xrl) / 2;
    p += `<g class="n${Math.min(i, 7)}">
      <line x1="${xl+8}" y1="${y}" x2="${xrl-8}" y2="${y}" stroke="#94a3b8" stroke-width="1"/>
      <circle cx="${xl+8}" cy="${y}" r="8" fill="${colors[l]}" opacity="0.85"/>
      <circle cx="${xrl-8}" cy="${y}" r="8" fill="${colors[r]}" opacity="0.85"/>
      <text x="${xl+8}" y="${y+1}" text-anchor="middle" dominant-baseline="middle" font-size="8" fill="#fff" font-family="system-ui" font-weight="700">${l}</text>
      <text x="${xrl-8}" y="${y+1}" text-anchor="middle" dominant-baseline="middle" font-size="8" fill="#fff" font-family="system-ui" font-weight="700">${r}</text>
    </g>`;
  });
  // Legend
  p += `<g class="n7">
    ${['A=#ef4444','T=#3b82f6','G=#22c55e','C=#f59e0b'].map((e,i)=>{
      const [lbl,col] = e.split('=');
      return `<circle cx="${480}" cy="${60+i*20}" r="6" fill="${col}"/><text x="490" y="${64+i*20}" font-size="9" fill="#1e293b" font-family="system-ui">${lbl}</text>`;
    }).join('')}
    <text x="260" y="295" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui">A pairs with T · G pairs with C</text>
  </g>`;
  return wrap(p, 'DNA Double Helix');
}

function cell(): string {
  const p = `
    <!-- Cell membrane -->
    <ellipse cx="255" cy="155" rx="190" ry="130" fill="#eff6ff" stroke="#2563eb" stroke-width="2" class="n0"/>
    <text x="255" y="36" text-anchor="middle" font-size="9" fill="#2563eb" font-family="system-ui" class="n0">Cell Membrane</text>
    <!-- Nucleus -->
    <g class="n1">
      <ellipse cx="220" cy="145" rx="55" ry="42" fill="#dbeafe" stroke="#1d4ed8" stroke-width="1.8"/>
      <ellipse cx="220" cy="145" rx="18" ry="14" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="1"/>
      <text x="220" y="148" text-anchor="middle" dominant-baseline="middle" font-size="8" fill="#1e40af" font-family="system-ui">Nucleolus</text>
      <text x="220" y="196" text-anchor="middle" font-size="9" fill="#1d4ed8" font-family="system-ui">Nucleus</text>
    </g>
    <!-- Mitochondria -->
    <g class="n2">
      <ellipse cx="360" cy="120" rx="34" ry="18" fill="#fef9c3" stroke="#f59e0b" stroke-width="1.5"/>
      <line x1="330" y1="120" x2="394" y2="120" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3,2"/>
      <text x="360" y="148" text-anchor="middle" font-size="9" fill="#92400e" font-family="system-ui">Mitochondria</text>
    </g>
    <!-- Ribosomes -->
    <g class="n3">
      <circle cx="370" cy="175" r="5" fill="#f97316"/>
      <circle cx="385" cy="182" r="5" fill="#f97316"/>
      <circle cx="395" cy="165" r="5" fill="#f97316"/>
      <text x="390" y="200" text-anchor="middle" font-size="9" fill="#ea580c" font-family="system-ui">Ribosomes</text>
    </g>
    <!-- Rough ER -->
    <g class="n4">
      <path d="M290 175 Q310 165 330 175 Q350 185 370 175" fill="none" stroke="#8b5cf6" stroke-width="1.5"/>
      <path d="M290 188 Q310 178 330 188 Q350 198 370 188" fill="none" stroke="#8b5cf6" stroke-width="1.5"/>
      <text x="300" y="215" text-anchor="middle" font-size="9" fill="#7c3aed" font-family="system-ui">ER</text>
    </g>
    <!-- Vacuole -->
    <g class="n5">
      <ellipse cx="155" cy="185" rx="28" ry="22" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <text x="155" y="215" text-anchor="middle" font-size="9" fill="#15803d" font-family="system-ui">Vacuole</text>
    </g>
    <text x="255" y="292" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n5">Animal Cell — Eukaryote</text>`;
  return wrap(p, 'Animal Cell');
}

function photosynthesis(): string {
  const p = `
    <!-- Inputs -->
    <g class="n0">
      <rect x="30" y="55" width="90" height="36" rx="8" fill="#fef9c3" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="75" y="77" text-anchor="middle" font-size="11" fill="#78350f" font-family="system-ui" font-weight="600">☀ Sunlight</text>
    </g>
    <g class="n1">
      <rect x="30" y="105" width="90" height="36" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
      <text x="75" y="127" text-anchor="middle" font-size="11" fill="#14532d" font-family="system-ui" font-weight="600">CO₂</text>
    </g>
    <g class="n2">
      <rect x="30" y="155" width="90" height="36" rx="8" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
      <text x="75" y="177" text-anchor="middle" font-size="11" fill="#1e3a5f" font-family="system-ui" font-weight="600">H₂O</text>
    </g>
    <!-- Arrows in -->
    <g class="n3">
      <line x1="120" y1="73" x2="190" y2="140" stroke="#94a3b8" stroke-width="1.3"/>
      <line x1="120" y1="123" x2="190" y2="148" stroke="#94a3b8" stroke-width="1.3"/>
      <line x1="120" y1="173" x2="190" y2="158" stroke="#94a3b8" stroke-width="1.3"/>
    </g>
    <!-- Chloroplast -->
    <g class="n3">
      <ellipse cx="260" cy="150" rx="70" ry="50" fill="#d1fae5" stroke="#059669" stroke-width="2"/>
      <text x="260" y="144" text-anchor="middle" font-size="12" fill="#065f46" font-family="system-ui" font-weight="700">Chloroplast</text>
      <text x="260" y="162" text-anchor="middle" font-size="10" fill="#047857" font-family="system-ui">6CO₂ + 6H₂O + light</text>
    </g>
    <!-- Arrow out -->
    <g class="n4">
      <line x1="330" y1="140" x2="390" y2="125" stroke="#94a3b8" stroke-width="1.3"/>
      <polygon points="388,120 394,126 386,130" fill="#94a3b8"/>
      <line x1="330" y1="160" x2="390" y2="175" stroke="#94a3b8" stroke-width="1.3"/>
      <polygon points="388,172 394,178 386,180" fill="#94a3b8"/>
    </g>
    <!-- Outputs -->
    <g class="n5">
      <rect x="395" y="100" width="100" height="38" rx="8" fill="#fef9c3" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="445" y="123" text-anchor="middle" font-size="11" fill="#78350f" font-family="system-ui" font-weight="600">Glucose (C₆H₁₂O₆)</text>
    </g>
    <g class="n6">
      <rect x="395" y="158" width="100" height="38" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
      <text x="445" y="181" text-anchor="middle" font-size="11" fill="#14532d" font-family="system-ui" font-weight="600">O₂ (oxygen)</text>
    </g>
    <text x="260" y="264" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n6">6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂</text>`;
  return wrap(p, 'Photosynthesis');
}

function mitosis(): string {
  // 4 phases in a 2×2 grid
  const phases = [
    { name:'Prophase',  desc:'Chromosomes condense',  cx:130, cy:95 },
    { name:'Metaphase', desc:'Align at centre',        cx:390, cy:95 },
    { name:'Anaphase',  desc:'Chromosomes separate',   cx:130, cy:220 },
    { name:'Telophase', desc:'Two nuclei form',         cx:390, cy:220 },
  ];
  let p = '';
  phases.forEach(({ name, desc, cx, cy }, i) => {
    p += `<g class="n${i}">
      <ellipse cx="${cx}" cy="${cy}" rx="90" ry="65" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5"/>
      <text x="${cx}" y="${cy - 18}" text-anchor="middle" font-size="12" fill="#1e3a5f" font-family="system-ui" font-weight="700">${name}</text>
      <text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui">${desc}</text>
    </g>`;
    // Simple chromosome drawing
    if (i === 0) { // Prophase - condensed chromosomes
      p += `<g class="n${i}"><ellipse cx="${cx-12}" cy="${cy+16}" rx="7" ry="14" fill="#3b82f6" class="n${i}"/><ellipse cx="${cx+12}" cy="${cy+16}" rx="7" ry="14" fill="#ef4444" class="n${i}"/></g>`;
    } else if (i === 1) { // Metaphase - aligned
      p += `<g class="n${i}"><line x1="${cx-30}" y1="${cy+18}" x2="${cx+30}" y2="${cy+18}" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,2"/>
        <ellipse cx="${cx-12}" cy="${cy+18}" rx="6" ry="13" fill="#3b82f6"/><ellipse cx="${cx+12}" cy="${cy+18}" rx="6" ry="13" fill="#ef4444"/></g>`;
    } else if (i === 2) { // Anaphase - separating
      p += `<g class="n${i}"><ellipse cx="${cx-28}" cy="${cy+14}" rx="5" ry="10" fill="#3b82f6"/><ellipse cx="${cx+28}" cy="${cy+14}" rx="5" ry="10" fill="#ef4444"/>
        <line x1="${cx-22}" y1="${cy+14}" x2="${cx+22}" y2="${cy+14}" stroke="#22c55e" stroke-width="1" stroke-dasharray="2,2"/></g>`;
    } else { // Telophase - two cells
      p += `<g class="n${i}"><ellipse cx="${cx-30}" cy="${cy+18}" rx="22" ry="16" fill="#dbeafe" stroke="#2563eb" stroke-width="1"/>
        <ellipse cx="${cx+30}" cy="${cy+18}" rx="22" ry="16" fill="#fce7f3" stroke="#ec4899" stroke-width="1"/></g>`;
    }
  });
  // Arrows between phases
  p += `<g class="n4">
    <line x1="220" y1="95" x2="300" y2="95" stroke="#94a3b8" stroke-width="1.2"/>
    <polygon points="298,91 304,95 298,99" fill="#94a3b8"/>
    <line x1="260" y1="160" x2="260" y2="155" stroke="#94a3b8" stroke-width="1.2"/>
    <polygon points="256,157 260,163 264,157" fill="#94a3b8"/>
    <line x1="300" y1="220" x2="220" y2="220" stroke="#94a3b8" stroke-width="1.2"/>
    <polygon points="222,216 216,220 222,224" fill="#94a3b8"/>
  </g>`;
  return wrap(p, 'Mitosis — Cell Division');
}

function foodChain(): string {
  const items = [
    { lbl:'Sun',          icon:'☀',  fill:'#fef9c3', stroke:'#f59e0b', y:150 },
    { lbl:'Plants',       icon:'🌿', fill:'#dcfce7', stroke:'#16a34a', y:150 },
    { lbl:'Herbivore',    icon:'🐇', fill:'#eff6ff', stroke:'#2563eb', y:150 },
    { lbl:'Carnivore',    icon:'🦊', fill:'#fff7ed', stroke:'#f97316', y:150 },
    { lbl:'Apex Predator',icon:'🦅', fill:'#fef2f2', stroke:'#ef4444', y:150 },
  ];
  const bw = 74, bh = 56, gap = 18;
  const totalW = items.length * bw + (items.length-1)*gap;
  const x0 = (520 - totalW) / 2;
  let p = '';
  items.forEach(({lbl, icon, fill, stroke}, i) => {
    const x = x0 + i*(bw+gap);
    p += `<g class="n${i}">
      <rect x="${x}" y="122" width="${bw}" height="${bh}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <text x="${x+bw/2}" y="145" text-anchor="middle" font-size="18" font-family="system-ui">${icon}</text>
      <text x="${x+bw/2}" y="167" text-anchor="middle" font-size="9" fill="#1e293b" font-family="system-ui" font-weight="600">${lbl}</text>
    </g>`;
    if (i < items.length-1) {
      const ax = x + bw + 3;
      p += `<g class="n${i}">
        <line x1="${ax}" y1="150" x2="${ax+gap-4}" y2="150" stroke="#94a3b8" stroke-width="1.5"/>
        <polygon points="${ax+gap-4},146 ${ax+gap},150 ${ax+gap-4},154" fill="#94a3b8"/>
      </g>`;
    }
  });
  p += `<text x="260" y="218" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n4">Energy flows from producers → primary → secondary → apex consumers</text>`;
  return wrap(p, 'Food Chain');
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHEMISTRY
// ═══════════════════════════════════════════════════════════════════════════════

function atomicStructure(): string {
  const p = `
    <!-- Nucleus -->
    <g class="n0">
      <circle cx="260" cy="150" r="28" fill="#fef2f2" stroke="#ef4444" stroke-width="2"/>
      <text x="260" y="146" text-anchor="middle" font-size="9" fill="#7f1d1d" font-family="system-ui" font-weight="700">6p⁺</text>
      <text x="260" y="160" text-anchor="middle" font-size="9" fill="#7f1d1d" font-family="system-ui">6n</text>
      <text x="260" y="192" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="system-ui">Nucleus</text>
    </g>
    <!-- Shell 1 (K shell) — 2 electrons -->
    <g class="n1">
      <circle cx="260" cy="150" r="60" fill="none" stroke="#3b82f6" stroke-width="1" stroke-dasharray="4,3"/>
      <circle cx="260" cy="90" r="7" fill="#3b82f6"/>
      <circle cx="260" cy="210" r="7" fill="#3b82f6"/>
      <text x="328" y="94" font-size="9" fill="#1d4ed8" font-family="system-ui">K shell (2e⁻)</text>
    </g>
    <!-- Shell 2 (L shell) — 4 electrons (Carbon) -->
    <g class="n2">
      <circle cx="260" cy="150" r="110" fill="none" stroke="#22c55e" stroke-width="1" stroke-dasharray="4,3"/>
      <circle cx="260" cy="40" r="7" fill="#22c55e"/>
      <circle cx="260" cy="260" r="7" fill="#22c55e"/>
      <circle cx="150" cy="150" r="7" fill="#22c55e"/>
      <circle cx="370" cy="150" r="7" fill="#22c55e"/>
      <text x="380" y="154" font-size="9" fill="#15803d" font-family="system-ui">L shell (4e⁻)</text>
    </g>
    <text x="260" y="288" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n2">Carbon (C) — Atomic No. 6 — Bohr Model</text>`;
  return wrap(p, 'Atomic Structure');
}

function phScale(): string {
  const bands = [
    ['0','Battery acid','#ef4444'], ['1','Stomach acid','#f97316'],
    ['2','Lemon juice','#fb923c'], ['3','Vinegar','#fbbf24'],
    ['4','Coffee','#a3e635'], ['5','Rain water','#4ade80'],
    ['6','Milk','#34d399'], ['7','Pure water','#22c55e'],
    ['8','Sea water','#2dd4bf'], ['9','Baking soda','#38bdf8'],
    ['10','Milk of magnesia','#60a5fa'], ['11','Ammonia','#818cf8'],
    ['12','Soapy water','#a78bfa'], ['13','Bleach','#c084fc'],
    ['14','Drain cleaner','#e879f9'],
  ];
  const bw = 30, bh = 34, y = 60;
  const x0 = (520 - bands.length * bw) / 2;
  let p = '';
  bands.forEach(([num, label, color], i) => {
    const x = x0 + i * bw;
    p += `<g class="n${Math.min(Math.floor(i/2), 7)}">
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${color}" rx="${i===0?4:i===14?4:0}"/>
      <text x="${x+bw/2}" y="${y+bh/2+4}" text-anchor="middle" font-size="11" fill="white" font-family="system-ui" font-weight="700">${num}</text>
    </g>`;
    if (i === 0 || i === 7 || i === 14) {
      p += `<text x="${x+bw/2}" y="${y+bh+14}" text-anchor="middle" font-size="8" fill="#64748b" font-family="system-ui" class="n${Math.min(Math.floor(i/2),7)}">${label}</text>`;
    }
  });
  // Labels
  p += `<g class="n7">
    <text x="${x0+4*bw}" y="${y+bh+28}" text-anchor="middle" font-size="9" fill="#ef4444" font-family="system-ui" font-weight="600">← Acidic</text>
    <text x="${x0+7*bw}" y="${y+bh+28}" text-anchor="middle" font-size="9" fill="#22c55e" font-family="system-ui" font-weight="600">Neutral</text>
    <text x="${x0+11*bw}" y="${y+bh+28}" text-anchor="middle" font-size="9" fill="#818cf8" font-family="system-ui" font-weight="600">Alkaline →</text>
    <text x="260" y="142" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui">pH 0–6 = Acid  ·  pH 7 = Neutral  ·  pH 8–14 = Base</text>
  </g>`;
  return wrap(p, 'pH Scale');
}

function chemicalBond(): string {
  const p = `
    <!-- Title row -->
    <text x="130" y="38" text-anchor="middle" font-size="11" fill="#1e293b" font-family="system-ui" font-weight="700" class="n0">Ionic Bond</text>
    <text x="390" y="38" text-anchor="middle" font-size="11" fill="#1e293b" font-family="system-ui" font-weight="700" class="n0">Covalent Bond</text>
    <line x1="260" y1="25" x2="260" y2="280" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4,3"/>
    <!-- IONIC: Na → Na+ and Cl- -->
    <g class="n1">
      <circle cx="80" cy="140" r="36" fill="#eff6ff" stroke="#2563eb" stroke-width="1.8"/>
      <text x="80" y="136" text-anchor="middle" font-size="13" fill="#1e3a5f" font-family="system-ui" font-weight="700">Na</text>
      <text x="80" y="152" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui">1 outer e⁻</text>
      <circle cx="80" cy="100" r="5" fill="#f59e0b"/>
    </g>
    <g class="n2">
      <circle cx="175" cy="140" r="36" fill="#fef2f2" stroke="#ef4444" stroke-width="1.8"/>
      <text x="175" y="136" text-anchor="middle" font-size="13" fill="#7f1d1d" font-family="system-ui" font-weight="700">Cl</text>
      <text x="175" y="152" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui">7 outer e⁻</text>
    </g>
    <!-- Transfer arrow -->
    <g class="n3">
      <path d="M86,103 Q128,72 170,108" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
      <polygon points="168,105 173,112 165,112" fill="#f59e0b"/>
      <text x="128" y="68" text-anchor="middle" font-size="9" fill="#92400e" font-family="system-ui">e⁻ transfer</text>
      <text x="80" y="190" text-anchor="middle" font-size="10" fill="#1d4ed8" font-family="system-ui" font-weight="600">Na⁺</text>
      <text x="175" y="190" text-anchor="middle" font-size="10" fill="#dc2626" font-family="system-ui" font-weight="600">Cl⁻</text>
      <text x="128" y="220" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui">→ NaCl (table salt)</text>
    </g>
    <!-- COVALENT: H-H sharing -->
    <g class="n4">
      <circle cx="340" cy="140" r="34" fill="#eff6ff" stroke="#2563eb" stroke-width="1.8"/>
      <text x="340" y="144" text-anchor="middle" dominant-baseline="middle" font-size="16" fill="#1e3a5f" font-family="system-ui" font-weight="700">H</text>
    </g>
    <g class="n5">
      <circle cx="440" cy="140" r="34" fill="#eff6ff" stroke="#2563eb" stroke-width="1.8"/>
      <text x="440" y="144" text-anchor="middle" dominant-baseline="middle" font-size="16" fill="#1e3a5f" font-family="system-ui" font-weight="700">H</text>
    </g>
    <!-- Shared electrons -->
    <g class="n6">
      <circle cx="375" cy="132" r="5" fill="#f59e0b"/>
      <circle cx="390" cy="150" r="5" fill="#22c55e"/>
      <text x="390" y="192" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui">Shared electrons</text>
      <text x="390" y="220" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui">→ H₂ molecule</text>
    </g>
    <text x="260" y="276" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n6">Ionic: electron transfer  ·  Covalent: electron sharing</text>`;
  return wrap(p, 'Chemical Bonding');
}

function periodicTable(): string {
  const groups = [
    { n:'Group 1',   lbl:'Alkali Metals',       eg:'Li, Na, K',  fill:'#fef2f2', stroke:'#ef4444', tx:'#7f1d1d' },
    { n:'Group 2',   lbl:'Alkaline Earth',       eg:'Mg, Ca, Ba', fill:'#fff7ed', stroke:'#f97316', tx:'#7c2d12' },
    { n:'Groups 3-12',lbl:'Transition Metals',   eg:'Fe, Cu, Au', fill:'#fef9c3', stroke:'#f59e0b', tx:'#78350f' },
    { n:'Group 17',  lbl:'Halogens',             eg:'F, Cl, Br',  fill:'#eff6ff', stroke:'#2563eb', tx:'#1e3a5f' },
    { n:'Group 18',  lbl:'Noble Gases',          eg:'He, Ne, Ar', fill:'#f0fdf4', stroke:'#16a34a', tx:'#14532d' },
    { n:'Lanthanides',lbl:'Rare Earth',          eg:'La, Ce, Pr', fill:'#fdf4ff', stroke:'#a855f7', tx:'#581c87' },
  ];
  const bw = 140, bh = 44, gap = 8;
  const x0 = (520 - 3*(bw+gap)) / 2;
  let p = '';
  groups.forEach(({n, lbl, eg, fill, stroke, tx}, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = x0 + col*(bw+gap), y = 50 + row*(bh+gap);
    p += `<g class="n${i}">
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="7" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <text x="${x+bw/2}" y="${y+14}" text-anchor="middle" font-size="10" fill="${tx}" font-family="system-ui" font-weight="700">${n}</text>
      <text x="${x+bw/2}" y="${y+27}" text-anchor="middle" font-size="9" fill="${tx}" font-family="system-ui">${lbl}</text>
      <text x="${x+bw/2}" y="${y+39}" text-anchor="middle" font-size="8" fill="#94a3b8" font-family="system-ui">${eg}</text>
    </g>`;
  });
  p += `<text x="260" y="202" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n5">Elements arranged by atomic number and electron configuration</text>`;
  return wrap(p, 'Periodic Table — Groups');
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHYSICS
// ═══════════════════════════════════════════════════════════════════════════════

function circuit(): string {
  const p = `
    <!-- Battery -->
    <g class="n0">
      <rect x="60" y="110" width="18" height="40" rx="2" fill="#fef9c3" stroke="#f59e0b" stroke-width="2"/>
      <rect x="60" y="124" width="18" height="12" rx="1" fill="#f59e0b"/>
      <text x="69" y="165" text-anchor="middle" font-size="8" fill="#78350f" font-family="system-ui">9V</text>
      <text x="56" y="125" font-size="10" fill="#15803d" font-family="system-ui" font-weight="700">+</text>
      <text x="56" y="145" font-size="12" fill="#ef4444" font-family="system-ui" font-weight="700">−</text>
    </g>
    <!-- Wires -->
    <g class="n1">
      <line x1="69" y1="110" x2="69" y2="60" stroke="#1e293b" stroke-width="2"/>
      <line x1="69" y1="60" x2="450" y2="60" stroke="#1e293b" stroke-width="2"/>
      <line x1="450" y1="60" x2="450" y2="150" stroke="#1e293b" stroke-width="2"/>
      <line x1="69" y1="150" x2="69" y2="240" stroke="#1e293b" stroke-width="2"/>
      <line x1="69" y1="240" x2="450" y2="240" stroke="#1e293b" stroke-width="2"/>
      <line x1="450" y1="240" x2="450" y2="195" stroke="#1e293b" stroke-width="2"/>
    </g>
    <!-- Switch -->
    <g class="n2">
      <circle cx="180" cy="60" r="5" fill="#1e293b"/>
      <circle cx="240" cy="60" r="5" fill="#1e293b"/>
      <line x1="185" y1="60" x2="235" y2="45" stroke="#1e293b" stroke-width="2"/>
      <text x="210" y="80" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui">Switch</text>
    </g>
    <!-- Light bulb -->
    <g class="n3">
      <circle cx="330" cy="60" r="18" fill="#fef9c3" stroke="#f59e0b" stroke-width="1.8"/>
      <line x1="323" y1="67" x2="337" y2="53" stroke="#f97316" stroke-width="1.5"/>
      <line x1="330" y1="78" x2="330" y2="60" stroke="#1e293b" stroke-width="1"/>
      <text x="330" y="94" text-anchor="middle" font-size="9" fill="#92400e" font-family="system-ui">Bulb</text>
    </g>
    <!-- Resistor -->
    <g class="n4">
      <rect x="420" y="152" width="60" height="22" rx="3" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
      <text x="450" y="167" text-anchor="middle" font-size="9" fill="#475569" font-family="system-ui">100Ω</text>
      <text x="480" y="167" font-size="8" fill="#64748b" font-family="system-ui">Resistor</text>
    </g>
    <!-- Current direction arrows -->
    <g class="n5">
      <polygon points="256,55 264,60 256,65" fill="#22c55e"/>
      <text x="260" y="48" text-anchor="middle" font-size="8" fill="#15803d" font-family="system-ui">I →</text>
      <text x="260" y="258" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui">V = IR  ·  Ohm's Law  ·  Series Circuit</text>
    </g>`;
  return wrap(p, 'Electrical Circuit');
}

function wave(): string {
  // Draw a transverse sine wave
  const pts: string[] = [];
  for (let x = 30; x <= 490; x += 4) {
    const y = 150 - 60 * Math.sin((x - 30) * Math.PI / 115);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  const p = `
    <!-- Axes -->
    <g class="n0">
      <line x1="25" y1="150" x2="500" y2="150" stroke="#e2e8f0" stroke-width="1"/>
      <line x1="30" y1="40" x2="30" y2="260" stroke="#e2e8f0" stroke-width="1"/>
      <text x="505" y="154" font-size="9" fill="#94a3b8" font-family="system-ui">x</text>
      <text x="32" y="38" font-size="9" fill="#94a3b8" font-family="system-ui">y</text>
    </g>
    <!-- Wave -->
    <polyline points="${pts.join(' ')}" fill="none" stroke="#2563eb" stroke-width="2.5" class="l2"/>
    <!-- Amplitude arrow -->
    <g class="n2">
      <line x1="72" y1="150" x2="72" y2="90" stroke="#ef4444" stroke-width="1.5"/>
      <polygon points="68,92 72,86 76,92" fill="#ef4444"/>
      <polygon points="68,148 72,154 76,148" fill="#ef4444"/>
      <text x="55" y="122" text-anchor="middle" font-size="9" fill="#dc2626" font-family="system-ui">A</text>
      <text x="42" y="110" font-size="8" fill="#dc2626" font-family="system-ui">Amplitude</text>
    </g>
    <!-- Wavelength arrow -->
    <g class="n3">
      <line x1="30" y1="264" x2="260" y2="264" stroke="#22c55e" stroke-width="1.5"/>
      <polygon points="32,260 26,264 32,268" fill="#22c55e"/>
      <polygon points="258,260 264,264 258,268" fill="#22c55e"/>
      <text x="145" y="280" text-anchor="middle" font-size="9" fill="#15803d" font-family="system-ui">λ Wavelength</text>
    </g>
    <!-- Crest & Trough labels -->
    <g class="n4">
      <text x="145" y="82" text-anchor="middle" font-size="9" fill="#2563eb" font-family="system-ui">Crest</text>
      <text x="375" y="226" text-anchor="middle" font-size="9" fill="#7c3aed" font-family="system-ui">Trough</text>
      <text x="260" y="294" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui">v = fλ  ·  Transverse Wave</text>
    </g>`;
  return wrap(p, 'Wave — Transverse');
}

function forces(): string {
  const p = `
    <!-- Object -->
    <g class="n0">
      <rect x="200" y="140" width="120" height="80" rx="8" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
      <text x="260" y="185" text-anchor="middle" dominant-baseline="middle" font-size="13" fill="#1e3a5f" font-family="system-ui" font-weight="700">Object</text>
      <text x="260" y="200" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui">m = 5 kg</text>
    </g>
    <!-- Weight (down) -->
    <g class="n1">
      <line x1="260" y1="220" x2="260" y2="280" stroke="#ef4444" stroke-width="2"/>
      <polygon points="255,278 260,286 265,278" fill="#ef4444"/>
      <text x="290" y="262" font-size="10" fill="#dc2626" font-family="system-ui" font-weight="600">W = mg</text>
      <text x="290" y="276" font-size="9" fill="#dc2626" font-family="system-ui">49 N ↓</text>
    </g>
    <!-- Normal (up) -->
    <g class="n2">
      <line x1="260" y1="140" x2="260" y2="80" stroke="#22c55e" stroke-width="2"/>
      <polygon points="255,82 260,74 265,82" fill="#22c55e"/>
      <text x="290" y="110" font-size="10" fill="#15803d" font-family="system-ui" font-weight="600">N (Normal)</text>
      <text x="290" y="124" font-size="9" fill="#15803d" font-family="system-ui">49 N ↑</text>
    </g>
    <!-- Applied force (right) -->
    <g class="n3">
      <line x1="320" y1="180" x2="390" y2="180" stroke="#f59e0b" stroke-width="2"/>
      <polygon points="388,175 396,180 388,185" fill="#f59e0b"/>
      <text x="405" y="174" font-size="10" fill="#92400e" font-family="system-ui" font-weight="600">F applied</text>
      <text x="405" y="188" font-size="9" fill="#92400e" font-family="system-ui">20 N →</text>
    </g>
    <!-- Friction (left) -->
    <g class="n4">
      <line x1="200" y1="180" x2="130" y2="180" stroke="#8b5cf6" stroke-width="2"/>
      <polygon points="132,175 124,180 132,185" fill="#8b5cf6"/>
      <text x="50" y="174" font-size="10" fill="#6d28d9" font-family="system-ui" font-weight="600">Friction</text>
      <text x="60" y="188" font-size="9" fill="#6d28d9" font-family="system-ui">8 N ←</text>
    </g>
    <!-- Ground -->
    <line x1="60" y1="300" x2="460" y2="300" stroke="#94a3b8" stroke-width="3" class="n0"/>
    <text x="260" y="234" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui" class="n4">ΣF = ma  ·  Newton's Second Law  ·  Free Body Diagram</text>`;
  return wrap(p, 'Forces — Free Body Diagram');
}

function emSpectrum(): string {
  const bands = [
    { lbl:'Radio',       sub:'km–m',  fill:'#7c3aed', w:52 },
    { lbl:'Micro-\nwave', sub:'mm',   fill:'#2563eb', w:48 },
    { lbl:'Infrared',    sub:'μm',    fill:'#dc2626', w:48 },
    { lbl:'Visible',     sub:'400-700nm', fill:'linear', w:60 },
    { lbl:'UV',          sub:'nm',    fill:'#7c3aed', w:44 },
    { lbl:'X-ray',       sub:'pm',    fill:'#0e7490', w:44 },
    { lbl:'Gamma',       sub:'fm',    fill:'#065f46', w:40 },
  ];
  const bh = 50, y = 90;
  const totalW = bands.reduce((s,b)=>s+b.w+4,0)-4;
  let x = (520-totalW)/2;
  let p = '';
  bands.forEach(({lbl, sub, fill, w}, i) => {
    const realFill = fill === 'linear'
      ? `url(#visSpec)`
      : fill;
    p += `<g class="n${Math.min(i,7)}">
      <rect x="${x}" y="${y}" width="${w}" height="${bh}" rx="${i===0?6:i===6?6:0}" fill="${realFill}"/>
      <text x="${x+w/2}" y="${y+bh/2-4}" text-anchor="middle" font-size="8" fill="white" font-family="system-ui" font-weight="600">${lbl}</text>
      <text x="${x+w/2}" y="${y+bh/2+8}" text-anchor="middle" font-size="7" fill="rgba(255,255,255,0.8)" font-family="system-ui">${sub}</text>
    </g>`;
    x += w + 4;
  });
  // Visible spectrum gradient def
  p = `<defs><linearGradient id="visSpec" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#8b5cf6"/>
    <stop offset="20%" stop-color="#3b82f6"/>
    <stop offset="40%" stop-color="#22c55e"/>
    <stop offset="60%" stop-color="#f59e0b"/>
    <stop offset="80%" stop-color="#f97316"/>
    <stop offset="100%" stop-color="#ef4444"/>
  </linearGradient></defs>` + p;
  p += `<g class="n6">
    <line x1="70" y1="155" x2="450" y2="155" stroke="#e2e8f0" stroke-width="1"/>
    <polygon points="448,151 454,155 448,159" fill="#94a3b8"/>
    <text x="262" y="170" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="system-ui">Increasing frequency →</text>
    <text x="262" y="185" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="system-ui">← Increasing wavelength</text>
  </g>`;
  return wrap(p, 'Electromagnetic Spectrum');
}

function kinematics(): string {
  // velocity-time graph
  const pts = '60,220 160,220 260,100 360,100 460,160';
  const p = `
    <!-- Axes -->
    <g class="n0">
      <line x1="55" y1="40" x2="55" y2="235" stroke="#1e293b" stroke-width="2"/>
      <line x1="50" y1="230" x2="480" y2="230" stroke="#1e293b" stroke-width="2"/>
      <polygon points="51,42 55,34 59,42" fill="#1e293b"/>
      <polygon points="478,226 486,230 478,234" fill="#1e293b"/>
      <text x="35" y="44" font-size="10" fill="#1e293b" font-family="system-ui">v</text>
      <text x="488" y="234" font-size="10" fill="#1e293b" font-family="system-ui">t</text>
    </g>
    <!-- Grid lines -->
    <g class="n0">
      ${[40,100,160,220].map(y=>`<line x1="55" y1="${y}" x2="470" y2="${y}" stroke="#f1f5f9" stroke-width="1"/>`).join('')}
    </g>
    <!-- Graph line -->
    <polyline points="${pts}" fill="none" stroke="#2563eb" stroke-width="2.5" class="l2" stroke-linejoin="round"/>
    <!-- Shaded area (displacement) -->
    <polygon points="${pts} 460,230 60,230" fill="#eff6ff" opacity="0.6" class="n2"/>
    <!-- Phase labels -->
    <g class="n3">
      <text x="110" y="218" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui">Stationary</text>
      <text x="210" y="155" text-anchor="middle" font-size="9" fill="#2563eb" font-family="system-ui">Acceleration</text>
      <text x="310" y="88" text-anchor="middle" font-size="9" fill="#16a34a" font-family="system-ui">Constant v</text>
      <text x="410" y="148" text-anchor="middle" font-size="9" fill="#f97316" font-family="system-ui">Deceleration</text>
    </g>
    <!-- Y-axis label -->
    <text x="22" y="140" font-size="9" fill="#64748b" font-family="system-ui" transform="rotate(-90,22,140)">Velocity (m/s)</text>
    <text x="262" y="270" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n3">Area under v-t graph = displacement  ·  slope = acceleration</text>`;
  return wrap(p, 'Kinematics — Velocity–Time Graph');
}

// ═══════════════════════════════════════════════════════════════════════════════
// MATHEMATICS
// ═══════════════════════════════════════════════════════════════════════════════

function vennDiagram(): string {
  const p = `
    <!-- Set A -->
    <g class="n0">
      <circle cx="210" cy="150" r="100" fill="#eff6ff" stroke="#2563eb" stroke-width="2" opacity="0.85"/>
      <text x="155" y="125" text-anchor="middle" font-size="28" fill="#2563eb" font-family="system-ui" font-weight="800">A</text>
      <text x="155" y="152" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui">{1, 2, 3, 4}</text>
    </g>
    <!-- Set B -->
    <g class="n1">
      <circle cx="310" cy="150" r="100" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" opacity="0.85"/>
      <text x="365" y="125" text-anchor="middle" font-size="28" fill="#16a34a" font-family="system-ui" font-weight="800">B</text>
      <text x="365" y="152" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui">{3, 4, 5, 6}</text>
    </g>
    <!-- Intersection label -->
    <g class="n2">
      <text x="260" y="143" text-anchor="middle" font-size="11" fill="#1e293b" font-family="system-ui" font-weight="700">A ∩ B</text>
      <text x="260" y="160" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui">{3, 4}</text>
    </g>
    <!-- Labels -->
    <g class="n3">
      <text x="260" y="270" text-anchor="middle" font-size="10" fill="#1e293b" font-family="system-ui" font-weight="600">A ∪ B = {1,2,3,4,5,6}  ·  A ∩ B = {3,4}</text>
      <text x="260" y="286" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui">Elements in A only  |  Elements in both  |  Elements in B only</text>
    </g>`;
  return wrap(p, 'Venn Diagram — Set Theory');
}

function quadratic(): string {
  // y = x^2 - 4x - 5, roots at x=-1 and x=5, vertex at x=2
  const pts: string[] = [];
  for (let xi = -1.5; xi <= 5.5; xi += 0.15) {
    const y = xi*xi - 4*xi - 5;
    const px = 90 + (xi + 1.5) * 48;
    const py = 160 - y * 9;
    if (py >= 30 && py <= 270) pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  const p = `
    <!-- Axes -->
    <g class="n0">
      <line x1="50" y1="30" x2="50" y2="275" stroke="#1e293b" stroke-width="1.5"/>
      <line x1="30" y1="160" x2="480" y2="160" stroke="#1e293b" stroke-width="1.5"/>
      <polygon points="46,32 50,24 54,32" fill="#1e293b"/>
      <polygon points="478,156 486,160 478,164" fill="#1e293b"/>
      <text x="490" y="164" font-size="10" fill="#1e293b" font-family="system-ui">x</text>
      <text x="38" y="26" font-size="10" fill="#1e293b" font-family="system-ui">y</text>
    </g>
    <!-- Parabola -->
    <polyline points="${pts.join(' ')}" fill="none" stroke="#2563eb" stroke-width="2.5" class="l2" stroke-linejoin="round"/>
    <!-- Roots -->
    <g class="n2">
      <circle cx="162" cy="160" r="6" fill="#ef4444"/>
      <text x="162" y="180" text-anchor="middle" font-size="9" fill="#dc2626" font-family="system-ui" font-weight="600">x = −1</text>
      <circle cx="402" cy="160" r="6" fill="#ef4444"/>
      <text x="402" y="180" text-anchor="middle" font-size="9" fill="#dc2626" font-family="system-ui" font-weight="600">x = 5</text>
    </g>
    <!-- Vertex -->
    <g class="n3">
      <circle cx="282" cy="241" r="6" fill="#22c55e"/>
      <text x="310" y="250" font-size="9" fill="#15803d" font-family="system-ui" font-weight="600">Vertex (2, −9)</text>
    </g>
    <!-- Equation -->
    <g class="n4">
      <text x="380" y="60" font-size="11" fill="#1d4ed8" font-family="system-ui" font-weight="600">y = x² − 4x − 5</text>
      <text x="260" y="294" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui">Roots: x = −1, 5  ·  Vertex: (2, −9)  ·  Opens upward (a &gt; 0)</text>
    </g>`;
  return wrap(p, 'Quadratic Function');
}

function probabilityTree(): string {
  const p = `
    <!-- Root -->
    <g class="n0">
      <circle cx="80" cy="150" r="22" fill="#eff6ff" stroke="#2563eb" stroke-width="1.8"/>
      <text x="80" y="154" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="#1e3a5f" font-family="system-ui" font-weight="600">Start</text>
    </g>
    <!-- Level 1 branches -->
    <g class="n1">
      <line x1="102" y1="133" x2="200" y2="90" stroke="#3b82f6" stroke-width="1.5"/>
      <line x1="102" y1="167" x2="200" y2="210" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="145" y="100" font-size="9" fill="#2563eb" font-family="system-ui" font-weight="600">P(A) = 0.6</text>
      <text x="138" y="175" font-size="9" fill="#2563eb" font-family="system-ui" font-weight="600">P(Ā) = 0.4</text>
    </g>
    <!-- Level 1 nodes -->
    <g class="n2">
      <circle cx="218" cy="90" r="22" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
      <text x="218" y="94" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#14532d" font-family="system-ui" font-weight="700">A</text>
      <circle cx="218" cy="210" r="22" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5"/>
      <text x="218" y="214" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="#7f1d1d" font-family="system-ui" font-weight="700">Ā</text>
    </g>
    <!-- Level 2 branches from A -->
    <g class="n3">
      <line x1="240" y1="75" x2="350" y2="50" stroke="#16a34a" stroke-width="1.3"/>
      <line x1="240" y1="105" x2="350" y2="130" stroke="#16a34a" stroke-width="1.3"/>
      <text x="286" y="52" font-size="8" fill="#15803d" font-family="system-ui">P(B|A)=0.7</text>
      <text x="286" y="122" font-size="8" fill="#15803d" font-family="system-ui">P(B̄|A)=0.3</text>
    </g>
    <!-- Level 2 branches from Ā -->
    <g class="n4">
      <line x1="240" y1="195" x2="350" y2="170" stroke="#ef4444" stroke-width="1.3"/>
      <line x1="240" y1="225" x2="350" y2="250" stroke="#ef4444" stroke-width="1.3"/>
      <text x="283" y="174" font-size="8" fill="#dc2626" font-family="system-ui">P(B|Ā)=0.2</text>
      <text x="283" y="252" font-size="8" fill="#dc2626" font-family="system-ui">P(B̄|Ā)=0.8</text>
    </g>
    <!-- Leaf nodes -->
    <g class="n5">
      <rect x="352" y="36" width="50" height="28" rx="5" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
      <text x="377" y="54" text-anchor="middle" font-size="9" fill="#14532d" font-family="system-ui">A∩B: 0.42</text>
      <rect x="352" y="116" width="50" height="28" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="1"/>
      <text x="377" y="134" text-anchor="middle" font-size="9" fill="#1e3a5f" font-family="system-ui">A∩B̄: 0.18</text>
      <rect x="352" y="156" width="50" height="28" rx="5" fill="#fff7ed" stroke="#f97316" stroke-width="1"/>
      <text x="377" y="174" text-anchor="middle" font-size="9" fill="#7c2d12" font-family="system-ui">Ā∩B: 0.08</text>
      <rect x="352" y="236" width="50" height="28" rx="5" fill="#fef2f2" stroke="#ef4444" stroke-width="1"/>
      <text x="377" y="254" text-anchor="middle" font-size="9" fill="#7f1d1d" font-family="system-ui">Ā∩B̄: 0.32</text>
    </g>
    <text x="260" y="292" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui" class="n5">P(B) = P(B|A)P(A) + P(B|Ā)P(Ā) = 0.42+0.08 = 0.50</text>`;
  return wrap(p, 'Probability Tree');
}

function matrix(): string {
  const p = `
    <!-- Matrix A -->
    <g class="n0">
      <text x="105" y="70" text-anchor="middle" font-size="12" fill="#1e293b" font-family="system-ui" font-weight="700">A</text>
      <line x1="60" y1="78" x2="60" y2="178" stroke="#2563eb" stroke-width="2"/>
      <line x1="150" y1="78" x2="150" y2="178" stroke="#2563eb" stroke-width="2"/>
      ${[[2,3],[1,4]].map(([a,b],r)=>
        `<text x="90" y="${110+r*42}" text-anchor="middle" font-size="16" fill="#1e3a5f" font-family="system-ui" font-weight="600">${a}</text>
         <text x="125" y="${110+r*42}" text-anchor="middle" font-size="16" fill="#1e3a5f" font-family="system-ui" font-weight="600">${b}</text>`
      ).join('')}
    </g>
    <!-- × -->
    <text x="175" y="135" text-anchor="middle" font-size="22" fill="#64748b" font-family="system-ui" class="n1">×</text>
    <!-- Matrix B -->
    <g class="n2">
      <text x="235" y="70" text-anchor="middle" font-size="12" fill="#1e293b" font-family="system-ui" font-weight="700">B</text>
      <line x1="190" y1="78" x2="190" y2="178" stroke="#22c55e" stroke-width="2"/>
      <line x1="280" y1="78" x2="280" y2="178" stroke="#22c55e" stroke-width="2"/>
      ${[[1,0],[0,1]].map(([a,b],r)=>
        `<text x="220" y="${110+r*42}" text-anchor="middle" font-size="16" fill="#14532d" font-family="system-ui" font-weight="600">${a}</text>
         <text x="255" y="${110+r*42}" text-anchor="middle" font-size="16" fill="#14532d" font-family="system-ui" font-weight="600">${b}</text>`
      ).join('')}
    </g>
    <!-- = -->
    <text x="305" y="135" text-anchor="middle" font-size="22" fill="#64748b" font-family="system-ui" class="n3">=</text>
    <!-- Result -->
    <g class="n4">
      <text x="375" y="70" text-anchor="middle" font-size="12" fill="#1e293b" font-family="system-ui" font-weight="700">A × B</text>
      <line x1="326" y1="78" x2="326" y2="178" stroke="#f59e0b" stroke-width="2"/>
      <line x1="424" y1="78" x2="424" y2="178" stroke="#f59e0b" stroke-width="2"/>
      ${[[2,3],[1,4]].map(([a,b],r)=>
        `<text x="358" y="${110+r*42}" text-anchor="middle" font-size="16" fill="#78350f" font-family="system-ui" font-weight="600">${a}</text>
         <text x="393" y="${110+r*42}" text-anchor="middle" font-size="16" fill="#78350f" font-family="system-ui" font-weight="600">${b}</text>`
      ).join('')}
    </g>
    <!-- Formula -->
    <g class="n5">
      <text x="260" y="210" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui">Row × Column  →  C[i][j] = Σ A[i][k] × B[k][j]</text>
      <text x="260" y="240" text-anchor="middle" font-size="10" fill="#94a3b8" font-family="system-ui">Identity matrix I: A × I = A  ·  Non-commutative: AB ≠ BA</text>
    </g>`;
  return wrap(p, 'Matrix Multiplication');
}

function normalDistribution(): string {
  // Bell curve
  const pts: string[] = [];
  for (let xi = -3.5; xi <= 3.5; xi += 0.1) {
    const y = Math.exp(-0.5 * xi * xi) / Math.sqrt(2 * Math.PI);
    const px = 260 + xi * 62;
    const py = 220 - y * 600;
    pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  const p = `
    <!-- X axis -->
    <line x1="40" y1="220" x2="480" y2="220" stroke="#1e293b" stroke-width="1.5" class="n0"/>
    <!-- Filled area between -1σ and +1σ (68%) -->
    <polygon points="198,220 ${pts.filter(pt=>{const x=parseFloat(pt);return x>=198&&x<=322;}).join(' ')} 322,220" fill="#3b82f6" opacity="0.2" class="n2"/>
    <!-- Bell curve -->
    <polyline points="${pts.join(' ')}" fill="none" stroke="#2563eb" stroke-width="2.5" class="l2" stroke-linejoin="round"/>
    <!-- Mean line -->
    <line x1="260" y1="30" x2="260" y2="220" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,3" class="n2"/>
    <text x="260" y="240" text-anchor="middle" font-size="9" fill="#dc2626" font-family="system-ui" class="n2">μ (mean)</text>
    <!-- Sigma labels -->
    <g class="n3">
      <text x="198" y="235" text-anchor="middle" font-size="9" fill="#2563eb" font-family="system-ui">−1σ</text>
      <text x="322" y="235" text-anchor="middle" font-size="9" fill="#2563eb" font-family="system-ui">+1σ</text>
      <text x="136" y="235" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui">−2σ</text>
      <text x="384" y="235" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui">+2σ</text>
    </g>
    <!-- Percentage labels -->
    <g class="n4">
      <text x="260" y="170" text-anchor="middle" font-size="11" fill="#1d4ed8" font-family="system-ui" font-weight="700">68.27%</text>
      <text x="260" y="155" text-anchor="middle" font-size="9" fill="#2563eb" font-family="system-ui">within ±1σ</text>
      <text x="260" y="264" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui">±1σ: 68.27%  ·  ±2σ: 95.45%  ·  ±3σ: 99.73%</text>
    </g>`;
  return wrap(p, 'Normal Distribution — Bell Curve');
}

// ═══════════════════════════════════════════════════════════════════════════════
// ECONOMICS
// ═══════════════════════════════════════════════════════════════════════════════

function supplyDemand(): string {
  const p = `
    <!-- Axes -->
    <g class="n0">
      <line x1="60" y1="30" x2="60" y2="260" stroke="#1e293b" stroke-width="2"/>
      <line x1="50" y1="255" x2="480" y2="255" stroke="#1e293b" stroke-width="2"/>
      <polygon points="56,32 60,24 64,32" fill="#1e293b"/>
      <polygon points="478,251 486,255 478,259" fill="#1e293b"/>
      <text x="32" y="28" font-size="11" fill="#1e293b" font-family="system-ui" font-weight="700">P</text>
      <text x="490" y="259" font-size="11" fill="#1e293b" font-family="system-ui" font-weight="700">Q</text>
    </g>
    <!-- Demand curve (downward) -->
    <g class="n1">
      <line x1="80" y1="55" x2="460" y2="235" stroke="#ef4444" stroke-width="2.5"/>
      <text x="465" y="248" font-size="11" fill="#dc2626" font-family="system-ui" font-weight="700">D</text>
    </g>
    <!-- Supply curve (upward) -->
    <g class="n2">
      <line x1="80" y1="235" x2="460" y2="55" stroke="#2563eb" stroke-width="2.5"/>
      <text x="465" y="52" font-size="11" fill="#1d4ed8" font-family="system-ui" font-weight="700">S</text>
    </g>
    <!-- Equilibrium point -->
    <g class="n3">
      <circle cx="270" cy="145" r="9" fill="#f59e0b" stroke="#92400e" stroke-width="1.5"/>
      <line x1="60" y1="145" x2="270" y2="145" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4,3"/>
      <line x1="270" y1="145" x2="270" y2="255" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4,3"/>
      <text x="35" y="149" font-size="9" fill="#92400e" font-family="system-ui" font-weight="600">P*</text>
      <text x="265" y="272" text-anchor="middle" font-size="9" fill="#92400e" font-family="system-ui" font-weight="600">Q*</text>
      <text x="295" y="128" font-size="9" fill="#92400e" font-family="system-ui" font-weight="600">Equilibrium</text>
    </g>
    <text x="260" y="294" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui" class="n3">At equilibrium: Qd = Qs  ·  No shortage or surplus</text>`;
  return wrap(p, 'Supply & Demand — Market Equilibrium');
}

function gdp(): string {
  const components = [
    { lbl:'C — Consumption',   val:68, fill:'#3b82f6', sub:'Households' },
    { lbl:'I — Investment',    val:18, fill:'#22c55e', sub:'Business' },
    { lbl:'G — Government',    val:17, fill:'#f59e0b', sub:'Spending' },
    { lbl:'NX — Net Exports',  val:-3, fill:'#ef4444', sub:'Exports − Imports' },
  ];
  const barH = 40, gap = 12, maxBarW = 290, x0 = 160, y0 = 46;
  let p = '';
  components.forEach(({lbl, val, fill, sub}, i) => {
    const y = y0 + i * (barH + gap);
    const bw = Math.abs(val) / 68 * maxBarW;
    const isNeg = val < 0;
    p += `<g class="n${i}">
      <text x="${x0-6}" y="${y+barH/2+4}" text-anchor="end" font-size="10" fill="#1e293b" font-family="system-ui" font-weight="600">${lbl}</text>
      <rect x="${x0}" y="${y}" width="${bw}" height="${barH}" rx="5" fill="${fill}" opacity="0.85"/>
      <text x="${x0+bw+6}" y="${y+barH/2+4}" font-size="12" fill="${fill}" font-family="system-ui" font-weight="700">${val > 0 ? '+' : ''}${val}%</text>
      <text x="${x0}" y="${y+barH+2}" font-size="8" fill="#94a3b8" font-family="system-ui">${sub}</text>
    </g>`;
  });
  p += `<g class="n4">
    <text x="260" y="230" text-anchor="middle" font-size="11" fill="#1e293b" font-family="system-ui" font-weight="700">GDP = C + I + G + NX</text>
    <text x="260" y="248" text-anchor="middle" font-size="9" fill="#64748b" font-family="system-ui">Expenditure approach  ·  Measures total output of an economy</text>
  </g>`;
  return wrap(p, 'GDP Components');
}

function inflation(): string {
  const years = ['2019','2020','2021','2022','2023'];
  const vals  = [2.3, 1.4, 7.0, 8.0, 3.4];
  const bw = 52, gap = 22, y0 = 40, maxH = 160;
  const totalW = years.length*(bw+gap)-gap;
  const x0 = (520-totalW)/2;
  const maxVal = 10;
  let p = '';
  vals.forEach((v, i) => {
    const x = x0 + i*(bw+gap);
    const bh = (v/maxVal)*maxH;
    const fill = v > 5 ? '#ef4444' : v > 3 ? '#f59e0b' : '#22c55e';
    p += `<g class="n${i}">
      <rect x="${x}" y="${y0+maxH-bh}" width="${bw}" height="${bh}" rx="6" fill="${fill}" opacity="0.85"/>
      <text x="${x+bw/2}" y="${y0+maxH-bh-6}" text-anchor="middle" font-size="11" fill="${fill}" font-family="system-ui" font-weight="700">${v}%</text>
      <text x="${x+bw/2}" y="${y0+maxH+16}" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui">${years[i]}</text>
    </g>`;
  });
  // Target line
  p += `<g class="n5">
    <line x1="${x0-10}" y1="${y0+maxH-(2/maxVal)*maxH}" x2="${x0+totalW+10}" y2="${y0+maxH-(2/maxVal)*maxH}" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="5,3"/>
    <text x="${x0+totalW+14}" y="${y0+maxH-(2/maxVal)*maxH+4}" font-size="9" fill="#15803d" font-family="system-ui">2% target</text>
    <text x="260" y="260" text-anchor="middle" font-size="10" fill="#64748b" font-family="system-ui">Consumer Price Index (CPI) — Annual Inflation Rate %</text>
  </g>`;
  return wrap(p, 'Inflation — CPI Rate');
}

// ── Diagram registry ─────────────────────────────────────────────────────────
const BUILDERS: Record<string, () => string> = {
  'linked-list':         linkedList,
  'doubly-linked-list':  doublyLinkedList,
  'stack':               stack,
  'queue':               queue,
  'heap':                heap,
  'binary-tree':         () => binaryTree(false),
  'bst':                 () => binaryTree(true),
  'hash-map':            hashMap,
  'graph':               graph,
  'binary-search':       binarySearch,
  'bubble-sort':         bubbleSort,
  'merge-sort':          mergeSort,
  'big-o':               bigO,
  'two-pointers':        twoPointers,
  'sliding-window':      slidingWindow,
  'dynamic-programming': dynamicProgramming,
  'recursion':           recursion,
  'tcp-handshake':       tcpHandshake,
  'http-request':        httpRequest,
  'array':               array,
  // Biology
  'neuron':              neuron,
  'dna':                 dna,
  'cell':                cell,
  'photosynthesis':      photosynthesis,
  'mitosis':             mitosis,
  'food-chain':          foodChain,
  // Chemistry
  'atomic-structure':    atomicStructure,
  'ph-scale':            phScale,
  'chemical-bond':       chemicalBond,
  'periodic-table':      periodicTable,
  // Physics
  'circuit':             circuit,
  'wave':                wave,
  'forces':              forces,
  'em-spectrum':         emSpectrum,
  'kinematics':          kinematics,
  // Mathematics
  'venn-diagram':        vennDiagram,
  'quadratic':           quadratic,
  'probability-tree':    probabilityTree,
  'matrix':              matrix,
  'normal-distribution': normalDistribution,
  // Economics
  'supply-demand':       supplyDemand,
  'gdp':                 gdp,
  'inflation':           inflation,
};

export function buildDiagram(concept: string | null): string | null {
  if (!concept) return null;
  const builder = BUILDERS[concept];
  if (!builder) return null;
  try {
    return builder();
  } catch (e) {
    console.error('[Diagram] build error for', concept, e);
    return null;
  }
}
