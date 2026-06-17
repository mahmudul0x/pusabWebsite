
CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admins upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS caption text;
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS storage_path text;
ALTER TABLE public.publicity_posts ADD COLUMN IF NOT EXISTS excerpt text;
ALTER TABLE public.publicity_posts ADD COLUMN IF NOT EXISTS storage_path text;
ALTER TABLE public.publicity_posts ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;
ALTER TABLE public.ec_members ADD COLUMN IF NOT EXISTS storage_path text;

CREATE POLICY "Admins manage gallery" ON public.gallery_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage publicity" ON public.publicity_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage ec_members" ON public.ec_members FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.gallery_items (title, category, image_url, year, caption) VALUES
('Classroom session', 'events', 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1600&q=80', 2024, 'Students engaged in a workshop'),
('Community gathering', 'community', 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1600&q=80', 2024, 'Members convene in the village'),
('Books for young readers', 'community', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80', 2023, 'Distribution drive in Bishwambarpur'),
('Plantation drive', 'events', 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1600&q=80', 2023, 'Restoring local green cover'),
('Scholarship ceremony', 'achievements', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1600&q=80', 2024, 'Recipients honoured on stage'),
('Field interview for SAYOR', 'other', 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1600&q=80', 2023, 'Documenting voices from the upozila'),
('Haor at dusk', 'other', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80', 2024, 'Bishwambarpur wetlands'),
('Letter writing drive', 'community', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&q=80', 2022, 'Notes to alumni worldwide'),
('Annual reunion', 'reunion', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80', 2024, 'Generations reconnect'),
('Volunteer briefing', 'events', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80', 2024, 'Pre-event huddle'),
('Cultural evening', 'reunion', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80', 2023, 'Music and memory'),
('Award winners', 'achievements', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80', 2024, 'Celebrating excellence');

INSERT INTO public.publicity_posts (title, type, date, body, excerpt, image_url) VALUES
('PUSAB launches 2024 scholarship cohort', 'news', '2024-09-12', 'PUSAB opened applications for the 2024 scholarship cohort, expanding support to 40 students across Bishwambarpur upozila.', '40 students supported across Bishwambarpur this year.', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=80'),
('Annual reunion brings alumni home', 'event', '2024-12-20', 'Hundreds gathered for the annual reunion, reconnecting members across generations and renewing commitments to upozila development.', 'A weekend of reconnection and renewed pledges.', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80'),
('SAYOR Issue 04 hits the press', 'news', '2025-02-08', 'The fourth issue of SAYOR features long-form essays on heritage, education access, and the wetlands of Tanguar haor.', 'Long-form essays on heritage and education.', 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1600&q=80'),
('Tree plantation across 12 schools', 'event', '2024-07-05', 'Volunteers planted over 1,200 saplings across 12 schools in Bishwambarpur as part of the green campus initiative.', '1,200 saplings, 12 schools, one weekend.', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&q=80'),
('Press: PUSAB recognised for community work', 'press', '2024-11-02', 'Local press highlighted PUSAB''s decade-long contribution to community education and disaster response.', 'A decade of community education recognised.', 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&q=80'),
('Winter relief in Bishwambarpur', 'event', '2024-01-15', 'Members distributed warm clothing across remote villages during the coldest week of the season.', 'Warm clothing reached 600 families.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80');
