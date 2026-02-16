"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const router = useRouter()

  return (
    <div 
      className="min-h-screen relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/gym-background.jpg')" }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold text-white">
          Interactive Online Gym Platform
        </h1>

        <p className="text-white text-xl font-semibold">
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
    </div>
  )
}
