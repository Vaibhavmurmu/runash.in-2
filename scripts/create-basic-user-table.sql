-- Create a basic users table that works with integer IDs
-- This will work regardless of the existing schema

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample user if it doesn't exist
INSERT INTO users (id, email, name) VALUES 
(1, 'alex@runash.ai', 'Alex Johnson')
ON CONFLICT (email) DO NOTHING;

-- If the table already exists with different structure, this will be ignored
-- The API will adapt to whatever structure exists
