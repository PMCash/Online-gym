import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
console.log("VERIFY ROUTE HIT") // Debugging log
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const transaction_id = searchParams.get("transaction_id")

  if (!transaction_id) {
    return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 })
  }

  const response = await fetch(
    `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
    {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      },
    }
  )

  const data = await response.json()

  if (
    data.status === "success" &&
    data.data.status === "successful"
  ) {
    const userId = data.data.meta?.user_id

if (!userId) {
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=invalid`
  )
}

    const expiryDate = new Date()
    expiryDate.setMonth(expiryDate.getMonth() + 1)
    
    if (data.data.amount !== 5000) {
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=invalid`
  )
}
console.log("FLW RESPONSE:", data) // Debugging log

// Ensure profile exists
const { data: existingProfile } = await supabase
  .from("profiles")
  .select("id")
  .eq("id", userId)
  .single()

if (!existingProfile) {
  await supabase.from("profiles").insert({
    id: userId,
    role: "user",
    plan: "free",
  })
}

const { data: updateData, error: updateError } = await supabase
  .from("profiles")
  .update({
    plan: "premium",
    premium_expires_at: expiryDate.toISOString(),
  })
  .eq("id", userId)

console.log("UPDATE RESULT:", updateData)
console.log("UPDATE ERROR:", updateError)


    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
    )
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=failed`
  )
}
