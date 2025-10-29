-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create more specific update policy
CREATE POLICY "Users can update their own profile" ON public.profiles FOR
UPDATE USING (auth.uid () = id)
WITH
    CHECK (
        auth.uid () = id
        AND (
            CASE
                WHEN avatar_url IS NOT NULL THEN avatar_url LIKE '%/storage/v1/object/public/profile_avatars/%'
                ELSE true
            END
        )
    );