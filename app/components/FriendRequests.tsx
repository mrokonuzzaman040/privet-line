"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "./UserAvatar"

interface FriendRequest {
  id: string
  senderId: string
  senderName: string
  senderEmail: string
}

export function FriendRequests() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])

  useEffect(() => {
    fetchFriendRequests()
  }, [])

  const fetchFriendRequests = async () => {
    try {
      const response = await fetch("/api/friends/requests")
      const data = await response.json()
      setFriendRequests(data)
    } catch (error) {
      console.error("Error fetching friend requests:", error)
    }
  }

  const handleAccept = async (requestId: string) => {
    try {
      const response = await fetch(`/api/friends/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      })
      if (response.ok) {
        setFriendRequests(friendRequests.filter((request) => request.id !== requestId))
      }
    } catch (error) {
      console.error("Error accepting friend request:", error)
    }
  }

  const handleReject = async (requestId: string) => {
    try {
      const response = await fetch(`/api/friends/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      })
      if (response.ok) {
        setFriendRequests(friendRequests.filter((request) => request.id !== requestId))
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error)
    }
  }

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-2">Friend Requests</h3>
      {friendRequests.map((request) => (
        <div key={request.id} className="flex items-center justify-between mb-2 p-2 border rounded">
          <div className="flex items-center">
            <UserAvatar user={{ id: request.senderId, name: request.senderName, email: request.senderEmail }} />
            <div className="ml-2">
              <p className="font-medium">{request.senderName}</p>
              <p className="text-sm text-gray-500">{request.senderEmail}</p>
            </div>
          </div>
          <div>
            <Button onClick={() => handleAccept(request.id)} className="mr-2">
              Accept
            </Button>
            <Button onClick={() => handleReject(request.id)} variant="outline">
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

