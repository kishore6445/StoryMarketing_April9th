-- Create production_assets table for storing files/content produced
-- Links to content_records and tracks what was actually produced

CREATE TABLE production_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_record_id UUID NOT NULL REFERENCES content_records(id) ON DELETE CASCADE,
  asset_type VARCHAR(50) NOT NULL, -- 'video', 'image', 'document', 'audio', 'template'
  platform_needed VARCHAR(50), -- 'Instagram', 'LinkedIn', 'YouTube', 'Blog', 'Email' (nullable = generic asset)
  file_name VARCHAR(255) NOT NULL,
  file_size_bytes INT,
  file_url TEXT NOT NULL, -- Stored in Vercel Blob or similar
  mime_type VARCHAR(100),
  dimensions VARCHAR(50), -- For images/videos: "1920x1080"
  duration_seconds INT, -- For videos/audio
  notes TEXT, -- Special handling notes for this asset
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  uploaded_by UUID, -- User who uploaded
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for quick lookups by content record
CREATE INDEX idx_production_assets_content_record_id 
  ON production_assets(content_record_id);

-- Index for platform filtering
CREATE INDEX idx_production_assets_platform_needed 
  ON production_assets(platform_needed);

-- Add RLS policies if using Supabase
ALTER TABLE production_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view production assets for their workspace"
  ON production_assets FOR SELECT
  USING (true); -- Adjust based on your auth model

CREATE POLICY "Users can insert production assets"
  ON production_assets FOR INSERT
  WITH CHECK (true); -- Adjust based on your auth model

CREATE POLICY "Users can update production assets"
  ON production_assets FOR UPDATE
  USING (true); -- Adjust based on your auth model

CREATE POLICY "Users can delete production assets"
  ON production_assets FOR DELETE
  USING (true); -- Adjust based on your auth model
