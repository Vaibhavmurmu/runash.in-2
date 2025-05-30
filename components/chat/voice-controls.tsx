"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, Volume2, VolumeX, Settings, Square } from "lucide-react"
import { useVoiceRecording } from "@/hooks/use-voice-recording"
import { SpeechRecognitionService } from "@/services/speech-recognition-service"
import { TextToSpeechService } from "@/services/text-to-speech-service"
import VoiceSettingsDialog from "./voice-settings-dialog"

interface VoiceControlsProps {
  onVoiceInput: (text: string) => void
  onSpeakResponse: (text: string) => void
  isEnabled: boolean
}

export default function VoiceControls({ onVoiceInput, onSpeakResponse, isEnabled }: VoiceControlsProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState("")
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 1,
    pitch: 1,
    volume: 0.8,
    autoSpeak: true,
    voice: null as SpeechSynthesisVoice | null,
  })

  const speechRecognitionRef = useRef<SpeechRecognitionService | null>(null)
  const ttsServiceRef = useRef<TextToSpeechService | null>(null)
  const { isRecording, audioLevel, duration, startRecording, stopRecording } = useVoiceRecording()

  useEffect(() => {
    speechRecognitionRef.current = new SpeechRecognitionService()
    ttsServiceRef.current = new TextToSpeechService()
  }, [])

  const handleStartListening = () => {
    if (!speechRecognitionRef.current?.isSupported()) {
      alert("Speech recognition is not supported in this browser")
      return
    }

    setIsListening(true)
    setInterimTranscript("")
    startRecording()

    speechRecognitionRef.current.startListening(
      (result) => {
        setInterimTranscript(result.transcript)

        if (result.isFinal && result.transcript.trim()) {
          onVoiceInput(result.transcript.trim())
          setInterimTranscript("")
          handleStopListening()
        }
      },
      (error) => {
        console.error("Speech recognition error:", error)
        handleStopListening()
      },
    )
  }

  const handleStopListening = () => {
    setIsListening(false)
    stopRecording()
    speechRecognitionRef.current?.stopListening()
    setInterimTranscript("")
  }

  const handleSpeakResponse = (text: string) => {
    if (!ttsServiceRef.current?.isSupported()) {
      alert("Text-to-speech is not supported in this browser")
      return
    }

    setIsSpeaking(true)
    ttsServiceRef.current.speak(
      text,
      voiceSettings,
      () => setIsSpeaking(false),
      (error) => {
        console.error("TTS error:", error)
        setIsSpeaking(false)
      },
    )
  }

  const handleStopSpeaking = () => {
    ttsServiceRef.current?.stop()
    setIsSpeaking(false)
  }

  useEffect(() => {
    if (voiceSettings.autoSpeak) {
      // This would be called when a new AI response is received
      // onSpeakResponse would trigger handleSpeakResponse
    }
  }, [voiceSettings.autoSpeak])

  if (!isEnabled) return null

  return (
    <div className="space-y-3">
      {/* Voice Activity Indicator */}
      {(isListening || interimTranscript) && (
        <Card className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isListening ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                {isListening ? "Listening..." : "Processing..."}
              </span>
              {isRecording && <span className="text-xs text-green-600 dark:text-green-400">{duration}s</span>}
            </div>

            {/* Audio Level Indicator */}
            {isRecording && (
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-4 rounded-full transition-all duration-100 ${
                      audioLevel > i * 0.2 ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {interimTranscript && (
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 italic">"{interimTranscript}"</p>
          )}
        </Card>
      )}

      {/* Voice Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Microphone Control */}
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="sm"
            onClick={isListening ? handleStopListening : handleStartListening}
            className={isListening ? "animate-pulse" : ""}
          >
            {isListening ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Voice
              </>
            )}
          </Button>

          {/* Speaker Control */}
          <Button
            variant={isSpeaking ? "destructive" : "outline"}
            size="sm"
            onClick={
              isSpeaking
                ? handleStopSpeaking
                : () => handleSpeakResponse("This is a test of the text to speech functionality.")
            }
            disabled={!ttsServiceRef.current?.isSupported()}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 mr-2" />
                Speak
              </>
            )}
          </Button>
        </div>

        {/* Settings */}
        <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Voice Settings Dialog */}
      {showSettings && (
        <VoiceSettingsDialog
          settings={voiceSettings}
          onSave={setVoiceSettings}
          onClose={() => setShowSettings(false)}
          ttsService={ttsServiceRef.current}
        />
      )}
    </div>
  )
}
