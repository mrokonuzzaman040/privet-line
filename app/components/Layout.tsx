"use client"
import type React from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Sidebar } from "./Sidebar"
import { Button } from "@/components/ui/button"
import { FriendRequestsManager } from "./FriendRequestsManager"

export function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="glass-effect z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold neon-text">PrivetLine</h1>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/" className="text-white hover:text-blue-300 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/friends" className="text-white hover:text-blue-300 transition-colors">
                    Friends
                  </Link>
                </li>
                <li>
                  <Link href="/groups" className="text-white hover:text-blue-300 transition-colors">
                    Groups
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="text-white hover:text-blue-300 transition-colors">
                    Profile
                  </Link>
                </li>
                {session && (
                  <li>
                    <Button
                      variant="outline"
                      onClick={() => signOut()}
                      className="text-white border-white hover:bg-white hover:text-black transition-colors"
                    >
                      Sign Out
                    </Button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="w-full lg:w-3/4 glass-effect p-6 rounded-lg">{children}</div>
              <div className="w-full lg:w-1/4 glass-effect p-6 rounded-lg">
                <FriendRequestsManager />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

