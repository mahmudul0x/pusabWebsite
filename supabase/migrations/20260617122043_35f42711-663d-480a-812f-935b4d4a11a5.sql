
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact" ON public.contact_submissions
FOR INSERT
WITH CHECK (
  length(trim(name)) BETWEEN 1 AND 120
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(email) <= 200
  AND length(coalesce(subject, '')) <= 200
  AND length(trim(message)) BETWEEN 5 AND 5000
);
