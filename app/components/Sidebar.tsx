"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { UserAvatar } from "./UserAvatar"
import { FriendList } from "./FriendList"
import { GroupList } from "./GroupList"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search } from "lucide-react"

export function Sidebar() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState("")

  if (!session) return null

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      <div className="p-4 border-b">
        {session.user && <UserAvatar user={session.user} />}
        <h2 className="mt-2 font-semibold">{session.user?.name}</h2>
        <p className="text-sm text-gray-500">{session.user?.email}</p>
      </div>
      <div className="p-4 border-b">
        <div className="flex items-center mb-4">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 mr-2"
          />
          <Button size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button className="w-full mb-2">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Friend
        </Button>
        <Button className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Create Group
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <FriendList searchTerm={searchTerm} />
        <GroupList searchTerm={searchTerm} />
      </div>
    </div>
  )
}

