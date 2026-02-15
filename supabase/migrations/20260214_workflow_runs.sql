-- Migration: Create workflow_runs table for n8n integration
-- Purpose: Track workflow executions, enable idempotency, store results
-- Date: 2026-02-14

-- Create workflow_runs table
CREATE TABLE IF NOT EXISTS public.workflow_runs (
  request_id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'website')),
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'succeeded', 'failed')),
  input_json JSONB,
  output_json JSONB,
  error_code TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workflow_runs_user_id ON public.workflow_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_status ON public.workflow_runs(status);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_created_at ON public.workflow_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_user_created ON public.workflow_runs(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.workflow_runs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own workflow runs
CREATE POLICY "Users can read own workflow_runs"
  ON public.workflow_runs
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Only service role can insert (server-side only)
CREATE POLICY "Service role can insert workflow_runs"
  ON public.workflow_runs
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- RLS Policy: Only service role can update (server-side only)
CREATE POLICY "Service role can update workflow_runs"
  ON public.workflow_runs
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_workflow_runs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER workflow_runs_updated_at
  BEFORE UPDATE ON public.workflow_runs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_workflow_runs_updated_at();

-- Create helper function for upserting workflow runs (optional, for convenience)
CREATE OR REPLACE FUNCTION public.upsert_workflow_run(
  p_request_id UUID,
  p_user_id UUID,
  p_type TEXT,
  p_status TEXT,
  p_input_json JSONB DEFAULT NULL,
  p_output_json JSONB DEFAULT NULL,
  p_error_code TEXT DEFAULT NULL,
  p_error_message TEXT DEFAULT NULL
)
RETURNS public.workflow_runs AS $$
DECLARE
  result public.workflow_runs;
BEGIN
  INSERT INTO public.workflow_runs (
    request_id,
    user_id,
    type,
    status,
    input_json,
    output_json,
    error_code,
    error_message
  )
  VALUES (
    p_request_id,
    p_user_id,
    p_type,
    p_status,
    p_input_json,
    p_output_json,
    p_error_code,
    p_error_message
  )
  ON CONFLICT (request_id) DO UPDATE SET
    status = EXCLUDED.status,
    output_json = COALESCE(EXCLUDED.output_json, workflow_runs.output_json),
    error_code = EXCLUDED.error_code,
    error_message = EXCLUDED.error_message,
    updated_at = NOW()
  RETURNING * INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE public.workflow_runs IS 'Tracks n8n workflow executions with idempotency and result storage';
COMMENT ON COLUMN public.workflow_runs.request_id IS 'Unique identifier for idempotency';
COMMENT ON COLUMN public.workflow_runs.status IS 'Current status: queued, running, succeeded, failed';
COMMENT ON COLUMN public.workflow_runs.input_json IS 'Original request payload';
COMMENT ON COLUMN public.workflow_runs.output_json IS 'n8n response data';
