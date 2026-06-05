'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Video, VideoOff, PhoneOff, Mic, MicOff, Monitor } from 'lucide-react';
import { SessionEvent, AgentEventsEnum } from '@heygen/liveavatar-web-sdk';

// ── Whiteboard keyword map ────────────────────────────────────────────────────
// Keys = trigger words, value = which diagram to draw
const KEYWORD_MAP: Record<string, string> = {
  'linked list':    'linked-list',
  'linked-list':    'linked-list',
  'binary tree':    'binary-tree',
  'binary search':  'binary-search',
  'stack':          'stack',
  'queue':          'queue',
  'hash map':       'hashmap',
  'hash table':     'hashmap',
  'big o':          'big-o',
  'recursion':      'recursion',
  'graph':          'graph',
  'sorting':        'sorting',
  'bubble sort':    'sorting',
  'merge sort':     'sorting',
};

function detectDiagram(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [keyword, diagram] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword)) return diagram;
  }
  return null;
}

// ── Whiteboard diagrams (Canvas-drawn, animated) ──────────────────────────────
function drawLinkedList(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  const nodes = ['Head', '42', '17', '8', 'null'];
  const boxW = 64, boxH = 40, gap = 36;
  const totalW = nodes.length * boxW + (nodes.length - 1) * gap;
  let x = (w - totalW) / 2;
  const y = h / 2 - boxH / 2;

  nodes.forEach((label, i) => {
    const isNull = label === 'null';
    ctx.fillStyle = isNull ? '#f1f0e8' : '#E6F1FB';
    ctx.strokeStyle = isNull ? '#B4B2A9' : '#185FA5';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, boxW, boxH, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = isNull ? '#5F5E5A' : '#0C447C';
    ctx.font = '13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + boxW / 2, y + boxH / 2);

    if (i < nodes.length - 1) {
      const arrowX = x + boxW + 4;
      const arrowY = y + boxH / 2;
      ctx.strokeStyle = '#378ADD';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX + gap - 10, arrowY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(arrowX + gap - 10, arrowY - 5);
      ctx.lineTo(arrowX + gap - 2, arrowY);
      ctx.lineTo(arrowX + gap - 10, arrowY + 5);
      ctx.strokeStyle = '#185FA5';
      ctx.stroke();
    }
    x += boxW + gap;
  });

  ctx.fillStyle = '#0C447C';
  ctx.font = '12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Singly Linked List', w / 2, y - 20);
}

function drawStack(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  const items = ['TOP → 30', '20', '10', 'BOTTOM'];
  const boxW = 120, boxH = 36, x = w / 2 - boxW / 2;
  const colors = ['#E6F1FB', '#EAF3DE', '#FAEEDA', '#F1EFE8'];
  const textColors = ['#0C447C', '#27500A', '#633806', '#444441'];

  items.forEach((label, i) => {
    const y = 30 + i * (boxH + 4);
    ctx.fillStyle = colors[i];
    ctx.strokeStyle = '#B4B2A9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, boxW, boxH, 4);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = textColors[i];
    ctx.font = '12px system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(label, x + boxW / 2, y + boxH / 2);
  });
  ctx.fillStyle = '#444441';
  ctx.font = '12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Stack — LIFO', w / 2, h - 16);
}

function drawBigO(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  const complexities = [
    { label: 'O(1)', color: '#1D9E75', bar: 0.05 },
    { label: 'O(log n)', color: '#378ADD', bar: 0.15 },
    { label: 'O(n)', color: '#EF9F27', bar: 0.4 },
    { label: 'O(n log n)', color: '#D85A30', bar: 0.6 },
    { label: 'O(n²)', color: '#E24B4A', bar: 0.9 },
  ];
  const barH = 24, gap = 10, labelW = 80;
  complexities.forEach((c, i) => {
    const y = 20 + i * (barH + gap);
    const barW = (w - labelW - 40) * c.bar;
    ctx.fillStyle = '#F1EFE8';
    ctx.beginPath(); ctx.roundRect(labelW + 20, y, w - labelW - 40, barH, 4); ctx.fill();
    ctx.fillStyle = c.color;
    ctx.beginPath(); ctx.roundRect(labelW + 20, y, Math.max(barW, 8), barH, 4); ctx.fill();
    ctx.fillStyle = '#2C2C2A';
    ctx.font = '12px system-ui, sans-serif';
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText(c.label, labelW + 14, y + barH / 2);
  });
  ctx.fillStyle = '#444441'; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('Time Complexity', w / 2, h - 12);
}

const DIAGRAM_RENDERERS: Record<string, (ctx: CanvasRenderingContext2D, w: number, h: number) => void> = {
  'linked-list': drawLinkedList,
  'stack':       drawStack,
  'queue':       drawStack,
  'big-o':       drawBigO,
};

// ── Whiteboard component ──────────────────────────────────────────────────────
function Whiteboard({ activeDiagram }: { activeDiagram: string | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;

    if (!activeDiagram) {
      ctx.clearRect(0, 0, w, h);
      return;
    }
    const renderer = DIAGRAM_RENDERERS[activeDiagram];
    if (renderer) {
      renderer(ctx, w, h);
    } else {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#444441';
      ctx.font = '13px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`Diagram: ${activeDiagram}`, w / 2, h / 2);
    }
  }, [activeDiagram]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 pb-2 border-b mb-3">
        <Monitor size={15} className="text-blue-600" />
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">Whiteboard</span>
        {activeDiagram && (
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
            {activeDiagram}
          </span>
        )}
      </div>
      {activeDiagram ? (
        <canvas
          ref={canvasRef}
          width={320} height={180}
          className="w-full rounded-xl border border-zinc-100"
          style={{ background: '#fafaf8' }}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 min-h-[160px]">
          <p className="text-[11px] text-zinc-400 text-center px-4">
            Whiteboard activates automatically when the interviewer explains a technical concept
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main workspace ────────────────────────────────────────────────────────────
type SessionStatus = 'idle' | 'connecting' | 'connected' | 'error';

export default function MainWorkspace({
  contextId,
}: {
  contextId?: string; // pass Alex or Jordan context ID from parent
}) {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle');
  const [statusMsg, setStatusMsg]         = useState('Ready');
  const [isVideoOn, setIsVideoOn]         = useState(true);
  const [isMuted, setIsMuted]             = useState(false);
  const [caption, setCaption]             = useState('');
  const [activeDiagram, setActiveDiagram] = useState<string | null>(null);
  const [avatarSpeaking, setAvatarSpeaking] = useState(false);

  const videoRef    = useRef<HTMLVideoElement>(null);
  const sessionRef  = useRef<any>(null);
  const captionBuffer = useRef('');

  // Clear whiteboard when avatar stops speaking
  useEffect(() => {
    if (!avatarSpeaking) {
      const t = setTimeout(() => setActiveDiagram(null), 4000);
      return () => clearTimeout(t);
    }
  }, [avatarSpeaking]);

  const stopSession = useCallback(async () => {
    try { await sessionRef.current?.stop(); } catch (_) {}
    sessionRef.current = null;
    setSessionStatus('idle');
    setStatusMsg('Ready');
    setCaption('');
    setActiveDiagram(null);
    setAvatarSpeaking(false);
  }, []);

  useEffect(() => () => { stopSession(); }, [stopSession]);

  const startSession = useCallback(async () => {
    setSessionStatus('connecting');
    setStatusMsg('Connecting to LiveAvatar...');

    try {
      const { LiveAvatarSession } = await import('@heygen/liveavatar-web-sdk');

      // Get token — pass contextId to select Alex vs Jordan persona
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contextId }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || `Server error ${res.status}`);
      if (!body.token) throw new Error('No token received');

      const session = new LiveAvatarSession(body.token);
      sessionRef.current = session;

      // ── Stream ready → attach video ──────────────────────────────────────
      session.on(SessionEvent.SESSION_STREAM_READY, () => {
        setStatusMsg('Stream ready...');
        if (videoRef.current) {
          session.attach(videoRef.current);
          videoRef.current.play().catch(() => {
            setStatusMsg('Click the video to unmute');
          });
        }
        setSessionStatus('connected');
        setStatusMsg('Live');
      });

      // ── Avatar speaking state ────────────────────────────────────────────
      session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => {
        setAvatarSpeaking(true);
        captionBuffer.current = '';
        setCaption('');
      });

      session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => {
        setAvatarSpeaking(false);
        setTimeout(() => setCaption(''), 2000);
      });

      // ── AVATAR_TRANSCRIPTION → captions + whiteboard trigger ─────────────
      session.on(AgentEventsEnum.AVATAR_TRANSCRIPTION, (event: any) => {
        const text: string = event?.data?.text ?? event?.text ?? '';
        if (!text) return;

        // Accumulate for caption
        captionBuffer.current += ' ' + text;
        setCaption(captionBuffer.current.trim());

        // Check accumulated buffer for keywords → trigger whiteboard
        const diagram = detectDiagram(captionBuffer.current);
        if (diagram) setActiveDiagram(diagram);
      });

      // ── User speaking state ──────────────────────────────────────────────
      session.on(AgentEventsEnum.USER_SPEAK_STARTED, () => {
        setStatusMsg('Listening...');
      });
      session.on(AgentEventsEnum.USER_SPEAK_ENDED, () => {
        setStatusMsg('Live');
      });
      session.on(AgentEventsEnum.USER_TRANSCRIPTION, (event: any) => {
        // Optional: show what user said
        console.log('[User said]', event?.data?.text ?? event?.text);
      });

      // ── Start ────────────────────────────────────────────────────────────
      await session.start();
      setStatusMsg('Waiting for stream...');

      // Start voice chat — FULL mode auto-handles mic → STT → LLM → TTS
      await session.voiceChat.start({ defaultMuted: false });

    } catch (err: any) {
      console.error('[Session error]', err);
      setSessionStatus('error');
      setStatusMsg(err.message || 'Connection failed');
      sessionRef.current = null;
    }
  }, [contextId]);

  const toggleMute = useCallback(async () => {
    const vc = sessionRef.current?.voiceChat;
    if (!vc) return;
    if (isMuted) { await vc.track?.unmute(); }
    else         { await vc.track?.mute();   }
    setIsMuted(m => !m);
  }, [isMuted]);

  const isActive = sessionStatus === 'connected';

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">

      {/* Status bar */}
      <div className="flex items-center justify-between bg-white border rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full transition-colors ${
            isActive                           ? 'bg-emerald-500 animate-pulse' :
            sessionStatus === 'connecting'     ? 'bg-amber-400 animate-pulse'  :
            sessionStatus === 'error'          ? 'bg-red-500'                  : 'bg-zinc-300'
          }`} />
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{statusMsg}</span>
          {isActive && avatarSpeaking && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Jordan is speaking
            </span>
          )}
        </div>
        {(sessionStatus === 'idle' || sessionStatus === 'error') && (
          <button onClick={startSession}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all">
            Start Interview
          </button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-4">

        {/* Avatar video */}
        <div className="col-span-8 relative">
          <div className="bg-zinc-950 rounded-2xl overflow-hidden aspect-video relative border border-zinc-800 shadow-2xl">
            <video
              ref={videoRef}
              autoPlay playsInline
              className={`w-full h-full object-cover ${isVideoOn ? 'block' : 'invisible'}`}
              onClick={() => videoRef.current?.play().catch(() => {})}
            />

            {/* Placeholder */}
            {!isActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center">
                  <span className="text-5xl">🤖</span>
                </div>
                <p className="text-zinc-500 text-sm">
                  {sessionStatus === 'connecting' ? 'Connecting...' : 'Press Start Interview'}
                </p>
              </div>
            )}

            {/* Live captions */}
            {isActive && caption && (
              <div className="absolute bottom-16 left-4 right-4">
                <div className="bg-black/70 backdrop-blur-sm text-white text-sm rounded-xl px-4 py-2 text-center leading-relaxed">
                  {caption}
                </div>
              </div>
            )}

            {/* Controls */}
            {isActive && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10">
                <button onClick={toggleMute}
                  className={`p-2.5 rounded-xl transition-all ${isMuted ? 'bg-red-600 text-white' : 'text-white hover:bg-white/10'}`}>
                  {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                <button onClick={() => setIsVideoOn(v => !v)}
                  className="p-2.5 text-white hover:bg-white/10 rounded-xl">
                  {isVideoOn ? <Video size={16} /> : <VideoOff size={16} />}
                </button>
                <button onClick={stopSession}
                  className="p-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700">
                  <PhoneOff size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Whiteboard sidebar */}
        <div className="col-span-4">
          <div className="bg-white border rounded-2xl p-4 h-full shadow-sm">
            <Whiteboard activeDiagram={activeDiagram} />
          </div>
        </div>

      </div>
    </div>
  );
}