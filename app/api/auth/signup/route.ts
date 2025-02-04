import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql } from "@vercel/postgres"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Check if user already exists
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert the new user
    const result = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id, name, email
    `

    const newUser = result.rows[0]

    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 })
  } catch (error) {
    console.error("Error in sign-up:", error)
    return NextResponse.json({ error: "An error occurred during sign up" }, { status: 500 })
  }
}

