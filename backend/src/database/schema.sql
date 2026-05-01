-- ============================================================
-- Turki Platform - Database Schema
-- Phase 1
-- ============================================================

-- Sessions table (managed by connect-pg-simple)
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
) WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Security events (SIEM)
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(100) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'low', 'medium', 'high', 'critical')),
  ip_address VARCHAR(45),
  user_agent TEXT,
  path TEXT,
  method VARCHAR(10),
  status_code INTEGER,
  message TEXT,
  metadata JSONB DEFAULT '{}',
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Indexes for SIEM queries
CREATE INDEX IF NOT EXISTS idx_events_event_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_events_status ON security_events(status);
CREATE INDEX IF NOT EXISTS idx_events_source ON security_events(source);
CREATE INDEX IF NOT EXISTS idx_events_ip ON security_events(ip_address);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON security_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_composite ON security_events(severity, status, created_at DESC);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
