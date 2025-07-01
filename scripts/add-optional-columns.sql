-- Add optional columns to existing users table
-- This script is safe to run multiple times

DO $$ 
BEGIN
    -- Add columns one by one, ignoring errors if they already exist
    BEGIN
        ALTER TABLE users ADD COLUMN username VARCHAR(100);
    EXCEPTION WHEN duplicate_column THEN
        -- Column already exists, ignore
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN avatar_url TEXT;
    EXCEPTION WHEN duplicate_column THEN
        -- Column already exists, ignore
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN bio TEXT;
    EXCEPTION WHEN duplicate_column THEN
        -- Column already exists, ignore
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN website VARCHAR(255);
    EXCEPTION WHEN duplicate_column THEN
        -- Column already exists, ignore
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN location VARCHAR(255);
    EXCEPTION WHEN duplicate_column THEN
        -- Column already exists, ignore
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;
    EXCEPTION WHEN duplicate_column THEN
        -- Column already exists, ignore
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN email_verified_at TIMESTAMP WITH TIME ZONE;
    EXCEPTION WHEN duplicate_column THEN
        -- Column already exists, ignore
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN pending_email VARCHAR(255);
    EXCEPTION WHEN duplicate_column THEN
        -- Column already exists, ignore
    END;
    
    -- Update sample user with additional data
    UPDATE users 
    SET 
        username = 'alexj_streams',
        email_verified = true,
        email_verified_at = NOW(),
        bio = 'Tech enthusiast and live streamer passionate about AI and gaming.',
        website = 'https://alexjohnson.dev',
        location = 'San Francisco, CA'
    WHERE id = 1 AND email = 'alex@runash.ai';
    
END $$;
