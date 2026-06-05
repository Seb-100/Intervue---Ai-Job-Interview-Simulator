'use client'

interface VoiceOrbProps {
  isSpeaking: boolean
  isListening: boolean
  isThinking: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export default function VoiceOrb({
  isSpeaking,
  isListening,
  isThinking,
  size = 'md',
  label,
}: VoiceOrbProps) {
  const sizes = {
    sm: { orb: 80, inner: 48 },
    md: { orb: 140, inner: 88 },
    lg: { orb: 200, inner: 130 },
  }

  const { orb, inner } = sizes[size]

  const orbColor = isSpeaking
    ? '#6366f1'
    : isListening
    ? '#10b981'
    : isThinking
    ? '#f59e0b'
    : '#475569'

  const glowColor = isSpeaking
    ? 'rgba(99,102,241,0.35)'
    : isListening
    ? 'rgba(16,185,129,0.35)'
    : isThinking
    ? 'rgba(245,158,11,0.25)'
    : 'rgba(71,85,105,0.15)'

  const statusLabel = isSpeaking
    ? 'Speaking...'
    : isListening
    ? 'Listening...'
    : isThinking
    ? 'Thinking...'
    : label || 'Ready'

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative flex items-center justify-center rounded-full transition-all duration-500"
        style={{
          width: orb,
          height: orb,
          background: `radial-gradient(circle at 40% 35%, ${orbColor}cc, ${orbColor}88)`,
          boxShadow: `0 0 ${isSpeaking || isListening ? 40 : 20}px ${glowColor}, 0 0 ${isSpeaking || isListening ? 80 : 40}px ${glowColor}`,
        }}
      >
        {/* Pulse rings when speaking or listening */}
        {(isSpeaking || isListening) && (
          <>
            <span
              className="absolute rounded-full animate-ping"
              style={{
                width: orb * 1.15,
                height: orb * 1.15,
                background: glowColor,
                animationDuration: '1.4s',
              }}
            />
            <span
              className="absolute rounded-full animate-ping"
              style={{
                width: orb * 1.3,
                height: orb * 1.3,
                background: glowColor,
                animationDuration: '1.4s',
                animationDelay: '0.5s',
              }}
            />
          </>
        )}

        {/* Inner orb with waveform bars */}
        <div
          className="relative rounded-full flex items-center justify-center gap-1 overflow-hidden"
          style={{
            width: inner,
            height: inner,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {isSpeaking || isListening ? (
            // Animated waveform bars
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: 3,
                  background: 'white',
                  height: inner * 0.35,
                  animation: `waveBar 0.7s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))
          ) : isThinking ? (
            // Thinking dots
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="rounded-full bg-white"
                  style={{
                    width: 6,
                    height: 6,
                    animation: 'bounce 1s infinite',
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          ) : (
            // Idle mic icon
            <svg width={inner * 0.38} height={inner * 0.38} viewBox="0 0 24 24" fill="white" opacity={0.7}>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z"/>
            </svg>
          )}
        </div>
      </div>

      {/* Status label */}
      <span className="text-sm font-medium text-slate-400">{statusLabel}</span>

      <style jsx>{`
        @keyframes waveBar {
          from { transform: scaleY(0.3); opacity: 0.6; }
          to   { transform: scaleY(1.0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
