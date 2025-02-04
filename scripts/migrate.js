const { sql } = require("@vercel/postgres")
const fs = require("fs").promises
const path = require("path")

async function runMigration() {
  try {
    // Ensure migrations table exists
    await sql`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Get all migration files
    const migrationsDir = path.join(__dirname, "..", "migrations")
    const migrationFiles = await fs.readdir(migrationsDir)

    // Get applied migrations
    const appliedMigrations = await sql`SELECT name FROM migrations`
    const appliedMigrationNames = appliedMigrations.rows.map((row) => row.name)

    // Sort migration files
    migrationFiles.sort()

    for (const file of migrationFiles) {
      if (file.endsWith(".sql")) {
        const migrationName = path.parse(file).name
        const migrationPath = path.join(migrationsDir, file)
        const migrationSQL = await fs.readFile(migrationPath, "utf8")

        if (!appliedMigrationNames.includes(migrationName)) {
          console.log(`Applying migration: ${migrationName}`)

          // Split the migration into up and down parts
          const [upMigration, downMigration] = migrationSQL.split("-- Down migration")

          // Apply up migration
          const statements = upMigration.split(";").filter((statement) => statement.trim() !== "")
          for (const statement of statements) {
            await sql.query(statement)
          }

          // Record the applied migration
          await sql`INSERT INTO migrations (name) VALUES (${migrationName})`

          console.log(`Migration applied: ${migrationName}`)
        }
      }
    }

    console.log("All migrations have been applied.")
  } catch (error) {
    console.error("Error running migration:", error)
    process.exit(1)
  }
}

runMigration()

