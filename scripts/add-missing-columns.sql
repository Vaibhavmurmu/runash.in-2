-- Add missing columns to users table if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS pending_email VARCHAR(255);

-- Create index for username if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Update sample user with username
UPDATE users 
SET username = 'alexj_streams'
WHERE email = 'alex@runash.ai' AND username IS NULL;
