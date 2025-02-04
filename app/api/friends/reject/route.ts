import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { query } from "@/lib/db"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { requestId } = await req.json()

  try {
    await query("UPDATE friend_requests SET status = 'rejected' WHERE id = $1 AND receiver_id = $2", [
      requestId,
      session.user.id,
    ])

    return NextResponse.json({ message: "Friend request rejected successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error rejecting friend request:", error)
    return NextResponse.json({ error: "An error occurred while rejecting the friend request" }, { status: 500 })
  }
}

