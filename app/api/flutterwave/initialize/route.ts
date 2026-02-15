import { NextResponse } from "next/server"


export async function POST(req: Request) {
  const { user_id, email } = await req.json()
  
  if (!user_id || !email) {
  return NextResponse.json({ error: "Missing user data" }, { status: 400 })
}

  const response = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: `gym_${Date.now()}`,
      amount: 5000,
      currency: "NGN",
      redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/flutterwave/verify`,
      customer: {
        email,
      },
      meta: {
        user_id,
      },
      customizations: {
        title: "Interactive Gym Premium",
        description: "Premium Workout Access",
      },
    }),
  })

  const data = await response.json()

  return NextResponse.json({ link: data.data.link })
}
