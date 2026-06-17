
CREATE TABLE public.publicity_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('news','press','event')),
  title text NOT NULL,
  body text,
  date date,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.publicity_posts TO anon, authenticated;
GRANT ALL ON public.publicity_posts TO service_role;
ALTER TABLE public.publicity_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read publicity" ON public.publicity_posts FOR SELECT USING (true);

CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);

CREATE TABLE public.ec_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  university text,
  year int NOT NULL,
  is_current boolean NOT NULL DEFAULT false,
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ec_members TO anon, authenticated;
GRANT ALL ON public.ec_members TO service_role;
ALTER TABLE public.ec_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ec_members" ON public.ec_members FOR SELECT USING (true);

CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  category text NOT NULL CHECK (category IN ('events','achievements','community','reunion','other')),
  image_url text NOT NULL,
  year int,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_items TO anon, authenticated;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gallery" ON public.gallery_items FOR SELECT USING (true);
