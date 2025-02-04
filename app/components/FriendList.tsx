"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { UserAvatar } from "./UserAvatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { Search, UserPlus } from "lucide-react"

interface Friend {
  id: string
  name: string
  email: string
  image?: string
  status?: "friend" | "pending" | "none"
}

export function FriendList() {
  const { data: session } = useSession()
  const [friends, setFriends] = useState<Friend[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResult, setSearchResult] = useState<Friend | null>(null)

  useEffect(() => {
    fetchFriends()
  }, [])

  const fetchFriends = async () => {
    try {
      const response = await fetch("/api/friends")
      const data = await response.json()
      setFriends(data.friends)
    } catch (error) {
      console.error("Error fetching friends:", error)
    }
  }

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/friends/search?email=${searchTerm}`)
      const data = await response.json()
      setSearchResult(data)
    } catch (error) {
      console.error("Error searching for user:", error)
    }
  }

  const sendFriendRequest = async (userId: string) => {
    try {
      const response = await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: userId }),
      })
      if (response.ok) {
        alert("Friend request sent successfully!")
        setSearchResult((prev) => (prev ? { ...prev, status: "pending" } : null))
      } else {
        alert("Failed to send friend request.")
      }
    } catch (error) {
      console.error("Error sending friend request:", error)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-2xl font-semibold text-white mb-4">Friends</h3>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder-gray-400 border-gray-600 focus:border-blue-500"
        />
        <Button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600 text-white">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {searchResult && (
        <div className="mb-4 p-4 border border-gray-600 rounded-lg glass-effect">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <UserAvatar user={searchResult} />
              <div>
                <p className="font-medium text-white">{searchResult.name}</p>
                <p className="text-sm text-gray-400">{searchResult.email}</p>
              </div>
            </div>
            {searchResult.status === "friend" ? (
              <Link href={`/chat/${searchResult.id}`}>
                <Button className="bg-green-500 hover:bg-green-600 text-white">Message</Button>
              </Link>
            ) : searchResult.status === "pending" ? (
              <Button disabled className="bg-gray-500 text-white cursor-not-allowed">
                Pending
              </Button>
            ) : (
              <Button
                onClick={() => sendFriendRequest(searchResult.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Friend
              </Button>
            )}
          </div>
        </div>
      )}
      <div className="space-y-2">
        {friends.map((friend) => (
          <Link href={`/chat/${friend.id}`} key={friend.id}>
            <div className="flex items-center p-3 hover:bg-white hover:bg-opacity-10 rounded-lg cursor-pointer transition-colors duration-200">
              <UserAvatar user={friend} />
              <div className="ml-3">
                <p className="font-medium text-white">{friend.name}</p>
                <p className="text-sm text-gray-400">{friend.email}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

