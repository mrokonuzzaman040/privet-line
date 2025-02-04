-- Up migration
ALTER TABLE users
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_users_last_seen ON users(last_seen);

-- Down migration
DROP INDEX IF EXISTS idx_users_last_seen;
ALTER TABLE users
DROP COLUMN IF EXISTS last_seen;

