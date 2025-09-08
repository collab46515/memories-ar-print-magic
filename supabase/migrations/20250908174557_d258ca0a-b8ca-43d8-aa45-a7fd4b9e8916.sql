-- Add AR target columns to album_pages table
ALTER TABLE public.album_pages 
ADD COLUMN IF NOT EXISTS ar_target_image_url TEXT,
ADD COLUMN IF NOT EXISTS ar_target_width_mm INTEGER DEFAULT 210,
ADD COLUMN IF NOT EXISTS ar_target_height_mm INTEGER DEFAULT 297;

-- Update existing records with default AR target dimensions
UPDATE public.album_pages 
SET ar_target_width_mm = 210, ar_target_height_mm = 297 
WHERE ar_target_width_mm IS NULL OR ar_target_height_mm IS NULL;