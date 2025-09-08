-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', false);

-- Create albums table
CREATE TABLE public.albums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create album_pages table
CREATE TABLE public.album_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  page_no INTEGER NOT NULL DEFAULT 1,
  width_mm INTEGER DEFAULT 210,
  height_mm INTEGER DEFAULT 297,
  video_url TEXT NOT NULL,
  page_target_id UUID DEFAULT gen_random_uuid(),
  overlay_json JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_pages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
CREATE POLICY "Albums are viewable by everyone" ON public.albums FOR SELECT USING (true);
CREATE POLICY "Albums can be created by everyone" ON public.albums FOR INSERT WITH CHECK (true);
CREATE POLICY "Album pages are viewable by everyone" ON public.album_pages FOR SELECT USING (true);
CREATE POLICY "Album pages can be created by everyone" ON public.album_pages FOR INSERT WITH CHECK (true);

-- Storage policies for videos
CREATE POLICY "Videos are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
CREATE POLICY "Videos can be uploaded by everyone" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'videos');

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_albums_updated_at
  BEFORE UPDATE ON public.albums
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_album_pages_updated_at
  BEFORE UPDATE ON public.album_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();