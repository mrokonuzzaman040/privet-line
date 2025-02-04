import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { query } from "@/lib/db"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name, bio, avatarUrl } = await req.json()

  try {
    await query("UPDATE users SET name = $1, bio = $2, avatar_url = $3 WHERE id = $4", [
      name,
      bio,
      avatarUrl,
      session.user.id,
    ])

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "An error occurred while updating the profile" }, { status: 500 })
  }
}

