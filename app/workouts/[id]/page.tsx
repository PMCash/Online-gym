"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import UpgradeButton from "@/components/UpgradeButton"
import MusicPlayer from "@/components/MusicPlayer"


export default function WorkoutPlayerPage() {
  const { id } = useParams()
  const router = useRouter()

  const [plan, setPlan] = useState("free")
  const [loading, setLoading] = useState(true)

  // Temporary mock workouts (later from DB)
  const workouts = [
    {
      id: "1",
      title: "10 Min Office Fat Burn",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      premium: false,
    },
    {
      id: "2",
      title: "30 Min Belly Reduction Pro",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      premium: true,
    },
  ]

  const workout = workouts.find((w) => w.id === id)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/login")
        return
      }

      const user = data.session.user

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single()

      if (profile) {
        setPlan(profile.plan)
      }

      setLoading(false)
    }

    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading workout...
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Workout not found.
      </div>
    )
  }

  const isLocked = workout.premium && plan !== "premium"

  return (
    <div className="min-h-screen p-10 flex flex-col gap-6 items-center">
      <h1 className="text-3xl font-bold">{workout.title}</h1>

      {isLocked ? (
        <div className="text-center space-y-4">
          <p className="text-xl font-semibold">
            🔒 This workout is Premium only
          </p>
          <UpgradeButton />
        </div>
      ) : (
        <>
        <video
          controls
          className="w-full max-w-3xl rounded-xl shadow-lg"
        >
          <source src={workout.videoUrl} type="video/mp4" />
        </video>
        <MusicPlayer plan={plan} />
        </>
      )}

      <Button variant="outline" onClick={() => router.push("/workouts")}>
        Back to Workouts
      </Button>
    </div>
  )
}
