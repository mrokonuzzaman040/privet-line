import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { requestId } = await req.json();

  try {
    // Update friend request status
    await query(
      "UPDATE friend_requests SET status = 'accepted' WHERE id = $1 AND receiver_id = $2",
      [requestId, session.user.id]
    );

    // Add to friends table
    await query(
      "INSERT INTO friends (user_id, friend_id) SELECT sender_id, receiver_id FROM friend_requests WHERE id = $1",
      [requestId]
    );

    return NextResponse.json(
      { message: "Friend request accepted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return NextResponse.json(
      { error: "An error occurred while accepting the friend request" },
      { status: 500 }
    );
  }
}
