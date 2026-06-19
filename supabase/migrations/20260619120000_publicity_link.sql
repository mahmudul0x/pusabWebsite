-- Allow publicity posts (news/press/events) to point at an external source URL.
ALTER TABLE public.publicity_posts ADD COLUMN IF NOT EXISTS link text;
