// components/InterviewSession.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, LayoutDashboard, Play } from 'lucide-react';

export default function InterviewSession({ credentials }: { credentials: { apiKey: string, avatarId: string } }) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [statusText, setStatusText] = useState("Standing By");

  const avatarVideoRef = useRef<HTMLVideoElement | null>(null);
  const localCamVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Hooking up the real-time session streaming connection engine
  const startAvatarStreamingSession = async () => {
    setStatusText("Initializing secure RTC stream channels...");
    setIsSessionActive(true);

    try {
      /* 
         ===================================================================
         PLACEHOLDER INLINE FOR YOUR SERVICE ARCHITECTURE ROUTE:
         1. Make an API call to fetch a transient connection token.
         2. Initialize your SDK instance (HeyGen, Simli, etc.).
         3. Bind the returned remote WebRTC stream tracking node directly:
            avatarVideoRef.current.srcObject = remoteStreamAsset;
         ===================================================================
      */
      setStatusText("Connected to Live Video Session");
    } catch (error) {
      console.error("Failed to establish avatar stream pipeline:", error);
      setStatusText("Connection error. Check API credentials mapping.");
      setIsSessionActive(false);
    }
  };

  // Synchronize your local webcam window state tracking switches
  useEffect(() => {
    async function configureLocalCamera() {
      if (isSessionActive && isVideoMode) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: !isMuted });
          streamRef.current = stream;
          if (localCamVideoRef.current) localCamVideoRef.current.srcObject = stream;
        } catch (err) {
          console.error("Local camera access blocked:", err);
        }
      } else {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      }
    }
    configureLocalCamera();
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, [isSessionActive, isVideoMode, isMuted]);

  return (
    <div className="space-y-6">
      
      {/* Top Session Sub-header Bar */}
      <div className="bg-white border p-4 rounded-2xl flex flex-wrap justify-between items-center gap-4 shadow-sm">
        <div className="space-y-0.5 text-left">
          <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            Status: {statusText}
          </span>
          <h2 className="text-zinc-950 text-base font-black tracking-tight">Active Simulation Frame</h2>
        </div>
        
        {!isSessionActive && (
          <button 
            onClick={startAvatarStreamingSession}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-100"
          >
            <Play size={14} fill="currentColor" />
            Connect Live Avatar
          </button>
        )}
      </div>

      {/* Main Workspace Frame Viewport Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[460px]">
        
        {/* Left Side: Video Stream Console Window Element Container */}
        <div className="lg:col-span-8 bg-zinc-950 rounded-2xl border border-zinc-850 flex flex-col justify-between p-6 relative overflow-hidden shadow-xl">
          
          <div className="flex flex-col items-center justify-center flex-grow py-4 relative z-10">
            {isSessionActive ? (
              isVideoMode ? (
                /* ACTUAL LIVE STREAM OUTPUT LAYOUT WINDOW BOX */
                <div className="w-full max-w-xl aspect-video rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden relative shadow-2xl">
                  {/* The live video stream from your platform choice hooks right here */}
                  <video 
                    ref={avatarVideoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                    poster="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-white text-[10px] font-bold border border-white/5">
                    Target ID: {credentials.avatarId.slice(0, 10)}...
                  </div>
                </div>
              ) : (
                /* BACK-UP MINIMAL VOICE ONLY SIMULATION FALLBACK CONTAINER STATE[cite: 1] */
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-full flex items-center justify-center animate-pulse mx-auto">
                    <Mic size={24} />
                  </div>
                  <p className="text-zinc-400 text-xs font-semibold">Voice call active. Live stream layout minimized[cite: 1].</p>
                </div>
              )
            ) : (
              /* PRE-CONNECTION STANDBY HOVER BLOCK SCREEN VIEW */
              <div className="text-center text-zinc-500 text-xs font-medium py-20 max-w-xs space-y-3">
                <p>Avatar instance pipeline requires safe initial authorization connection checks.</p>
                <p className="text-[10px] text-zinc-600 bg-zinc-900 border border-zinc-800 rounded-lg p-2 font-mono">
                  Target Configured: Found Active Token Matrix Mapping variables.
                </p>
              </div>
            )}
          </div>

          {/* Picture-in-Picture Mini-frame Local Webcam Mirror Layer */}
          {isSessionActive && isVideoMode && (
            <div className="absolute bottom-20 right-6 w-36 aspect-video bg-zinc-900 border border-zinc-700/80 rounded-xl overflow-hidden shadow-2xl z-20">
              <video ref={localCamVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
              <div className="absolute bottom-1.5 left-1.5 bg-black/40 text-white text-[8px] font-bold px-1 rounded">You</div>
            </div>
          )}

          {/* Standard Media Interface Dashboard Controls Floating Tray Dock Dock */}
          <div className="flex justify-center items-center gap-3 pt-4 border-t border-zinc-900 relative z-10">
            <button 
              onClick={() => setIsMuted(!isMuted)} 
              disabled={!isSessionActive}
              className={`p-3 rounded-full border transition-all ${isMuted ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'}`}
            >
              {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            
            <button 
              onClick={() => setIsVideoMode(!isVideoMode)} 
              disabled={!isSessionActive}
              className={`p-3 rounded-full border transition-all ${isVideoMode ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'}`}
            >
              {isVideoMode ? <Video size={16} /> : <VideoOff size={16} />}
            </button>

            <button 
              onClick={() => { setIsSessionActive(false); setStatusText("Session Terminated"); }}
              className="p-3 rounded-full bg-red-600 border border-red-500 text-white hover:bg-red-700 transition-all ml-4"
            >
              <PhoneOff size={16} />
            </button>
          </div>

        </div>

        {/* Right Side: Interactive Technical Whiteboard Element Container[cite: 1] */}
        <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><Monitor size={14} /></div>
              <h3 className="text-zinc-950 font-black text-sm tracking-tight">Technical Canvas Panel</h3>
            </div>
            
            <div className="aspect-square w-full rounded-xl bg-zinc-50 border border-dashed border-zinc-200 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mb-2"><LayoutDashboard size={18} /></div>
              <span className="text-zinc-800 text-xs font-bold">Whiteboard Idle</span>
              <p className="text-zinc-400 text-[10px] font-medium max-w-[180px] mt-1">Live structural script traces populate canvas stroke nodes when questions invoke diagram references[cite: 1].</p>
            </div>
          </div>

          <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-[11px] font-medium text-zinc-500 leading-normal text-left">
            <strong className="text-zinc-900 font-bold block mb-0.5">Integration Note:</strong>
            Using a live WebRTC media pipeline means your app remains completely free from processing overhead during user responses[cite: 1].
          </div>
        </div>

      </div>
    </div>
  );
}