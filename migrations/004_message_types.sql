-- Up migration
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS type VARCHAR(10) NOT NULL DEFAULT 'text',
ADD COLUMN IF NOT EXISTS file_url TEXT;

-- Down migration
ALTER TABLE messages
DROP COLUMN IF EXISTS file_url,
DROP COLUMN IF EXISTS type;

