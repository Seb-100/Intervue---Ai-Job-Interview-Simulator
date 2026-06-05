'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Video, VideoOff, PhoneOff, Mic, MicOff, ArrowLeft, Maximize2, Minimize2, Wifi } from 'lucide-react';
import { SessionEvent, AgentEventsEnum } from '@heygen/liveavatar-web-sdk';

type SessionStatus = 'idle' | 'connecting' | 'connected' | 'error';

// ─────────────────────────────────────────────────────────────────────────────
// SVG Renderer
// We inject SVG directly into a div — no iframe, no sandbox, no stripping.
// The SVG background rect is overridden to white via CSS.
// ─────────────────────────────────────────────────────────────────────────────
function SvgRenderer({ svg }: { svg: string }) {
  // Fix: replace any dark background rect the AI generated with white
  const patched = svg
    .replace(/fill=["']#0f0f14["']/g, 'fill="#ffffff"')
    .replace(/fill=["']#080810["']/g, 'fill="#ffffff"')
    .replace(/fill=["']#0a0a12["']/g, 'fill="#ffffff"')
    .replace(/fill=["']#111118["']/g, 'fill="#ffffff"')
    .replace(/fill=["']#1e293b["']/g, 'fill="#1e3a5f"')
    // Fix text colors that would be invisible on white
    .replace(/fill=["']#e2e8f0["']/g, 'fill="#1e293b"')
    .replace(/fill=["']#94a3b8["']/g, 'fill="#475569"')
    .replace(/fill=["']#64748b["']/g, 'fill="#334155"');

  return (
    <div
      className="w-full h-full"
      style={{
        background: '#ffffff',
        animation: 'wbFadeIn 0.4s ease forwards',
      }}
      dangerouslySetInnerHTML={{ __html: patched }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Whiteboard panel
// ─────────────────────────────────────────────────────────────────────────────
function WhiteboardPanel({
  svg,
  isVisible,
  isGenerating,
}: {
  svg: string | null;
  isVisible: boolean;
  isGenerating: boolean;
}) {
  return (
    <div
      className="h-full flex flex-col overflow-hidden shrink-0"
      style={{
        width: isVisible ? '42%' : '0%',
        minWidth: isVisible ? '360px' : '0px',
        opacity: isVisible ? 1 : 0,
        borderLeft: isVisible ? '1px solid #e2e8f0' : 'none',
        background: '#ffffff',
        transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1), min-width 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 shrink-0"
        style={{ borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
            Visual Board
          </span>
        </div>
        {isGenerating && (
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-[3px] h-4">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className="w-[3px] rounded-full bg-blue-400"
                  style={{
                    height: '100%',
                    animation: `wbWave 1s ease-in-out ${i * 0.15}s infinite alternate`,
                    transformOrigin: 'bottom',
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] text-zinc-400">Drawing visual...</span>
          </div>
        )}
      </div>

      {/* Canvas area */}
      <div className="flex-1 overflow-hidden flex flex-col p-3">
        {svg ? (
          <div className="flex-1 rounded-2xl overflow-hidden border border-zinc-100 shadow-sm">
            <SvgRenderer svg={svg} />
          </div>
        ) : isGenerating ? (
          /* Skeleton */
          <div className="flex-1 rounded-2xl border border-zinc-100 flex flex-col gap-4 p-6">
            <div className="flex gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex-1 h-20 rounded-xl bg-zinc-100"
                  style={{ animation: `wbSkeleton 1.4s ease-in-out ${i * 0.15}s infinite` }} />
              ))}
            </div>
            {[75, 55, 85, 45, 65].map((w, i) => (
              <div key={i} className="h-3 rounded-full bg-zinc-100"
                style={{ width: `${w}%`, animation: `wbSkeleton 1.4s ease-in-out ${i * 0.1}s infinite` }} />
            ))}
            <div className="flex gap-3 mt-2">
              {[1, 2].map(i => (
                <div key={i} className="flex-1 h-14 rounded-xl bg-zinc-100"
                  style={{ animation: `wbSkeleton 1.4s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="flex-1 rounded-2xl border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <p className="text-xs text-zinc-400 text-center leading-relaxed max-w-[160px]">
              Diagrams appear automatically when the interviewer explains a concept
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes wbWave {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
        @keyframes wbFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wbSkeleton {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// User camera PiP
// ─────────────────────────────────────────────────────────────────────────────
function UserPip({ stream }: { stream: MediaStream | null }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current && stream) ref.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="absolute bottom-24 right-5 w-32 aspect-video rounded-xl overflow-hidden shadow-2xl z-20"
      style={{ border: '1px solid rgba(255,255,255,0.12)', background: '#1a1a24' }}>
      {stream
        ? <video ref={ref} autoPlay muted playsInline className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center text-xl">👤</div>}
      <div className="absolute bottom-1 left-2 text-[9px]" style={{ color: 'rgba(255,255,255,0.5)' }}>You</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Session timer
// ─────────────────────────────────────────────────────────────────────────────
function SessionTimer({ active }: { active: boolean }) {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return <span className="font-mono text-xs tabular-nums" style={{ color: '#64748b' }}>{m}:{s}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function InterviewRoom({
  contextId,
  onBack,
}: {
  contextId?: string;
  onBack: () => void;
}) {
  const [sessionStatus, setSessionStatus]       = useState<SessionStatus>('idle');
  const [statusMsg, setStatusMsg]               = useState('Ready');
  const [isVideoOn, setIsVideoOn]               = useState(true);
  const [isMuted, setIsMuted]                   = useState(false);
  const [caption, setCaption]                   = useState('');
  const [avatarSpeaking, setAvatarSpeaking]     = useState(false);
  const [whiteboardSvg, setWhiteboardSvg]       = useState<string | null>(null);
  const [whiteboardVisible, setWhiteboardVisible] = useState(false);
  const [isGenerating, setIsGenerating]         = useState(false);
  const [userStream, setUserStream]             = useState<MediaStream | null>(null);
  const [isFullscreen, setIsFullscreen]         = useState(false);

  const videoRef       = useRef<HTMLVideoElement>(null);
  const sessionRef     = useRef<any>(null);
  const captionBuffer  = useRef('');
  const lastSentLength = useRef(0);
  const generateTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generatingRef  = useRef(false);

  // Reset hide timer each time a new SVG arrives — user gets full 10s to read it
  useEffect(() => {
    if (!whiteboardSvg) return;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setWhiteboardVisible(false);
      setTimeout(() => { setWhiteboardSvg(null); lastSentLength.current = 0; }, 600);
    }, 10000);
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [whiteboardSvg]);

  // ── cleanup ───────────────────────────────────────────────────────────────
  const stopSession = useCallback(async () => {
    if (generateTimer.current) clearTimeout(generateTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    try { await sessionRef.current?.stop(); } catch (_) {}
    sessionRef.current = null;
    userStream?.getTracks().forEach(t => t.stop());
    setUserStream(null);
    setSessionStatus('idle');
    setStatusMsg('Ready');
    setCaption('');
    setWhiteboardSvg(null);
    setWhiteboardVisible(false);
    setAvatarSpeaking(false);
    setIsGenerating(false);
  }, [userStream]);

  useEffect(() => () => { stopSession(); }, []);

  // ── generate visualization ────────────────────────────────────────────────
  const generateVisualization = useCallback(async (text: string) => {
    if (generatingRef.current) return;
    if (text.length < 30) return;
    if (text.length - lastSentLength.current < 30) return;

    lastSentLength.current = text.length;
    generatingRef.current = true;
    setIsGenerating(true);
    setWhiteboardVisible(true); // Open panel immediately → shows skeleton

    try {
      const res = await fetch('/api/whiteboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      if (data.svg) {
        setWhiteboardSvg(data.svg);
      } else {
        // NOT_VISUAL → close panel
        setWhiteboardVisible(false);
        setTimeout(() => setWhiteboardSvg(null), 500);
      }
    } catch (e) {
      console.error('[Whiteboard]', e);
      setWhiteboardVisible(false);
    } finally {
      setIsGenerating(false);
      generatingRef.current = false;
    }
  }, []);

  // ── start session ─────────────────────────────────────────────────────────
  const startSession = useCallback(async () => {
    setSessionStatus('connecting');
    setStatusMsg('Connecting...');

    try {
      const cam = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }).catch(() => null);
      if (cam) setUserStream(cam);

      const { LiveAvatarSession } = await import('@heygen/liveavatar-web-sdk');

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

      session.on(SessionEvent.SESSION_STREAM_READY, () => {
        if (videoRef.current) {
          session.attach(videoRef.current);
          videoRef.current.play().catch(() => {});
        }
        setSessionStatus('connected');
        setStatusMsg('Live');
      });

      session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => {
        setAvatarSpeaking(true);
        captionBuffer.current = '';
        lastSentLength.current = 0;
        generatingRef.current = false;
        setCaption('');
        if (hideTimer.current) clearTimeout(hideTimer.current);
      });

      session.on(AgentEventsEnum.AVATAR_TRANSCRIPTION, (event: any) => {
        const chunk: string = event?.data?.text ?? event?.text ?? '';
        if (!chunk) return;

        captionBuffer.current += ' ' + chunk;
        setCaption(captionBuffer.current.trim());

        const currentLen = captionBuffer.current.trim().length;

        // Fire immediately once 120+ chars AND 50+ new chars since last send
        if (currentLen >= 120 && currentLen - lastSentLength.current >= 50 && !generatingRef.current) {
          if (generateTimer.current) clearTimeout(generateTimer.current);
          generateVisualization(captionBuffer.current.trim());
          return;
        }

        // Fallback: 2s debounce on natural speech pause
        if (!generatingRef.current) {
          if (generateTimer.current) clearTimeout(generateTimer.current);
          generateTimer.current = setTimeout(() => {
            generateVisualization(captionBuffer.current.trim());
          }, 2000);
        }
      });

      session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => {
        setAvatarSpeaking(false);
        if (generateTimer.current) clearTimeout(generateTimer.current);

        // Final attempt — catches short answers
        generateVisualization(captionBuffer.current.trim());

        setTimeout(() => setCaption(''), 3000);

        // Hide 10s after speech ends (will be reset if SVG arrives later)
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => {
          setWhiteboardVisible(false);
          setTimeout(() => { setWhiteboardSvg(null); lastSentLength.current = 0; }, 600);
        }, 10000);
      });

      session.on(AgentEventsEnum.USER_SPEAK_STARTED, () => setStatusMsg('Listening...'));
      session.on(AgentEventsEnum.USER_SPEAK_ENDED,   () => setStatusMsg('Live'));

      await session.start();
      await session.voiceChat.start({ defaultMuted: false });

    } catch (err: any) {
      console.error('[Session error]', err);
      setSessionStatus('error');
      setStatusMsg(err.message || 'Connection failed');
      sessionRef.current = null;
    }
  }, [contextId, generateVisualization]);

  const toggleMute = useCallback(async () => {
    const vc = sessionRef.current?.voiceChat;
    if (!vc) return;
    isMuted ? await vc.track?.unmute() : await vc.track?.mute();
    setIsMuted(m => !m);
  }, [isMuted]);

  const isActive = sessionStatus === 'connected';

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: '#080810', fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0 z-30"
        style={{ background: 'rgba(8,8,16,0.92)', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>

        <div className="flex items-center gap-4">
          <button onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all hover:bg-white/5"
            style={{ color: '#64748b' }}>
            <ArrowLeft size={14} /> Back
          </button>

          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.08)' }} />

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full transition-colors ${
              isActive ? 'bg-emerald-400 animate-pulse' :
              sessionStatus === 'connecting' ? 'bg-amber-400 animate-pulse' :
              sessionStatus === 'error' ? 'bg-red-500' : 'bg-zinc-600'
            }`} />
            <span className="text-xs font-medium" style={{ color: isActive ? '#94a3b8' : '#64748b' }}>{statusMsg}</span>
          </div>

          {isActive && <SessionTimer active />}

          {isActive && avatarSpeaking && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(56,132,221,0.12)', border: '1px solid rgba(56,132,221,0.2)' }}>
              <div className="flex items-end gap-[3px] h-3.5">
                {[0,1,2].map(i => (
                  <div key={i} className="w-[3px] rounded-full bg-blue-400"
                    style={{ height: '100%', animation: `speakBar 0.7s ease-in-out ${i * 0.15}s infinite alternate`, transformOrigin: 'bottom' }} />
                ))}
              </div>
              <span className="text-[10px] font-medium text-blue-400">Jordan speaking</span>
            </div>
          )}

          {isActive && isGenerating && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <span className="text-[10px] font-medium" style={{ color: '#f59e0b' }}>✦ Drawing visual...</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-black tracking-tight" style={{ color: '#e2e8f0' }}>
            Inter<span className="text-blue-500 font-serif italic">vue</span>
            <span style={{ color: '#22c55e' }} className="font-serif italic">.ai</span>
          </span>
          <button onClick={() => setIsFullscreen(f => !f)}
            className="p-1.5 rounded-lg transition-all hover:bg-white/5"
            style={{ color: '#475569' }}>
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* ── Main area ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Avatar / video column */}
        <div className="flex-1 relative overflow-hidden" style={{ minWidth: 0 }}>

          {/* Idle overlay */}
          {!isActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-80 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(56,132,221,0.18) 0%, transparent 70%)', animation: 'orbPulse 4s ease-in-out infinite' }} />
              </div>
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(56,132,221,0.1)', border: '1px solid rgba(56,132,221,0.2)' }}>
                  <Video size={32} style={{ color: '#378ADD' }} />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold" style={{ color: '#e2e8f0' }}>Interview Room</h2>
                  <p className="text-sm" style={{ color: '#475569' }}>
                    {sessionStatus === 'connecting' ? 'Establishing connection...' :
                     sessionStatus === 'error' ? 'Connection failed — try again' :
                     'Your AI interviewer is ready'}
                  </p>
                </div>
                {(sessionStatus === 'idle' || sessionStatus === 'error') && (
                  <button onClick={startSession}
                    className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-medium text-white transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', boxShadow: '0 0 32px rgba(37,99,235,0.35)' }}>
                    <Mic size={16} /> Start Interview
                  </button>
                )}
                {sessionStatus === 'connecting' && (
                  <div className="flex items-center gap-2" style={{ color: '#64748b' }}>
                    <Wifi size={14} />
                    <span className="text-xs">Connecting to LiveAvatar...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Avatar video */}
          <video ref={videoRef} autoPlay playsInline
            className="w-full h-full object-cover"
            style={{ background: '#0a0a12', opacity: isActive ? 1 : 0, display: 'block', transition: 'opacity 0.5s ease' }}
          />

          {/* Captions */}
          {isActive && caption && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-20">
              <div className="px-5 py-3 rounded-2xl text-sm text-center leading-relaxed"
                style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(12px)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.06)' }}>
                {caption}
              </div>
            </div>
          )}

          {/* User PiP */}
          {isActive && <UserPip stream={userStream} />}

          {/* Controls */}
          {isActive && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
                style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)' }}>

                <button onClick={toggleMute}
                  className="flex items-center justify-center w-10 h-10 rounded-xl transition-all"
                  style={{ background: isMuted ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${isMuted ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
                  {isMuted ? <MicOff size={16} className="text-red-400" /> : <Mic size={16} style={{ color: '#94a3b8' }} />}
                </button>

                <button onClick={() => setIsVideoOn(v => !v)}
                  className="flex items-center justify-center w-10 h-10 rounded-xl transition-all"
                  style={{ background: !isVideoOn ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${!isVideoOn ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
                  {isVideoOn ? <Video size={16} style={{ color: '#94a3b8' }} /> : <VideoOff size={16} className="text-red-400" />}
                </button>

                <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

                <button onClick={stopSession}
                  className="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:scale-105"
                  style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <PhoneOff size={16} className="text-red-400" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Whiteboard panel */}
        <WhiteboardPanel
          svg={whiteboardSvg}
          isVisible={whiteboardVisible || isGenerating}
          isGenerating={isGenerating}
        />
      </div>

      <style>{`
        @keyframes orbPulse {
          0%,100% { transform: scale(1); opacity: 0.8; }
          50%      { transform: scale(1.1); opacity: 1; }
        }
        @keyframes speakBar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}