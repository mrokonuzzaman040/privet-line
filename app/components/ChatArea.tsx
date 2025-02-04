"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import io from "socket.io-client"

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

let socket: any

export function ChatArea({ recipientId, isGroup = false }: ChatAreaProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    socketInitializer()

    return () => {
      if (socket) socket.disconnect()
    }
  }, [])

  const socketInitializer = async () => {
    await fetch("/api/socket")
    socket = io()

    socket.on("connect", () => {
      console.log("connected")
    })

    socket.on("chat message", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg])
    })

    socket.on("typing", (data: { senderId: string }) => {
      if (data.senderId === recipientId) {
        setIsTyping(true)
      }
    })

    socket.on("stop typing", (data: { senderId: string }) => {
      if (data.senderId === recipientId) {
        setIsTyping(false)
      }
    })
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messagesEndRef])

  const sendMessage = () => {
    if (inputMessage.trim() === "") return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      senderId: session?.user?.id || "",
      createdAt: new Date(),
    }

    socket.emit("chat message", newMessage)
    setMessages([...messages, newMessage])
    setInputMessage("")
    socket.emit("stop typing", { senderId: session?.user?.id })
  }

  const handleTyping = () => {
    socket.emit("typing", { senderId: session?.user?.id })
  }

  const handleStopTyping = () => {
    socket.emit("stop typing", { senderId: session?.user?.id })
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
        {isTyping && (
          <div className="text-sm text-gray-500 italic">{isGroup ? "Someone is typing..." : "Typing..."}</div>
        )}
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
            onFocus={handleTyping}
            onBlur={handleStopTyping}
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

