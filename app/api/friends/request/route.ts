import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { query } from "@/lib/db"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { receiverId } = await req.json()

  try {
    await query("INSERT INTO friend_requests (sender_id, receiver_id) VALUES ($1, $2)", [session.user.id, receiverId])

    return NextResponse.json({ message: "Friend request sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error sending friend request:", error)
    return NextResponse.json({ error: "An error occurred while sending the friend request" }, { status: 500 })
  }
}

