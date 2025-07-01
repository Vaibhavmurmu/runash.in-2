-- Check current table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add username column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'username') THEN
        ALTER TABLE users ADD COLUMN username VARCHAR(100) UNIQUE;
        CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    END IF;
    
    -- Add email_verified column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_verified') THEN
        ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;
        CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
    END IF;
    
    -- Add email_verified_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_verified_at') THEN
        ALTER TABLE users ADD COLUMN email_verified_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add pending_email column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'pending_email') THEN
        ALTER TABLE users ADD COLUMN pending_email VARCHAR(255);
    END IF;
    
    -- Add avatar_url column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar_url') THEN
        ALTER TABLE users ADD COLUMN avatar_url TEXT;
    END IF;
    
    -- Add bio column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'bio') THEN
        ALTER TABLE users ADD COLUMN bio TEXT;
    END IF;
    
    -- Add website column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'website') THEN
        ALTER TABLE users ADD COLUMN website VARCHAR(255);
    END IF;
    
    -- Add location column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'location') THEN
        ALTER TABLE users ADD COLUMN location VARCHAR(255);
    END IF;
END $$;

-- Update sample user with missing data
UPDATE users 
SET 
    username = 'alexj_streams',
    email_verified = true,
    email_verified_at = NOW(),
    bio = 'Tech enthusiast and live streamer passionate about AI and gaming. Building the future of interactive content.',
    website = 'https://alexjohnson.dev',
    location = 'San Francisco, CA'
WHERE email = 'alex@runash.ai' 
AND (username IS NULL OR email_verified IS NULL);
