import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { query } from "@/lib/db"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await query(
      `
      SELECT fr.id, u.id as sender_id, u.name as sender_name, u.email as sender_email
      FROM friend_requests fr
      JOIN users u ON fr.sender_id = u.id
      WHERE fr.receiver_id = $1 AND fr.status = 'pending'
    `,
      [session.user.id],
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching friend requests:", error)
    return NextResponse.json({ error: "An error occurred while fetching friend requests" }, { status: 500 })
  }
}

