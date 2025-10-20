-- Create a bucket for profile avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile_avatars', 'profile_avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the bucket
UPDATE storage.buckets SET public = false WHERE name = 'profile_avatars';

-- Create policies for avatar access
-- Allow public read access to avatars
DROP POLICY IF EXISTS "Public profiles are publicly accessible" ON storage.objects;
CREATE POLICY "Public profiles are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile_avatars');

-- Allow authenticated users to upload their own avatar
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile_avatars' AND
    (auth.uid())::text = (SPLIT_PART(name, '/', 1))
  );

-- Allow users to update their own avatar
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile_avatars' AND
    (auth.uid())::text = (SPLIT_PART(name, '/', 1))
  );

-- Allow users to delete their own avatar
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile_avatars' AND
    (auth.uid())::text = (SPLIT_PART(name, '/', 1))
  );

-- Create function to handle avatar deletion when profile is updated
CREATE OR REPLACE FUNCTION handle_avatar_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.avatar_url IS NOT NULL AND OLD.avatar_url != NEW.avatar_url THEN
    -- Delete old avatar from storage
    DELETE FROM storage.objects
    WHERE bucket_id = 'profile_avatars'
    AND name LIKE OLD.id || '/%';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for avatar cleanup
DROP TRIGGER IF EXISTS on_avatar_update ON public.profiles;
CREATE TRIGGER on_avatar_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (OLD.avatar_url IS DISTINCT FROM NEW.avatar_url)
  EXECUTE FUNCTION handle_avatar_update();