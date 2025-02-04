"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

interface User {
  id: string
  name: string
  email: string
  bio?: string
  avatarUrl?: string
}

export function ProfileForm({ user }: { user: User }) {
  const router = useRouter()
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "")
  const [error, setError] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, avatarUrl }),
      })

      if (res.ok) {
        router.push("/")
      } else {
        const data = await res.json()
        setError(data.error || "An error occurred while updating the profile")
      }
    } catch (error) {
      console.error("An unexpected error happened:", error)
      setError("An unexpected error occurred")
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setAvatarUrl(data.url)
      } else {
        const data = await res.json()
        setError(data.error || "An error occurred while uploading the image")
      }
    } catch (error) {
      console.error("An unexpected error happened:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
      </div>
      <div>
        <Label htmlFor="avatar">Avatar</Label>
        <div className="flex items-center space-x-4">
          {avatarUrl && (
            <Image
              src={avatarUrl || "/placeholder.svg"}
              alt="Avatar"
              width={100}
              height={100}
              className="rounded-full"
            />
          )}
          <Input id="avatar" type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
        </div>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" disabled={isUploading}>
        {isUploading ? "Uploading..." : "Update Profile"}
      </Button>
    </form>
  )
}

