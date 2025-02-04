import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Users, Lock, Zap } from "lucide-react"
import type React from "react" // Added import for React

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">PrivetLine</h1>
          <div className="space-x-4">
            <Button variant="outline" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Welcome to PrivetLine</h2>
          <p className="text-xl text-gray-600 mb-8">Secure, fast, and easy-to-use messaging for everyone</p>
          <Button size="lg" asChild>
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<MessageCircle className="h-12 w-12 text-blue-500" />}
            title="Real-time Chat"
            description="Instant messaging with friends and groups"
          />
          <FeatureCard
            icon={<Users className="h-12 w-12 text-blue-500" />}
            title="Group Chats"
            description="Create and manage group conversations easily"
          />
          <FeatureCard
            icon={<Lock className="h-12 w-12 text-blue-500" />}
            title="Secure"
            description="End-to-end encryption for your privacy"
          />
          <FeatureCard
            icon={<Zap className="h-12 w-12 text-blue-500" />}
            title="Fast"
            description="Lightning-fast message delivery"
          />
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>&copy; 2023 PrivetLine. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center p-6">
        {icon}
        <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
        <p className="text-gray-600 text-center">{description}</p>
      </CardContent>
    </Card>
  )
}

