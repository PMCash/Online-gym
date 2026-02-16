import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const transaction_id = searchParams.get("transaction_id")
    const status = searchParams.get("status")

    // ✅ Handle cancelled immediately
    if (status === "cancelled") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=cancelled`
      )
    }

    if (!transaction_id) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=invalid`
      )
    }

    // ✅ Verify with Flutterwave
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    )

    const data = await response.json()
    console.log("FLW VERIFY RESPONSE:", data)

    if (
      data.status !== "success" ||
      data.data?.status !== "successful"
    ) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=failed`
      )
    }

    if (data.data.amount !== 5000) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=invalid`
      )
    }

    const userId = data.data.meta?.user_id

    if (!userId) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=invalid`
      )
    }

    // ✅ Set expiry (1 month)
    const expiryDate = new Date()
    expiryDate.setMonth(expiryDate.getMonth() + 1)

    // ✅ Check if profile exists safely
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle()

    if (!existingProfile) {
      // Create profile as premium immediately
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          role: "user",
          plan: "premium",
          premium_expires_at: expiryDate.toISOString(),
        })

      if (insertError) {
        console.log("PROFILE INSERT ERROR:", insertError)
      }
    } else {
      // Update existing profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          plan: "premium",
          premium_expires_at: expiryDate.toISOString(),
        })
        .eq("id", userId)

      if (updateError) {
        console.log("PROFILE UPDATE ERROR:", updateError)
      }
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success`
    )

  } catch (error) {
    console.log("VERIFY ROUTE ERROR:", error)

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=error`
    )
  }
}