
-- Move existing object into the public/ prefix so emails referencing it still resolve.
UPDATE storage.objects
SET name = 'public/logo.png'
WHERE bucket_id = 'email-assets' AND name = 'logo.png';

-- Replace the broad public SELECT policy with a name-scoped one.
DROP POLICY IF EXISTS "Email assets public read by name" ON storage.objects;

CREATE POLICY "Email assets public read - public folder only"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'email-assets'
  AND (storage.foldername(name))[1] = 'public'
);
