import Link from "next/link"
import { MessageCircle, Users, Lock, Zap } from "lucide-react"
import type React from "react"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <header className="container mx-auto px-4 py-8 relative z-10">
        <nav className="flex justify-between items-center">
          <h1 className="text-3xl font-bold neon-text">PrivetLine</h1>
          <div className="space-x-4">
            <Link
              href="/auth/signin"
              className="px-4 py-2 glass-effect text-white rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 relative z-10">
        <section className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 neon-text">Welcome to the Future of Communication</h2>
          <p className="text-xl text-gray-300 mb-8">
            Secure, lightning-fast, and intuitive messaging for the Web 3.0 era
          </p>
          <Link
            href="/auth/signup"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            Get Started
          </Link>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<MessageCircle className="h-12 w-12 text-blue-400" />}
            title="Real-time Chat"
            description="Instant messaging with friends and groups"
          />
          <FeatureCard
            icon={<Users className="h-12 w-12 text-blue-400" />}
            title="Group Chats"
            description="Create and manage group conversations easily"
          />
          <FeatureCard
            icon={<Lock className="h-12 w-12 text-blue-400" />}
            title="Secure"
            description="End-to-end encryption for your privacy"
          />
          <FeatureCard
            icon={<Zap className="h-12 w-12 text-blue-400" />}
            title="Fast"
            description="Lightning-fast message delivery"
          />
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-400 relative z-10">
        <p>&copy; 2023 PrivetLine. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-effect p-6 rounded-lg">
      <div className="flex flex-col items-center">
        {icon}
        <h3 className="text-xl font-semibold mt-4 mb-2 neon-text">{title}</h3>
        <p className="text-gray-300 text-center">{description}</p>
      </div>
    </div>
  )
}

