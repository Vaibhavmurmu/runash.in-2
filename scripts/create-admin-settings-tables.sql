-- Admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL,
  key VARCHAR(100) NOT NULL,
  value TEXT NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'string',
  description TEXT,
  updated_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, key)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_settings_category ON admin_settings(category);
CREATE INDEX IF NOT EXISTS idx_admin_settings_updated_by ON admin_settings(updated_by);

-- Insert default settings
INSERT INTO admin_settings (category, key, value, type, description, updated_by) VALUES
('auth', 'password_min_length', '8', 'number', 'Minimum password length', (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('auth', 'password_require_uppercase', 'true', 'boolean', 'Require uppercase letters in passwords', (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('auth', 'password_require_lowercase', 'true', 'boolean', 'Require lowercase letters in passwords', (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('auth', 'password_require_numbers', 'true', 'boolean', 'Require numbers in passwords', (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('auth', 'password_require_symbols', 'false', 'boolean', 'Require symbols in passwords', (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('auth', 'session_timeout', '86400', 'number', 'Session timeout in seconds', (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('auth', 'max_login_attempts', '5', 'number', 'Maximum login attempts before lockout', (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('security', 'enable_2fa', 'true', 'boolean', 'Enable two-factor authentication', (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('security', 'enable_magic_links', 'true', 'boolean', 'Enable magic link authentication', (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('security', 'enable_passkeys', 'true', 'boolean', 'Enable passkey authentication', (SELECT id FROM users WHERE role = 'admin' LIMIT 1))
ON CONFLICT (category, key) DO NOTHING;
