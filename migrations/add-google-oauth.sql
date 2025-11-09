-- Google OAuth Support for Users Table
-- Run this SQL in your PostgreSQL database

-- Add OAuth columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS avatar VARCHAR(500),
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- Create index for faster Google ID lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- Allow password_hash to be empty for OAuth users
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
