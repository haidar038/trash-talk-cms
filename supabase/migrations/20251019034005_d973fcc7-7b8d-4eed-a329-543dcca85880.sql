-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('article-images', 'article-images', true);

-- Add image_url column to articles table
ALTER TABLE public.articles 
ADD COLUMN image_url TEXT;

-- Create policies for article images bucket
CREATE POLICY "Anyone can view article images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'article-images');

CREATE POLICY "Authenticated users can upload article images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'article-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own article images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'article-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own article images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'article-images' AND auth.uid() IS NOT NULL);