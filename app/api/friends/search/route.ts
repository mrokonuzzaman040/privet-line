import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { query } from "@/lib/db"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  try {
    const result = await query(
      `
      SELECT u.id, u.name, u.email, u.avatar_url,
        CASE
          WHEN f.id IS NOT NULL THEN 'friend'
          WHEN fr.id IS NOT NULL THEN 'pending'
          ELSE 'none'
        END as status
      FROM users u
      LEFT JOIN friends f ON (f.user_id = $1 AND f.friend_id = u.id) OR (f.user_id = u.id AND f.friend_id = $1)
      LEFT JOIN friend_requests fr ON fr.sender_id = $1 AND fr.receiver_id = u.id AND fr.status = 'pending'
      WHERE u.email = $2 AND u.id != $1
    `,
      [session.user.id, email],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error searching for user:", error)
    return NextResponse.json({ error: "An error occurred while searching for the user" }, { status: 500 })
  }
}

