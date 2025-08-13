-- Create security_threats table
CREATE TABLE IF NOT EXISTS security_threats (
  id SERIAL PRIMARY KEY,
  threat_type VARCHAR(50) NOT NULL,
  severity VARCHAR(10) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  source_ip INET NOT NULL,
  target_user_id INTEGER REFERENCES users(id),
  indicators JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'investigating', 'resolved', 'false_positive')),
  first_detected TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  occurrences INTEGER DEFAULT 1,
  risk_score INTEGER DEFAULT 5,
  auto_resolved BOOLEAN DEFAULT false,
  resolved_by INTEGER REFERENCES users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ip_blacklist table
CREATE TABLE IF NOT EXISTS ip_blacklist (
  id SERIAL PRIMARY KEY,
  ip_address INET UNIQUE NOT NULL,
  reason TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create security_rules table
CREATE TABLE IF NOT EXISTS security_rules (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  rule_type VARCHAR(50) NOT NULL,
  conditions JSONB NOT NULL,
  actions JSONB NOT NULL,
  severity VARCHAR(10) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create security_incidents table
CREATE TABLE IF NOT EXISTS security_incidents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  severity VARCHAR(10) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  assigned_to INTEGER REFERENCES users(id),
  threat_ids JSONB DEFAULT '[]',
  timeline JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_security_threats_type ON security_threats(threat_type);
CREATE INDEX IF NOT EXISTS idx_security_threats_severity ON security_threats(severity);
CREATE INDEX IF NOT EXISTS idx_security_threats_status ON security_threats(status);
CREATE INDEX IF NOT EXISTS idx_security_threats_source_ip ON security_threats(source_ip);
CREATE INDEX IF NOT EXISTS idx_security_threats_target_user ON security_threats(target_user_id);
CREATE INDEX IF NOT EXISTS idx_security_threats_first_detected ON security_threats(first_detected);
CREATE INDEX IF NOT EXISTS idx_security_threats_risk_score ON security_threats(risk_score);

CREATE INDEX IF NOT EXISTS idx_ip_blacklist_ip ON ip_blacklist(ip_address);
CREATE INDEX IF NOT EXISTS idx_ip_blacklist_expires ON ip_blacklist(expires_at);

CREATE INDEX IF NOT EXISTS idx_security_rules_type ON security_rules(rule_type);
CREATE INDEX IF NOT EXISTS idx_security_rules_enabled ON security_rules(enabled);

-- Insert sample security rules
INSERT INTO security_rules (name, description, rule_type, conditions, actions, severity) VALUES
('Brute Force Detection', 'Detect multiple failed login attempts', 'brute_force', '{"failed_attempts": 10, "time_window": "1 hour"}', '{"block_ip": true, "alert": true}', 'high'),
('Suspicious IP Detection', 'Detect IPs with high risk scores', 'suspicious_ip', '{"avg_risk_score": 7, "time_window": "24 hours"}', '{"alert": true, "monitor": true}', 'medium'),
('Credential Stuffing Detection', 'Detect rapid login attempts across multiple accounts', 'credential_stuffing', '{"unique_users": 20, "time_window": "1 hour"}', '{"block_ip": true, "alert": true}', 'critical'),
('Account Takeover Detection', 'Detect potential account compromise', 'account_takeover', '{"failed_then_success": 3, "time_window": "2 hours"}', '{"alert": true, "require_2fa": true}', 'critical');

-- Insert sample security threats for testing
INSERT INTO security_threats (threat_type, severity, title, description, source_ip, indicators, risk_score, metadata) VALUES
('brute_force', 'high', 'Brute Force Attack from 192.168.1.100', '15 failed login attempts detected', '192.168.1.100', '["multiple_failed_logins", "suspicious_ip"]', 8, '{"failed_attempts": 15}'),
('suspicious_ip', 'medium', 'Suspicious Activity from 10.0.0.50', 'High-risk behavior detected', '10.0.0.50', '["high_risk_score", "unusual_pattern"]', 7, '{"avg_risk": 7.2}'),
('credential_stuffing', 'critical', 'Credential Stuffing Attack', 'Attempted login to 25 accounts', '203.0.113.1', '["multiple_accounts", "rapid_attempts"]', 9, '{"unique_users": 25}');
