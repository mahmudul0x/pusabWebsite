// DTOs matching the Django REST API serializers (backend/).

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_admin: boolean;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface GalleryItem {
  id: number;
  title: string;
  caption: string;
  category: "events" | "achievements" | "community" | "reunion" | "other";
  year: number | null;
  image_url: string;
  created_at: string;
}

export interface PublicityPost {
  id: number;
  type: "news" | "press" | "event";
  title: string;
  excerpt: string;
  body: string;
  link: string;
  image_url: string;
  date: string | null;
  published: boolean;
  created_at: string;
}

export interface EcMember {
  id: number;
  name: string;
  role: string;
  university: string;
  year: number;
  is_current: boolean;
  is_convening: boolean;
  photo_url: string;
}

export interface Program {
  id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  image_url: string;
  date: string | null;
  ongoing: boolean;
  recurrence: string;
  status: "upcoming" | "ongoing" | "completed";
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  father_name: string;
  mother_name: string;
  blood_group: string;
  subject: string;
  university: string;
  session: string;
  union_name: string;
  village: string;
  school: string;
  college: string;
  message: string;
  email: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  email: string;
  phone: string;
  members: string;
  founded: string;
  founded_at: string;
  address: string;
  facebook: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  is_admin: boolean;
  is_active: boolean;
  date_joined: string;
}

export interface LeaderMessage {
  id: number;
  role: "president" | "secretary";
  name: string;
  designation: string;
  session: string;
  photo_url: string;
  quote: string;
  body: string;
  updated_at: string;
}

export interface FelicitationEntry {
  id: number;
  name: string;
  title: string;
  category: "achiever" | "fresher";
  year: number;
  image_url: string;
  note: string;
  created_at: string;
}

export interface ProgramObjective {
  id: number;
  title: string;
  description: string;
  image_url: string;
  order: number;
}

export interface ProgramStat {
  id: number;
  label: string;
  value: string;
  order: number;
}

export interface ProgramGalleryImage {
  id: number;
  image_url: string;
  caption: string;
  order: number;
}

export interface ProgramTestimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  photo_url: string;
  order: number;
}

export interface ProgramPage {
  id: number;
  slug: string;
  year: number;
  title: string;
  tagline: string;
  hero_image_url: string;
  overview: string;
  eligibility: string;
  process: string;
  schedule_note: string;
  objectives: ProgramObjective[];
  stats: ProgramStat[];
  gallery: ProgramGalleryImage[];
  testimonials: ProgramTestimonial[];
  /** Every edition year that exists for this slug, newest first. Only
   * present on GET responses (added by the backend view), not on writes. */
  years?: number[];
  updated_at: string;
}
