-- Create the content table
CREATE TABLE IF NOT EXISTS content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL DEFAULT 'post',
  status TEXT NOT NULL DEFAULT 'draft',
  body TEXT,
  excerpt TEXT,
  featured_image TEXT,
  
  -- Author info (can link to auth.users if needed, or snapshot)
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  author_email TEXT,

  -- Metadata stored as JSONB for flexibility
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Specific fields for other content types
  platform TEXT, -- for social
  update_type TEXT, -- for updates
  version TEXT, -- for updates
  external_link TEXT, -- for press
  parent_id UUID REFERENCES content(id), -- for nested resources

  -- Timestamps
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Policy: Allow read access to everyone for published content
CREATE POLICY "Public can view published content" 
ON content FOR SELECT 
USING (status = 'published');

-- Policy: Allow authenticated users (admins) to do everything
CREATE POLICY "Admins can do everything" 
ON content FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create updated_at trigger
create extension if not exists moddatetime schema extensions;

  for each row execute procedure moddatetime (updated_at);

-- Create Storage Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Give public access to images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Policy: Give authenticated users upload access
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'images' );

-- Policy: Give authenticated users delete access
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'images' );
