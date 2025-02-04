"use client"
import type React from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Sidebar } from "./Sidebar"
import { Button } from "@/components/ui/button"

export function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">PrivetLine</h1>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-gray-900">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/friends" className="text-gray-600 hover:text-gray-900">
                    Friends
                  </Link>
                </li>
                <li>
                  <Link href="/groups" className="text-gray-600 hover:text-gray-900">
                    Groups
                  </Link>
                </li>
                {session && (
                  <li>
                    <Button variant="outline" onClick={() => signOut()}>
                      Sign Out
                    </Button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  )
}

