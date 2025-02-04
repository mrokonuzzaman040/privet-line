import { sql } from "@vercel/postgres"

export async function query(query: string, values: any[] = []) {
  try {
    const result = await sql.query(query, values)
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

