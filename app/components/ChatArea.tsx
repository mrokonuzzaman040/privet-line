"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: Date
}

interface ChatAreaProps {
  recipientId: string
  isGroup?: boolean
}

export function ChatArea({ recipientId, isGroup = false }: ChatAreaProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fetch messages from API
    // This is a placeholder. Replace with actual API call.
    setMessages([
      { id: "1", content: "Hello!", senderId: session?.user?.id || "", createdAt: new Date() },
      { id: "2", content: "Hi there!", senderId: recipientId, createdAt: new Date() },
    ])
  }, [recipientId, session?.user?.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const sendMessage = () => {
    if (inputMessage.trim() === "") return

    // Send message to API
    // This is a placeholder. Replace with actual API call.
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      senderId: session?.user?.id || "",
      createdAt: new Date(),
    }

    setMessages([...messages, newMessage])
    setInputMessage("")
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex mb-4 ${message.senderId === session?.user?.id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.senderId === session?.user?.id ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 mr-2"
          />
          <Button onClick={sendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

