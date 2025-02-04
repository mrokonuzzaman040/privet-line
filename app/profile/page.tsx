import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { Layout } from "../components/Layout"
import { ProfileForm } from "../components/ProfileForm"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 neon-text">Your Profile</h1>
        <ProfileForm user={session.user} />
      </div>
    </Layout>
  )
}

