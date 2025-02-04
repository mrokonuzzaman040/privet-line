"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Paperclip, Mic, Video, Phone } from "lucide-react"
import io from "socket.io-client"
import { UserAvatar } from "./UserAvatar"

interface Message {
  id: string
  content: string
  senderId: string
  recipientId: string
  createdAt: Date
  type: "text" | "image" | "audio"
  fileUrl?: string
}

interface ChatAreaProps {
  recipientId: string
  recipientName: string
  isGroup?: boolean
}

let socket: any

export function ChatArea({ recipientId, recipientName, isGroup = false }: ChatAreaProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    socketInitializer()
    fetchMessages()

    return () => {
      if (socket) socket.disconnect()
    }
  }, [recipientId]) //Corrected dependency array

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

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?recipientId=${recipientId}`)
      const data = await response.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (content: string, type: "text" | "image" | "audio", fileUrl?: string) => {
    if (content.trim() === "" && type === "text") return

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: session?.user?.id || "",
      recipientId,
      createdAt: new Date(),
      type,
      fileUrl,
    }

    socket.emit("chat message", newMessage)
    setMessages([...messages, newMessage])
    setInputMessage("")
    socket.emit("stop typing", { senderId: session?.user?.id })

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      })
    } catch (error) {
      console.error("Error saving message:", error)
    }
  }

  const handleTyping = () => {
    socket.emit("typing", { senderId: session?.user?.id })
  }

  const handleStopTyping = () => {
    socket.emit("stop typing", { senderId: session?.user?.id })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        sendMessage(file.name, file.type.startsWith("image/") ? "image" : "audio", data.url)
      } else {
        console.error("Error uploading file")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    // Implement audio recording logic here
  }

  const stopRecording = () => {
    setIsRecording(false)
    // Implement stop recording and send audio message logic here
  }

  const handleAudioCall = () => {
    // Implement audio call logic
    console.log("Audio call initiated")
  }

  const handleVideoCall = () => {
    // Implement video call logic
    console.log("Video call initiated")
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-opacity-50 backdrop-filter backdrop-blur-lg">
        <h2 className="text-xl font-semibold text-white">{recipientName}</h2>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAudioCall}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleVideoCall}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <Video className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={`flex mb-4 ${message.senderId === (session?.user as any)?.id ? "justify-end" : "justify-start"}`}
          >
            <div className="flex items-end">
              {message.senderId !== (session?.user as any)?.id && <UserAvatar user={{ id: message.senderId } as any} />}
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.senderId === (session?.user as any)?.id
                    ? "bg-blue-500 text-white ml-2"
                    : "bg-gray-200 text-gray-800 mr-2"
                } glass-effect`}
              >
                {message.type === "text" && message.content}
                {message.type === "image" && (
                  <img
                    src={message.fileUrl || "/placeholder.svg"}
                    alt="Shared image"
                    className="max-w-full h-auto rounded"
                  />
                )}
                {message.type === "audio" && (
                  <audio controls src={message.fileUrl} className="max-w-full">
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-sm text-gray-400 italic">{isGroup ? "Someone is typing..." : "Typing..."}</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 bg-opacity-50 backdrop-filter backdrop-blur-lg">
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,audio/*"
          />
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant="ghost"
            size="icon"
            className={`text-white hover:bg-white hover:bg-opacity-20 ${isRecording ? "text-red-500" : ""}`}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage(inputMessage, "text")}
            onFocus={handleTyping}
            onBlur={handleStopTyping}
            className="flex-1 bg-transparent text-white placeholder-gray-400 border-gray-600 focus:border-blue-500"
          />
          <Button
            onClick={() => sendMessage(inputMessage, "text")}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

