const { sql } = require("@vercel/postgres")
const fs = require("fs").promises
const path = require("path")
require('dotenv').config();
console.log("POSTGRES_URL:", process.env.POSTGRES_URL);
async function runMigration() {
  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, "..", "migrations", "001_initial_schema.sql")
    const migrationSQL = await fs.readFile(migrationPath, "utf8")

    // Split the SQL into individual statements
    const statements = migrationSQL.split(";").filter((statement) => statement.trim() !== "")

    // Execute each statement
    for (const statement of statements) {
      await sql.query(statement)
    }

    console.log("Migration completed successfully")
  } catch (error) {
    console.error("Error running migration:", error)
    process.exit(1)
  }
}

runMigration()

