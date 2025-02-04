"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { UserAvatar } from "./UserAvatar"

interface Group {
  id: string
  name: string
  members: { id: string; name: string }[]
}

export function GroupList({ searchTerm }: { searchTerm: string }) {
  const [groups, setGroups] = useState<Group[]>([])

  useEffect(() => {
    // Fetch groups from API
    // This is a placeholder. Replace with actual API call.
    setGroups([
      {
        id: "1",
        name: "Work Team",
        members: [
          { id: "1", name: "John" },
          { id: "2", name: "Jane" },
        ],
      },
      {
        id: "2",
        name: "Family",
        members: [
          { id: "1", name: "John" },
          { id: "3", name: "Mom" },
        ],
      },
    ])
  }, [])

  const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-2">Groups</h3>
      {filteredGroups.map((group) => (
        <Link href={`/group/${group.id}`} key={group.id}>
          <div className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
            <UserAvatar user={{ name: group.name }} />
            <div className="ml-2">
              <p className="font-medium">{group.name}</p>
              <p className="text-sm text-gray-500">{group.members.length} members</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

