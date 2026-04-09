-- Add production tracking fields to content_records for Phase 1
-- These fields capture when content is marked as "production done" along with file upload capability

ALTER TABLE public.content_records
  ADD COLUMN IF NOT EXISTS production_status VARCHAR(50) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS production_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS production_notes TEXT,
  ADD COLUMN IF NOT EXISTS production_file_url TEXT,
  ADD COLUMN IF NOT EXISTS production_file_name TEXT,
  ADD COLUMN IF NOT EXISTS production_file_type TEXT,
  ADD COLUMN IF NOT EXISTS production_completed_by UUID;
