"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"

interface MusicPlayerProps {
  plan: string
}

export default function MusicPlayer({ plan }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  const tracks = [
    {
      id: 1,
      title: "Focus Flow (Free)",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      premium: false,
    },
    {
      id: 2,
      title: "Power Burn (Premium)",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      premium: true,
    },
  ]

  const availableTracks =
    plan === "premium"
      ? tracks
      : tracks.filter((t) => !t.premium)

  const track = availableTracks[0]

  const toggleMusic = () => {
    if (!audioRef.current) return

    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setPlaying(!playing)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="font-medium">
        🎵 Now Playing: {track.title}
      </p>

      <audio ref={audioRef} loop>
        <source src={track.url} type="audio/mp3" />
      </audio>

      <Button onClick={toggleMusic}>
        {playing ? "Pause Music" : "Play Music"}
      </Button>
    </div>
  )
}
