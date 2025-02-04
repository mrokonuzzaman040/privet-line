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

export function FriendRequestsManager() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])

  useEffect(() => {
    fetchFriendRequests()
  }, [])

  const fetchFriendRequests = async () => {
    try {
      const response = await fetch("/api/friends/requests")
      const data = await response.json()
      setFriendRequests(Array.isArray(data) ? data : [])
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
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold text-white mb-4">Friend Requests</h3>
      {Array.isArray(friendRequests) && friendRequests.length > 0 ? (
        friendRequests.map((request) => (
          <div key={request.id} className="flex items-center justify-between p-4 glass-effect rounded-lg">
            <div className="flex items-center space-x-3">
              <UserAvatar user={{ name: request.senderName, email: request.senderEmail }} />
              <div>
                <p className="font-medium text-white">{request.senderName}</p>
                <p className="text-sm text-gray-400">{request.senderEmail}</p>
              </div>
            </div>
            <div className="space-x-2">
              <Button onClick={() => handleAccept(request.id)} className="bg-green-500 hover:bg-green-600 text-white">
                Accept
              </Button>
              <Button
                onClick={() => handleReject(request.id)}
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black"
              >
                Reject
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No pending friend requests</p>
      )}
    </div>
  )
}

