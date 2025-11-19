-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    aspect_ratio TEXT DEFAULT 'portrait' CHECK (aspect_ratio IN ('portrait', 'landscape')),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for videos table

-- Allow anyone to view all videos (public access)
CREATE POLICY "Anyone can view videos"
    ON public.videos
    FOR SELECT
    TO public
    USING (true);

-- Allow authenticated users to insert their own videos
CREATE POLICY "Users can insert their own videos"
    ON public.videos
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own videos, or admins to update any video
CREATE POLICY "Users can update their own videos or admins can update any"
    ON public.videos
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

-- Allow users to delete their own videos, or admins to delete any video
CREATE POLICY "Users can delete their own videos or admins can delete any"
    ON public.videos
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_videos_updated_at_trigger
    BEFORE UPDATE ON public.videos
    FOR EACH ROW
    EXECUTE FUNCTION update_videos_updated_at();

-- Create storage bucket for videos (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for videos bucket

-- Allow anyone to view videos
CREATE POLICY "Anyone can view videos"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'videos');

-- Allow authenticated users to upload videos
CREATE POLICY "Authenticated users can upload videos"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'videos');

-- Allow users to update their own videos
CREATE POLICY "Users can update their own videos"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own videos
CREATE POLICY "Users can delete their own videos"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);
