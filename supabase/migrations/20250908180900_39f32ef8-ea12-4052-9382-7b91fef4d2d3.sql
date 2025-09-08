-- Make the videos bucket public so AR target images can be viewed
UPDATE storage.buckets 
SET public = true 
WHERE name = 'videos';