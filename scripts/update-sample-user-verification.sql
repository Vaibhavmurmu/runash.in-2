-- Update sample user to be verified
UPDATE users 
SET 
    email_verified = true,
    email_verified_at = NOW()
WHERE email = 'alex@runash.ai';

-- Insert some sample verification tokens for testing
INSERT INTO email_verification_tokens (user_id, email, token, token_type, expires_at) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    'alex@runash.ai',
    'verify_' || encode(gen_random_bytes(32), 'hex'),
    'email_verification',
    NOW() + INTERVAL '24 hours'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'newemail@runash.ai',
    'change_' || encode(gen_random_bytes(32), 'hex'),
    'email_change',
    NOW() + INTERVAL '24 hours'
) ON CONFLICT DO NOTHING;
