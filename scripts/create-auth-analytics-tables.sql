-- Create auth_events table for tracking authentication events
CREATE TABLE IF NOT EXISTS auth_events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  event_type VARCHAR(50) NOT NULL,
  success BOOLEAN NOT NULL DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create security_alerts table for security monitoring
CREATE TABLE IF NOT EXISTS security_alerts (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  severity VARCHAR(10) NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  message TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id),
  ip_address INET,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_auth_events_user_id ON auth_events(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_events_event_type ON auth_events(event_type);
CREATE INDEX IF NOT EXISTS idx_auth_events_created_at ON auth_events(created_at);
CREATE INDEX IF NOT EXISTS idx_auth_events_success ON auth_events(success);
CREATE INDEX IF NOT EXISTS idx_auth_events_ip_address ON auth_events(ip_address);

CREATE INDEX IF NOT EXISTS idx_security_alerts_type ON security_alerts(type);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_resolved ON security_alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_security_alerts_created_at ON security_alerts(created_at);

-- Insert some sample data for testing
INSERT INTO auth_events (user_id, event_type, success, ip_address, user_agent, details) VALUES
(1, 'login', true, '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '{"method": "email"}'),
(2, 'login', false, '192.168.1.2', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', '{"method": "email", "reason": "invalid_password"}'),
(3, 'register', true, '192.168.1.3', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '{"method": "email"}'),
(1, 'password_reset', true, '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '{}'),
(4, 'login', true, '192.168.1.4', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '{"method": "google"}');
