-- =========================================================
-- PROMPT WEAVER — Credit RPC Functions
-- Run this entire file in Supabase SQL Editor once.
-- =========================================================

-- ── 1. Atomic decrement ────────────────────────────────────
-- Deducts p_amount from user_credits WHERE credits >= p_amount.
-- Returns the NEW remaining credits.
-- Throws 'INSUFFICIENT_CREDITS' if balance would go negative.
-- Concurrent safe: row-level lock via UPDATE.

CREATE OR REPLACE FUNCTION decrement_user_credits(
  p_user_id UUID,
  p_amount   INTEGER DEFAULT 1
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_remaining INTEGER;
BEGIN
  UPDATE user_credits
  SET
    credits    = credits - p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id
    AND credits >= p_amount
  RETURNING credits INTO v_remaining;

  -- If no row was updated, either user doesn't exist or balance too low
  IF v_remaining IS NULL THEN
    RAISE EXCEPTION 'INSUFFICIENT_CREDITS'
      USING HINT = 'User has insufficient credits to complete this request.';
  END IF;

  RETURN v_remaining;
END;
$$;

-- Grant execute to anon and authenticated roles
GRANT EXECUTE ON FUNCTION decrement_user_credits(UUID, INTEGER) TO anon, authenticated;


-- ── 2. Refund ──────────────────────────────────────────────
-- Adds p_amount back to user_credits.
-- Call this when the LLM/AI step fails AFTER a successful decrement.
-- Returns the NEW remaining credits.

CREATE OR REPLACE FUNCTION refund_user_credits(
  p_user_id UUID,
  p_amount   INTEGER DEFAULT 1
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_remaining INTEGER;
BEGIN
  UPDATE user_credits
  SET
    credits    = credits + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING credits INTO v_remaining;

  IF v_remaining IS NULL THEN
    RAISE EXCEPTION 'USER_NOT_FOUND'
      USING HINT = 'No user_credits row found for this user_id.';
  END IF;

  RETURN v_remaining;
END;
$$;

-- Grant execute to anon and authenticated roles
GRANT EXECUTE ON FUNCTION refund_user_credits(UUID, INTEGER) TO anon, authenticated;


-- ── 3. Verify the functions work ──────────────────────────
-- After running, test with a real user_id from your auth.users table:
-- SELECT decrement_user_credits('YOUR-USER-UUID-HERE', 1);
-- SELECT refund_user_credits('YOUR-USER-UUID-HERE', 1);
