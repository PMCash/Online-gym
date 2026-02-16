"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Interactive Online Gym Platform
      </h1>

      <p className="text-gray-600 text-lg">
        Smart Workouts. Anywhere. Anytime.
      </p>

      <div className="flex gap-4">
        <Button onClick={() => router.push("/login")}>
          Login
        </Button>

        <Button variant="outline" onClick={() => router.push("/register")}>
          Register
        </Button>
      </div>
    </div>
  )
}
