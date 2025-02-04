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
      setFriends(data)
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
      } else {
        alert("Failed to send friend request.")
      }
    } catch (error) {
      console.error("Error sending friend request:", error)
    }
  }

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-2">Friends</h3>
      <div className="flex items-center mb-4">
        <Input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 mr-2"
        />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {searchResult && (
        <div className="mb-4 p-2 border rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserAvatar user={searchResult} />
              <div className="ml-2">
                <p className="font-medium">{searchResult.name}</p>
                <p className="text-sm text-gray-500">{searchResult.email}</p>
              </div>
            </div>
            {friends.some((friend) => friend.id === searchResult.id) ? (
              <Link href={`/chat/${searchResult.id}`}>
                <Button>Message</Button>
              </Link>
            ) : (
              <Button onClick={() => sendFriendRequest(searchResult.id)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Friend
              </Button>
            )}
          </div>
        </div>
      )}
      {friends.map((friend) => (
        <Link href={`/chat/${friend.id}`} key={friend.id}>
          <div className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
            <UserAvatar user={friend} />
            <div className="ml-2">
              <p className="font-medium">{friend.name}</p>
              <p className="text-sm text-gray-500">{friend.email}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

