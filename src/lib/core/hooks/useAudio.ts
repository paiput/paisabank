"use client"

import { useRef, useEffect, useCallback } from "react"

interface UseSuccessAudioOptions {
  /** Path to the audio file to preload and use for success sounds. Defaults to '/audio/payment-succesfull.mp3' */
  audioPath?: string
  /** Volume level between 0 and 1. Defaults to 0.7 */
  volume?: number
  /** Whether audio functionality is enabled. Defaults to true */
  enabled?: boolean
}

export function useAudio(options: UseSuccessAudioOptions = {}) {
  const {
    audioPath = "/audio/payment-succesfull.mp3",
    volume = 0.7,
    enabled = true,
  } = options

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Preload audio on hook initialization
  useEffect(() => {
    if (!enabled) return

    try {
      audioRef.current = new Audio(audioPath)
      audioRef.current.preload = "auto"
      audioRef.current.volume = volume
    } catch (error) {
      console.log("Could not preload audio:", error)
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [audioPath, volume, enabled])

  const playSuccessSound = useCallback(() => {
    if (!enabled) return

    try {
      if (audioRef.current) {
        // Reset audio to beginning and play
        audioRef.current.currentTime = 0
        audioRef.current.play().catch((error) => {
          console.log("Could not play success sound:", error)
        })
      } else {
        // Fallback: create new audio element if preload failed
        const audio = new Audio(audioPath)
        audio.volume = volume
        audio.play().catch((error) => {
          console.log("Could not play fallback success sound:", error)
        })
      }
    } catch (error) {
      console.log("Could not play audio:", error)
    }
  }, [enabled, audioPath, volume])

  // Generic play audio function for custom audio files
  const playAudio = useCallback(
    (customAudioPath: string, customVolume: number = volume) => {
      if (!enabled) return

      try {
        const audio = new Audio(customAudioPath)
        audio.volume = customVolume
        audio.play().catch((error) => {
          console.log(
            `Could not play custom audio (${customAudioPath}):`,
            error,
          )
        })
      } catch (error) {
        console.log(
          `Could not create audio element for ${customAudioPath}:`,
          error,
        )
      }
    },
    [enabled, volume],
  )

  return {
    playSuccessSound,
    playAudio,
    isEnabled: enabled,
  }
}
