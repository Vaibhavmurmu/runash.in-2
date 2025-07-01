-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    website VARCHAR(255),
    location VARCHAR(255),
    email_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    pending_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'system',
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'America/Los_Angeles',
    compact_mode BOOLEAN DEFAULT false,
    show_sidebar_labels BOOLEAN DEFAULT true,
    hour_format_24 BOOLEAN DEFAULT false,
    reduced_motion BOOLEAN DEFAULT false,
    high_contrast BOOLEAN DEFAULT false,
    large_text BOOLEAN DEFAULT false,
    screen_reader_support BOOLEAN DEFAULT false,
    auto_save BOOLEAN DEFAULT true,
    preload_content BOOLEAN DEFAULT true,
    background_sync BOOLEAN DEFAULT true,
    data_usage VARCHAR(20) DEFAULT 'balanced',
    analytics_tracking BOOLEAN DEFAULT true,
    crash_reports BOOLEAN DEFAULT true,
    personalized_recommendations BOOLEAN DEFAULT true,
    default_video_quality VARCHAR(10) DEFAULT '1080p',
    audio_quality VARCHAR(20) DEFAULT 'high',
    auto_adjust_quality BOOLEAN DEFAULT true,
    hardware_acceleration BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_notifications table
CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_stream_start BOOLEAN DEFAULT true,
    email_new_follower BOOLEAN DEFAULT true,
    email_donations BOOLEAN DEFAULT true,
    email_weekly_report BOOLEAN DEFAULT true,
    email_security BOOLEAN DEFAULT true,
    email_marketing BOOLEAN DEFAULT false,
    push_stream_start BOOLEAN DEFAULT true,
    push_new_follower BOOLEAN DEFAULT false,
    push_donations BOOLEAN DEFAULT true,
    push_chat_mentions BOOLEAN DEFAULT true,
    push_security BOOLEAN DEFAULT true,
    inapp_stream_start BOOLEAN DEFAULT true,
    inapp_new_follower BOOLEAN DEFAULT true,
    inapp_donations BOOLEAN DEFAULT true,
    inapp_chat_mentions BOOLEAN DEFAULT true,
    inapp_moderator_actions BOOLEAN DEFAULT true,
    notification_sounds BOOLEAN DEFAULT true,
    chat_sounds BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_security table
CREATE TABLE IF NOT EXISTS user_security (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(255),
    login_notifications BOOLEAN DEFAULT true,
    session_timeout BOOLEAN DEFAULT true,
    suspicious_activity_alerts BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_name VARCHAR(255),
    device_type VARCHAR(100),
    ip_address INET,
    location VARCHAR(255),
    user_agent TEXT,
    is_current BOOLEAN DEFAULT false,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_security_user_id ON user_security(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
