-- Run once in the dedicated Websensial Supabase project after deploying the
-- terms-document uploader. Existing image uploads keep their 10 MB limit.
update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf']
where id = 'websensial-media';
