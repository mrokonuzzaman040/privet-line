"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { UserAvatar } from "./UserAvatar"

interface Friend {
  id: string
  name: string
  email: string
  image?: string
}

export function FriendList({ searchTerm = "" }: { searchTerm: string }) {
  const [friends, setFriends] = useState<Friend[]>([])

  useEffect(() => {
    // Fetch friends from API
    // This is a placeholder. Replace with actual API call.
    setFriends([
      { id: "1", name: "John Doe", email: "john@example.com" },
      { id: "2", name: "Jane Smith", email: "jane@example.com" },
    ])
  }, [])

  const filteredFriends = friends.filter((friend) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      friend.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      friend.email.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-2">Friends</h3>
      {filteredFriends.map((friend) => (
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

