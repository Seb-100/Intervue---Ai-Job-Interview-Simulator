'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Video, VideoOff, PhoneOff, Mic, MicOff, ArrowLeft, Maximize2, Minimize2, Wifi, PanelRight } from 'lucide-react';
import { SessionEvent, AgentEventsEnum } from '@heygen/liveavatar-web-sdk';
import { conceptFromQuestion, buildDiagram } from '@/lib/diagrams';
import { useAuth } from '@/contexts/AuthContext';
import { addInterview, updateInterview, type InterviewType, type ExperienceLevel } from '@/lib/firestore';
import InterviewResults, { type SessionData } from './InterviewResults';

type SessionStatus = 'idle' | 'connecting' | 'connected' | 'error';

export interface InterviewConfig {
  title:         string;
  field:         string;
  type:          InterviewType;
  level:         ExperienceLevel;
  questionCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG Renderer — makes the GPT-generated SVG responsive inside the panel
// ─────────────────────────────────────────────────────────────────────────────
function SvgRenderer({ svg }: { svg: string }) {
  let patched = svg
    // Remove fixed dimensions — let viewBox handle scaling
    .replace(/(<svg\b[^>]*?)\s+width=["'][^"']*["']/, '$1')
    .replace(/(<svg\b[^>]*?)\s+height=["'][^"']*["']/, '$1')
    // Dark background → white
    .replace(/fill=["']#0f0f14["']/g, 'fill="#ffffff"')
    .replace(/fill=["']#080810["']/g, 'fill="#ffffff"')
    .replace(/fill=["']#0a0a12["']/g, 'fill="#ffffff"')
    .replace(/fill=["']#111118["']/g, 'fill="#ffffff"')
    .replace(/fill=["']#1e293b["']/g, 'fill="#1e3a5f"')
    // Near-white text → dark (invisible on white bg)
    .replace(/fill=["']#e2e8f0["']/g, 'fill="#1e293b"')
    .replace(/fill=["']#94a3b8["']/g, 'fill="#475569"')
    .replace(/fill=["']#64748b["']/g, 'fill="#334155"');

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#ffffff',
        animation: 'wbFadeIn 0.5s ease forwards',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
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
  lastQuestion,
}: {
  svg: string | null;
  isVisible: boolean;
  isGenerating: boolean;
  lastQuestion: string;
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
        transition:
          'width 0.5s cubic-bezier(0.4,0,0.2,1), min-width 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease',
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
      </div>

      {/* Question label — shows what triggered the diagram */}
      {lastQuestion && (
        <div
          className="px-4 py-2 text-[10px] text-zinc-400 truncate shrink-0"
          style={{ borderBottom: '1px solid #f8f9fa', background: '#fafbff' }}
        >
          <span className="text-zinc-300 mr-1">You asked:</span>
          {lastQuestion}
        </div>
      )}

      {/* Canvas */}
      <div
        className="flex-1 overflow-hidden flex flex-col p-3"
        style={{ minHeight: 0 }}
      >
        {svg ? (
          <div
            className="flex-1 rounded-2xl overflow-hidden border border-zinc-100 shadow-sm"
            style={{ minHeight: 0, position: 'relative' }}
          >
            <SvgRenderer svg={svg} />
          </div>
        ) : (
          /* Empty state */
          <div className="flex-1 rounded-2xl border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2563eb"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <p className="text-xs text-zinc-400 text-center leading-relaxed max-w-[180px]">
              Ask a technical question — the diagram appears automatically
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
          0%, 100% { opacity: 0.45; }
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
    <div
      className="absolute bottom-24 right-5 w-32 aspect-video rounded-xl overflow-hidden shadow-2xl z-20"
      style={{ border: '1px solid rgba(255,255,255,0.12)', background: '#1a1a24' }}
    >
      {stream ? (
        <video ref={ref} autoPlay muted playsInline className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
      )}
      <div className="absolute bottom-1 left-2 text-[9px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
        You
      </div>
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
  return (
    <span className="font-mono text-xs tabular-nums" style={{ color: '#64748b' }}>
      {m}:{s}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function InterviewRoom({
  contextId,
  config,
  onBack,
}: {
  contextId?: string;
  config?:    InterviewConfig;
  onBack:     () => void;
}) {
  const { user } = useAuth();

  const [sessionStatus, setSessionStatus]         = useState<SessionStatus>('idle');
  const [statusMsg, setStatusMsg]                 = useState('Ready');
  const [isVideoOn, setIsVideoOn]                 = useState(true);
  const [isMuted, setIsMuted]                     = useState(false);
  const [caption, setCaption]                     = useState('');
  const [avatarSpeaking, setAvatarSpeaking]       = useState(false);
  const [whiteboardSvg, setWhiteboardSvg]         = useState<string | null>(null);
  const [whiteboardVisible, setWhiteboardVisible] = useState(false);
  const [lastQuestion, setLastQuestion]           = useState('');
  const [userStream, setUserStream]               = useState<MediaStream | null>(null);
  const [isFullscreen, setIsFullscreen]           = useState(false);

  // Post-session results
  const [sessionData, setSessionData]             = useState<SessionData | null>(null);

  const videoRef            = useRef<HTMLVideoElement>(null);
  const sessionRef          = useRef<any>(null);
  const savedInterviewIdRef = useRef<string | null>(null);

  // Caption accumulator
  const captionBuffer = useRef('');

  // ── Session tracking ──────────────────────────────────────────────────────
  const sessionStartRef    = useRef<number>(0);        // Date.now() when connected
  const userAnswers        = useRef<string[]>([]);      // one entry per USER_SPEAK_ENDED
  const avatarQuestions    = useRef<string[]>([]);      // one entry per AVATAR_SPEAK_ENDED
  const currentUserBuffer  = useRef('');               // accumulates current user answer

  // ── User question capture ─────────────────────────────────────────────────
  const userQuestionBuffer = useRef('');
  const userQuestionRef    = useRef('');
  const userQuestionFresh  = useRef(false);

  // ── Auto-hide timer ───────────────────────────────────────────────────────
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset 30-second hide timer each time a new SVG arrives
  useEffect(() => {
    if (!whiteboardSvg) return;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setWhiteboardVisible(false);
      setTimeout(() => setWhiteboardSvg(null), 600);
    }, 30_000);
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [whiteboardSvg]);

  // ── Cleanup + save session ────────────────────────────────────────────────
  const stopSession = useCallback(async (showResults = true) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);

    // Calculate duration
    const durationSec = sessionStartRef.current
      ? Math.round((Date.now() - sessionStartRef.current) / 1000)
      : 0;

    // Save to Firestore if session was active
    if (user && sessionStartRef.current > 0) {
      try {
        const id = await addInterview(user.uid, {
          title:         config?.title         ?? 'Interview Session',
          field:         config?.field         ?? 'General',
          type:          config?.type          ?? 'mixed',
          level:         config?.level         ?? 'mid',
          questionCount: config?.questionCount ?? 0,
          score:         null,   // updated after results are shown
          duration:      durationSec,
          status:        'completed',
          contextId:     contextId ?? null,
          notes:         null,
        });
        savedInterviewIdRef.current = id;
      } catch (e) {
        console.error('[Firestore] Failed to save interview:', e);
      }
    }

    // Build session data for results panel
    if (showResults && sessionStartRef.current > 0) {
      setSessionData({
        config: {
          title:         config?.title ?? 'Interview Session',
          field:         config?.field ?? 'General',
          type:          config?.type  ?? 'mixed',
          level:         config?.level ?? 'mid',
          questionCount: config?.questionCount ?? 0,
        },
        durationSec,
        userAnswers:    [...userAnswers.current],
        avatarQuestions: [...avatarQuestions.current],
        startedAt:      new Date(sessionStartRef.current),
      });
    }

    // Stop HeyGen session and media
    try { await sessionRef.current?.stop(); } catch (_) {}
    sessionRef.current = null;
    userStream?.getTracks().forEach(t => t.stop());

    // Reset state
    setUserStream(null);
    setSessionStatus('idle');
    setStatusMsg('Ready');
    setCaption('');
    setWhiteboardSvg(null);
    setWhiteboardVisible(false);
    setAvatarSpeaking(false);
    sessionStartRef.current = 0;
    userAnswers.current     = [];
    avatarQuestions.current = [];
  }, [user, userStream, config, contextId]);

  // Keep a ref so the unmount cleanup always calls the latest stopSession
  const stopSessionRef = useRef(stopSession);
  useEffect(() => { stopSessionRef.current = stopSession; });
  useEffect(() => () => { stopSessionRef.current(false); }, []);

  const handleSaveScore = useCallback(async (score: number) => {
    if (!user || !savedInterviewIdRef.current) return;
    try {
      await updateInterview(user.uid, savedInterviewIdRef.current, { score });
    } catch (e) {
      console.error('[Firestore] Failed to update score:', e);
    }
  }, [user]);

  // ─────────────────────────────────────────────────────────────────────────
  // generateVisualization
  // Receives the USER's clean question, extracts the concept via keyword
  // matching, and renders the pre-built SVG template — no API call needed.
  // ─────────────────────────────────────────────────────────────────────────
  const generateVisualization = useCallback((userQuestion: string) => {
    if (!userQuestion || userQuestion.trim().length < 4) return;

    const concept = conceptFromQuestion(userQuestion);
    console.log('[Whiteboard] question:', userQuestion, '→ concept:', concept);

    if (!concept) {
      console.log('[Whiteboard] no matching concept — panel stays closed');
      return;
    }

    const svg = buildDiagram(concept);
    if (svg) {
      setWhiteboardSvg(svg);
      setLastQuestion(userQuestion);
      setWhiteboardVisible(true);
      console.log('[Whiteboard] rendered diagram for:', concept);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Start HeyGen session
  // ─────────────────────────────────────────────────────────────────────────
  const startSession = useCallback(async () => {
    setSessionStatus('connecting');
    setStatusMsg('Connecting...');

    try {
      const cam = await navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .catch(() => null);
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

      // ── Stream ready ────────────────────────────────────────────────────
      session.on(SessionEvent.SESSION_STREAM_READY, () => {
        if (videoRef.current) {
          session.attach(videoRef.current);
          videoRef.current.play().catch(() => {});
        }
        setSessionStatus('connected');
        setStatusMsg('Live');
        sessionStartRef.current = Date.now(); // ← start timing the session
      });

      // ── User speaking — capture their question + answer ─────────────────
      session.on(AgentEventsEnum.USER_SPEAK_STARTED, () => {
        setStatusMsg('Listening...');
        userQuestionBuffer.current  = '';
        currentUserBuffer.current   = '';
      });

      session.on(AgentEventsEnum.USER_TRANSCRIPTION, (event: any) => {
        const chunk: string = event?.data?.text ?? event?.text ?? '';
        if (chunk) {
          userQuestionBuffer.current += ' ' + chunk;
          currentUserBuffer.current  += ' ' + chunk;
        }
      });

      session.on(AgentEventsEnum.USER_SPEAK_ENDED, () => {
        setStatusMsg('Live');
        // Save to answers log (filter out very short utterances)
        const answer = currentUserBuffer.current.trim();
        if (answer.length > 15) userAnswers.current.push(answer);
        currentUserBuffer.current = '';

        const question = userQuestionBuffer.current.trim();
        if (question) {
          userQuestionRef.current  = question;
          userQuestionFresh.current = true;        // mark as ready to use
          console.log('[User asked]', question);
        }
      });

      // ── Avatar speaking — consume the captured question ─────────────────
      // This fires right when the avatar starts its response.
      // By now we have the user's clean question and can draw the diagram
      // while the avatar is delivering its verbal explanation.
      session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => {
        setAvatarSpeaking(true);
        captionBuffer.current = '';
        setCaption('');
        if (hideTimer.current) clearTimeout(hideTimer.current);

        if (userQuestionFresh.current && userQuestionRef.current) {
          userQuestionFresh.current = false;       // consume — don't fire twice
          generateVisualization(userQuestionRef.current);
        }
      });

      session.on(AgentEventsEnum.AVATAR_TRANSCRIPTION, (event: any) => {
        // Captions only — whiteboard is no longer triggered from here
        const chunk: string = event?.data?.text ?? event?.text ?? '';
        if (!chunk) return;
        captionBuffer.current += ' ' + chunk;
        setCaption(captionBuffer.current.trim());
      });

      session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => {
        setAvatarSpeaking(false);
        // Save avatar's full utterance as a "question" (filter short utterances)
        const avatarText = captionBuffer.current.trim();
        if (avatarText.length > 20) avatarQuestions.current.push(avatarText);
        setTimeout(() => setCaption(''), 3000);
      });

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
  // Indicates the avatar is generating/speaking (used for UI hints)
  const isGenerating = avatarSpeaking;

  // ─────────────────────────────────────────────────────────────────────────
  // Show results after session ends
  // ─────────────────────────────────────────────────────────────────────────
  if (sessionData) {
    return (
      <InterviewResults
        data={sessionData}
        onRetry={() => { setSessionData(null); }}
        onHome={() => { setSessionData(null); onBack(); }}
        onSaveScore={handleSaveScore}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{  fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}
    >
      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between px-5 py-3 shrink-0 z-30"
        style={{
          
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all hover:bg-white/5"
            style={{ color: '#1d2126' }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.08)' }} />

          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full transition-colors ${
                isActive
                  ? 'bg-emerald-400 animate-pulse'
                  : sessionStatus === 'connecting'
                  ? 'bg-amber-400 animate-pulse'
                  : sessionStatus === 'error'
                  ? 'bg-red-500'
                  : 'bg-zinc-600'
              }`}
            />
            <span
              className="text-xs font-medium"
              style={{ color: isActive ? '#94a3b8' : '#64748b' }}
            >
              {statusMsg}
            </span>
          </div>

          {isActive && <SessionTimer active />}

          {isActive && avatarSpeaking && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(56,132,221,0.12)',
                border: '1px solid rgba(56,132,221,0.2)',
              }}
            >
              <div className="flex items-end gap-[3px] h-3.5">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-[3px] rounded-full bg-blue-400"
                    style={{
                      height: '100%',
                      animation: `speakBar 0.7s ease-in-out ${i * 0.15}s infinite alternate`,
                      transformOrigin: 'bottom',
                    }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-medium text-blue-400">Jordan speaking</span>
            </div>
          )}

        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-black tracking-tight" style={{ color: '#131314' }}>
            Inter<span className="text-blue-500 font-serif italic">vue</span>
            <span style={{ color: '#22c55e' }} className="font-serif italic">.ai</span>
          </span>

          {/* Manual whiteboard toggle */}
          {isActive && (
            <button
              onClick={() => setWhiteboardVisible(v => !v)}
              title="Toggle whiteboard"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all hover:bg-white/5"
              style={{
                color: whiteboardVisible ? '#60a5fa' : '#475569',
                background: whiteboardVisible ? 'rgba(96,165,250,0.12)' : 'transparent',
                border: `1px solid ${
                  whiteboardVisible
                    ? 'rgba(96,165,250,0.25)'
                    : 'rgba(255,255,255,0.06)'
                }`,
              }}
            >
              <PanelRight size={13} />
              <span>Board</span>
              {isGenerating && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          )}

          <button
            onClick={() => setIsFullscreen(f => !f)}
            className="p-1.5 rounded-lg transition-all hover:bg-white/5"
            style={{ color: '#475569' }}
          >
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
            <div className="absolute inset-0 flex flex-col items-center ml-35 justify-center z-10">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-80 h-80 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(56,132,221,0.18) 0%, transparent 70%)',
                    animation: 'orbPulse 4s ease-in-out infinite',
                  }}
                />
              </div>
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div
                  className="w-40 h-20 rounded-2xl  flex items-center justify-center"
                  style={{
                    background: 'rgba(56,132,221,0.1)',
                    border: '1px solid rgba(56,132,221,0.2)',
                  }}
                >
                  <Video size={32} style={{ color: '#378ADD' }} className='mr-2'/>
                  <span className="text-2sm font-black tracking-tight" style={{ color: '#131314' }}> Inter</span>
                  <span className="text-blue-500 text-2sm font-serif italic">vue</span>
                  <span style={{ color: '#22c55e' }} className="font-serif text-2sm italic">.ai</span>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold" style={{ color: '#000000' }}>
                    Interview Room
                  </h2>
                  <p className="text-sm" style={{ color: '#475569' }}>
                    {sessionStatus === 'connecting'
                      ? 'Establishing connection...'
                      : sessionStatus === 'error'
                      ? 'Connection failed — try again'
                      : 'Your AI interviewer is ready'}
                  </p>
                </div>
                {(sessionStatus === 'idle' || sessionStatus === 'error') && (
                  <button
                    onClick={startSession}
                    className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-medium text-white transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      boxShadow: '0 0 32px rgba(37,99,235,0.35)',
                    }}
                  >
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
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            style={{
              background: '#0a0a12',
              opacity: isActive ? 1 : 0,
              display: 'block',
              transition: 'opacity 0.5s ease',
            }}
          />

          {/* Captions */}
          {isActive && caption && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-20">
              <div
                className="px-5 py-3 rounded-2xl text-sm text-center leading-relaxed"
                style={{
                  background: 'rgba(0,0,0,0.78)',
                  backdropFilter: 'blur(12px)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {caption}
              </div>
            </div>
          )}

          {/* User PiP */}
          {isActive && <UserPip stream={userStream} />}

          {/* Controls */}
          {isActive && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
                style={{
                  background: 'rgba(0,0,0,0.72)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <button
                  onClick={toggleMute}
                  className="flex items-center justify-center w-10 h-10 rounded-xl transition-all"
                  style={{
                    background: isMuted ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${isMuted ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {isMuted ? (
                    <MicOff size={16} className="text-red-400" />
                  ) : (
                    <Mic size={16} style={{ color: '#94a3b8' }} />
                  )}
                </button>

                <button
                  onClick={() => setIsVideoOn(v => !v)}
                  className="flex items-center justify-center w-10 h-10 rounded-xl transition-all"
                  style={{
                    background: !isVideoOn ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${!isVideoOn ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {isVideoOn ? (
                    <Video size={16} style={{ color: '#94a3b8' }} />
                  ) : (
                    <VideoOff size={16} className="text-red-400" />
                  )}
                </button>

                <div
                  style={{
                    width: 1,
                    height: 24,
                    background: 'rgba(255,255,255,0.08)',
                    margin: '0 4px',
                  }}
                />

                <button
                  onClick={() => stopSession()}
                  className="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:scale-105"
                  style={{
                    background: 'rgba(239,68,68,0.2)',
                    border: '1px solid rgba(239,68,68,0.3)',
                  }}
                >
                  <PhoneOff size={16} className="text-red-400" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Whiteboard panel */}
        <WhiteboardPanel
          svg={whiteboardSvg}
          isVisible={whiteboardVisible}
          isGenerating={isGenerating}
          lastQuestion={lastQuestion}
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
