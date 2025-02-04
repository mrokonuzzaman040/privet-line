import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  name?: string | null
  email?: string | null
  image?: string | null
}

export function UserAvatar({ user }: { user: User }) {
  return (
    <Avatar>
      <AvatarImage src={user.image || undefined} alt={user.name || "User avatar"} />
      <AvatarFallback>{user.name?.[0] || user.email?.[0] || "U"}</AvatarFallback>
    </Avatar>
  )
}

