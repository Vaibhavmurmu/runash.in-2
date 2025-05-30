"use client"

import { useState, useRef, useCallback } from "react"

export interface VoiceRecordingState {
  isRecording: boolean
  isProcessing: boolean
  audioLevel: number
  duration: number
  error: string | null
}

export function useVoiceRecording() {
  const [state, setState] = useState<VoiceRecordingState>({
    isRecording: false,
    isProcessing: false,
    audioLevel: 0,
    duration: 0,
    error: null,
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
    const normalizedLevel = Math.min(average / 128, 1)

    setState((prev) => ({ ...prev, audioLevel: normalizedLevel }))

    if (state.isRecording) {
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
    }
  }, [state.isRecording])

  const startRecording = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null, isProcessing: true }))

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      streamRef.current = stream

      // Set up audio analysis
      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      source.connect(analyserRef.current)

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      const audioChunks: Blob[] = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        // Here you would typically send the audio to a speech-to-text service
        console.log("Audio recorded:", audioBlob)
      }

      mediaRecorderRef.current.start()
      startTimeRef.current = Date.now()

      // Start duration tracking
      durationIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setState((prev) => ({ ...prev, duration: elapsed }))
      }, 1000)

      setState((prev) => ({
        ...prev,
        isRecording: true,
        isProcessing: false,
        duration: 0,
      }))

      updateAudioLevel()
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Failed to access microphone. Please check permissions.",
        isProcessing: false,
      }))
    }
  }, [updateAudioLevel])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop()

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      if (audioContextRef.current) {
        audioContextRef.current.close()
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }

      setState((prev) => ({
        ...prev,
        isRecording: false,
        audioLevel: 0,
        duration: 0,
      }))
    }
  }, [state.isRecording])

  return {
    ...state,
    startRecording,
    stopRecording,
  }
}
