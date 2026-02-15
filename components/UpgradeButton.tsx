"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("You must be logged in.")
      setLoading(false)
      return
    }

    const response = await fetch("/api/flutterwave/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        email: user.email,
      }),
    })

    const data = await response.json()

    if (data.link) {
      window.location.href = data.link
    } else {
      alert("Payment initialization failed")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="bg-black text-white px-6 py-3 rounded-md"
    >
      {loading ? "Processing..." : "Upgrade to Premium"}
    </button>
  )
}
