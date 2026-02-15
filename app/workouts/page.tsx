"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import UpgradeButton from "@/components/UpgradeButton"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function WorkoutsPage() {
  const [plan, setPlan] = useState<string>("free")
  const [selectedGoal, setSelectedGoal] = useState<string>("all")
  const router = useRouter()

  useEffect(() => {
    const getPlan = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user
      if (!user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single()

      if (profile) {
        setPlan(profile.plan)
      }
    }

    getPlan()
  }, [])

  const workouts = [
    {
      id: 1,
      title: "10 Min Office Quick Stretch",
      duration: "10 minutes",
      goal: "office",
      premium: false,
    },
    {
      id: 2,
      title: "30 Min Belly Fat Burner",
      duration: "30 minutes",
      goal: "belly",
      premium: true,
    },
    {
      id: 3,
      title: "40 Min Weight Loss Blast",
      duration: "40 minutes",
      goal: "weight",
      premium: true,
    },
    {
      id: 4,
      title: "35 Min Strength Builder",
      duration: "35 minutes",
      goal: "strength",
      premium: true,
    },
  ]

  return (
    <div className="min-h-screen p-10">

      {/* Goal Filter Buttons */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {["all", "office", "belly", "weight", "strength"].map((goal) => (
          <Button
            key={goal}
            variant={selectedGoal === goal ? "default" : "outline"}
            onClick={() => setSelectedGoal(goal)}
          >
            {goal.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* Workout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workouts
          .filter((item) =>
            selectedGoal === "all" ? true : item.goal === selectedGoal
          )
          .map((item) => {
            const isLocked = item.premium && plan !== "premium"

            return (
              <Card key={item.id} className="relative">
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <p>{item.duration}</p>
                </CardContent>

                <CardFooter>
                  {!isLocked ? (
                    <Button onClick={() => router.push(`/workouts/${item.id}`)}>
                      Start Workout
                    </Button>
                  ) : (
                    <UpgradeButton />
                  )}
                </CardFooter>

                {isLocked && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-xl">
                    <p className="font-bold text-lg">🔒 Premium Only</p>
                  </div>
                )}
              </Card>
            )
          })}
      </div>
    </div>
  )
}