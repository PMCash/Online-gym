"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false)

const handleUpgrade = async () => {
  try {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("You must be logged in.")
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

    if (!response.ok) {
      throw new Error("Failed to initialize payment")
    }

    const data = await response.json()

    if (data.link) {
      window.location.href = data.link
    } else {
      throw new Error("No payment link returned")
    }

  } catch (error) {
    console.error(error)
    alert("Payment initialization failed.")
  } finally {
    setLoading(false)
  }
}


  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="px-4 py-2 rounded-md"
    style={{ backgroundColor: "#000000", color: "#ffffff" }}
    >
      {loading ? "Processing..." : "Upgrade to Premium"}
    </button>
  )
}
