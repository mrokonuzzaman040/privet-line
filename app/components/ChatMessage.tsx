import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessageProps {
  message: string
  sender: string
  isSelf: boolean
}

export function ChatMessage({ message, sender, isSelf }: ChatMessageProps) {
  return (
    <div className={`flex ${isSelf ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex ${isSelf ? "flex-row-reverse" : "flex-row"} items-end`}>
        <Avatar className="w-8 h-8">
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${sender}`} />
          <AvatarFallback>{sender[0]}</AvatarFallback>
        </Avatar>
        <div className={`mx-2 py-3 px-4 rounded-lg ${isSelf ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
          {message}
        </div>
      </div>
    </div>
  )
}

