-- Create comprehensive auth_logs table
CREATE TABLE IF NOT EXISTS auth_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  session_id VARCHAR(255),
  event_type VARCHAR(50) NOT NULL,
  event_category VARCHAR(50) NOT NULL,
  success BOOLEAN NOT NULL DEFAULT false,
  ip_address INET NOT NULL,
  user_agent TEXT,
  location JSONB DEFAULT '{}',
  device_info JSONB DEFAULT '{}',
  details JSONB DEFAULT '{}',
  risk_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_auth_logs_user_id ON auth_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_logs_event_type ON auth_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_auth_logs_event_category ON auth_logs(event_category);
CREATE INDEX IF NOT EXISTS idx_auth_logs_success ON auth_logs(success);
CREATE INDEX IF NOT EXISTS idx_auth_logs_ip_address ON auth_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_auth_logs_created_at ON auth_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_auth_logs_risk_score ON auth_logs(risk_score);
CREATE INDEX IF NOT EXISTS idx_auth_logs_expires_at ON auth_logs(expires_at);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_auth_logs_user_event ON auth_logs(user_id, event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_auth_logs_ip_event ON auth_logs(ip_address, event_type, created_at);

-- Create partial indexes for performance
CREATE INDEX IF NOT EXISTS idx_auth_logs_failed_logins ON auth_logs(ip_address, created_at) 
WHERE event_type = 'login' AND success = false;

-- Insert sample log data
INSERT INTO auth_logs (user_id, session_id, event_type, event_category, success, ip_address, user_agent, location, device_info, details, risk_score) VALUES
(1, 'sess_123', 'login', 'authentication', true, '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '{"country": "United States", "city": "New York", "region": "NY"}', '{"device_type": "desktop", "browser": "Chrome", "os": "Windows"}', '{"method": "email"}', 0),
(2, 'sess_124', 'login', 'authentication', false, '192.168.1.2', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', '{"country": "United Kingdom", "city": "London", "region": "England"}', '{"device_type": "mobile", "browser": "Safari", "os": "iOS"}', '{"method": "email", "reason": "invalid_password"}', 3),
(3, NULL, 'register', 'registration', true, '192.168.1.3', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '{"country": "Canada", "city": "Toronto", "region": "ON"}', '{"device_type": "desktop", "browser": "Safari", "os": "macOS"}', '{"method": "email"}', 0),
(1, 'sess_125', 'password_reset', 'password_management', true, '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '{"country": "United States", "city": "New York", "region": "NY"}', '{"device_type": "desktop", "browser": "Chrome", "os": "Windows"}', '{}', 1),
(4, 'sess_126', 'login', 'authentication', true, '192.168.1.4', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '{"country": "Germany", "city": "Berlin", "region": "Berlin"}', '{"device_type": "desktop", "browser": "Chrome", "os": "Linux"}', '{"method": "google"}', 0);
