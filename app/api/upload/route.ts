import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { uploadImage } from "@/lib/cloudinary"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as Blob

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = buffer.toString("base64")
    const dataURI = `data:${file.type};base64,${base64}`

    const imageUrl = await uploadImage(dataURI)

    return NextResponse.json({ url: imageUrl }, { status: 200 })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "An error occurred while uploading the image" }, { status: 500 })
  }
}

