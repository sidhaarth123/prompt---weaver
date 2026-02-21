-- =========================================================
-- PROMPT WEAVER — Multi-turn Chat State Persistence
-- Run this entire file in Supabase SQL Editor once.
-- =========================================================

-- ── 1. conversations table ─────────────────────────────────
-- Stores each in-progress or completed AI conversation.

CREATE TABLE IF NOT EXISTS conversations (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workflow_type   TEXT        NOT NULL DEFAULT 'image',
  status          TEXT        NOT NULL DEFAULT 'active'
                              CHECK (status IN ('active', 'completed')),
  questions       JSONB       NOT NULL DEFAULT '[]'::jsonb,
  answers         JSONB       NOT NULL DEFAULT '{}'::jsonb,
  final           JSONB,
  prompt_package  JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast lookup: user's active conversations sorted newest first
CREATE INDEX IF NOT EXISTS idx_conversations_user_active
  ON conversations (user_id, status, updated_at DESC);

-- RLS: users see and touch only their own conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_own_conversations" ON conversations;
CREATE POLICY "users_own_conversations"
  ON conversations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ── 2. user_state table ────────────────────────────────────
-- Tracks which conversation is currently "active" for each user.
-- This is the backend fallback when the frontend doesn't send conversation_id.

CREATE TABLE IF NOT EXISTS user_state (
  user_id                 UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  active_conversation_id  UUID REFERENCES conversations(id) ON DELETE SET NULL,
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_own_state" ON user_state;
CREATE POLICY "users_own_state"
  ON user_state FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ── 3. Helper function: upsert user_state ─────────────────
-- Called by n8n after creating a new conversation.

CREATE OR REPLACE FUNCTION set_active_conversation(
  p_user_id         UUID,
  p_conversation_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_state (user_id, active_conversation_id, updated_at)
  VALUES (p_user_id, p_conversation_id, NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET
    active_conversation_id = p_conversation_id,
    updated_at = NOW();
END;
$$;

GRANT EXECUTE ON FUNCTION set_active_conversation(UUID, UUID) TO anon, authenticated;


-- ── 4. Helper function: clear active conversation ──────────
-- Called by n8n when a conversation reaches status=completed.

CREATE OR REPLACE FUNCTION clear_active_conversation(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE user_state
  SET active_conversation_id = NULL, updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION clear_active_conversation(UUID) TO anon, authenticated;


-- ── 5. Verify ─────────────────────────────────────────────
-- Run after migration to confirm:
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('conversations', 'user_state');
