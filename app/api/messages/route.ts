import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { query } from "@/lib/db"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const recipientId = searchParams.get("recipientId")

  if (!recipientId) {
    return NextResponse.json({ error: "Recipient ID is required" }, { status: 400 })
  }

  try {
    const result = await query(
      `SELECT * FROM messages 
      WHERE (sender_id = $1 AND recipient_id = $2) 
      OR (sender_id = $2 AND recipient_id = $1) 
      ORDER BY created_at ASC`,
      [session.user.id, recipientId],
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "An error occurred while fetching messages" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { content, recipientId, type, fileUrl } = await req.json()

  try {
    const result = await query(
      `INSERT INTO messages (sender_id, recipient_id, content, type, file_url) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [session.user.id, recipientId, content, type, fileUrl],
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error saving message:", error)
    return NextResponse.json({ error: "An error occurred while saving the message" }, { status: 500 })
  }
}

