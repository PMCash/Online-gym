"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function UpgradePage() {
  const router = useRouter()

  const handlePayment = async () => {
    // Temporary test redirect
    alert("Flutterwave integration coming next")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Upgrade to Premium</h1>

      <p className="text-gray-600 text-center max-w-md">
        Unlock all workouts, full music library,
        and access to future 3D trainers.
      </p>

      <Button onClick={handlePayment}>
        Pay ₦5,000 Monthly
      </Button>

      <Button variant="outline" onClick={() => router.back()}>
        Go Back
      </Button>
    </div>
  )
}
