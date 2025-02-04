import { getServerSession } from "next-auth/next"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { Layout } from "../../components/Layout"
import { ChatArea } from "../../components/ChatArea"

export default async function ChatPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <Layout>
      <ChatArea recipientId={params.id} />
    </Layout>
  )
}

