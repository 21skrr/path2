-- ============================================================
-- Referral System Migration
-- Run once against your live DB:
--   psql -U postgres -d hrplatform -f db_update.sql
-- ============================================================

-- Add referral columns to profiles
ALTER TABLE profiles
    ADD COLUMN IF NOT EXISTS referral_code     VARCHAR(20) UNIQUE,
    ADD COLUMN IF NOT EXISTS referred_by       VARCHAR(20),
    ADD COLUMN IF NOT EXISTS referral_credits  NUMERIC(10,2) DEFAULT 0;

-- Index for fast lookup by referral code
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);
