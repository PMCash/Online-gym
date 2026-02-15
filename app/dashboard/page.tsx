"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import UpgradeButton from "@/components/UpgradeButton"


export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string | null>(null)
  const [plan, setPlan] = useState<string>("free")

useEffect(() => {
  const checkUser = async () => {
    const { data } = await supabase.auth.getSession()

    if (!data.session) {
      router.push("/login")
      return
    }

    const user = data.session.user
    setEmail(user.email ?? null)

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, premium_expires_at")
      .eq("id", user.id)
      .single()

    if (profile) {
      if (profile.plan === "premium" && profile.premium_expires_at) {
        const now = new Date()
        const expiry = new Date(profile.premium_expires_at)

        if (expiry < now) {
          // 🔥 Downgrade user automatically
          await supabase
            .from("profiles")
            .update({
              plan: "free",
              premium_expires_at: null,
            })
            .eq("id", user.id)

          setPlan("free")
        } else {
          setPlan("premium")
        }
      } else {
        setPlan("free")
      }
    }

    setLoading(false)
  }

  checkUser()
}, [router])


  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking session...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">
        Welcome to Your Dashboard
      </h1>

      <p>
        Logged in as: <strong>{email}</strong>
      </p>

      <p>
        Current Plan:{" "}
        <span className="font-bold text-blue-600">
          {plan.toUpperCase()}
        </span>
      </p>

      {plan !== "premium" && <UpgradeButton />}

      <Button variant="destructive" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}
