-- Migration: Refactor videos table to gallery table with support for images and videos

-- Drop existing policies on videos table
DROP POLICY IF EXISTS "Anyone can view videos" ON public.videos;
DROP POLICY IF EXISTS "Users can insert their own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can update their own videos or admins can update any" ON public.videos;
DROP POLICY IF EXISTS "Users can delete their own videos or admins can delete any" ON public.videos;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Anyone can view videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own videos" ON storage.objects;

-- Rename videos table to gallery
ALTER TABLE IF EXISTS public.videos RENAME TO gallery;

-- Add media_type column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'gallery' AND column_name = 'media_type') THEN
        ALTER TABLE public.gallery ADD COLUMN media_type TEXT DEFAULT 'video'
            CHECK (media_type IN ('image', 'video'));
    END IF;
END $$;

-- Rename video_url to media_url
ALTER TABLE public.gallery RENAME COLUMN video_url TO media_url;

-- Update trigger name
DROP TRIGGER IF EXISTS update_videos_updated_at_trigger ON public.gallery;
CREATE TRIGGER update_gallery_updated_at_trigger
    BEFORE UPDATE ON public.gallery
    FOR EACH ROW
    EXECUTE FUNCTION update_videos_updated_at();

-- Rename the function for clarity
ALTER FUNCTION update_videos_updated_at() RENAME TO update_gallery_updated_at;

-- Update indexes
DROP INDEX IF EXISTS idx_videos_user_id;
DROP INDEX IF EXISTS idx_videos_created_at;
CREATE INDEX IF NOT EXISTS idx_gallery_user_id ON public.gallery(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON public.gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_media_type ON public.gallery(media_type);

-- Create new RLS policies for gallery table

-- Allow anyone to view all gallery items (public access)
CREATE POLICY "Anyone can view gallery items"
    ON public.gallery
    FOR SELECT
    TO public
    USING (true);

-- Allow authenticated users to insert their own gallery items
CREATE POLICY "Users can insert their own gallery items"
    ON public.gallery
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own items, or admins to update any item
CREATE POLICY "Users can update their own gallery items or admins can update any"
    ON public.gallery
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = user_id
        OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        auth.uid() = user_id
        OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Allow users to delete their own items, or admins to delete any item
CREATE POLICY "Users can delete their own gallery items or admins can delete any"
    ON public.gallery
    FOR DELETE
    TO authenticated
    USING (
        auth.uid() = user_id
        OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create new storage bucket for gallery (supports both images and videos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for gallery bucket

-- Allow anyone to view gallery items
CREATE POLICY "Anyone can view gallery items"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'gallery');

-- Allow authenticated users to upload to gallery
CREATE POLICY "Authenticated users can upload to gallery"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'gallery');

-- Allow users to update their own gallery items
CREATE POLICY "Users can update their own gallery items"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own gallery items
CREATE POLICY "Users can delete their own gallery items"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add comment to table
COMMENT ON TABLE public.gallery IS 'Gallery table containing both images and videos for public display';
COMMENT ON COLUMN public.gallery.media_type IS 'Type of media: image or video';
COMMENT ON COLUMN public.gallery.aspect_ratio IS 'Aspect ratio: portrait (9:16) or landscape (16:9)';
