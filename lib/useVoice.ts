'use client'

import { useCallback, useRef, useState } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */
interface UseVoiceOptions {
  onTranscript: (text: string) => void
  onSpeakEnd?: () => void
}

export function useVoice({ onTranscript, onSpeakEnd }: UseVoiceOptions) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isThinking, setIsThinking] = useState(false)

  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const transcriptBuffer = useRef('')

  // ── Text-to-Speech ─────────────────────────────────────────────────────────
  const speak = useCallback(async (text: string, voice = 'nova') => {
    if (!text.trim()) return

    // Stop any ongoing audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    setIsSpeaking(true)
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      })

      if (!res.ok) throw new Error('TTS failed')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio

      audio.onended = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(url)
        audioRef.current = null
        onSpeakEnd?.()
      }

      audio.onerror = () => {
        setIsSpeaking(false)
        audioRef.current = null
      }

      await audio.play()
    } catch (err) {
      console.error('Speak error:', err)
      setIsSpeaking(false)
    }
  }, [onSpeakEnd])

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsSpeaking(false)
  }, [])

  // ── Speech-to-Text ─────────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    const w = window as any
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition

    if (!SR) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
      return
    }

    if (recognitionRef.current) {
      (recognitionRef.current as any).stop()
    }

    const recognition = new SR()
    recognitionRef.current = recognition
    transcriptBuffer.current = ''

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event: any) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += t
        } else {
          interim += t
        }
      }

      if (final) {
        transcriptBuffer.current += final
      }

      // Auto-stop after 2s of silence
      if (silenceTimer.current) clearTimeout(silenceTimer.current)
      silenceTimer.current = setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop()
        }
      }, 2000)
    }

    recognition.onend = () => {
      setIsListening(false)
      if (silenceTimer.current) clearTimeout(silenceTimer.current)
      const text = transcriptBuffer.current.trim()
      if (text) {
        onTranscript(text)
      }
      transcriptBuffer.current = ''
    }

    recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('Speech recognition error:', event.error)
      }
      setIsListening(false)
    }

    recognition.start()
  }, [onTranscript])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if (silenceTimer.current) clearTimeout(silenceTimer.current)
    setIsListening(false)
  }, [])

  return {
    isListening,
    isSpeaking,
    isThinking,
    setIsThinking,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
  }
}
