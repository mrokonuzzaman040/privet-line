import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { Layout } from "./components/Layout"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <Layout>
      <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl font-bold">Welcome to PrivetLine, {session.user.name}!</h1>
      </div>
    </Layout>
  )
}

