import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { Layout } from "../components/Layout"
import { FriendList } from "../components/FriendList"

export default async function FriendsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 neon-text">Friends</h1>
        <FriendList />
      </div>
    </Layout>
  )
}

