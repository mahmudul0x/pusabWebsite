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
  email: string;
  phone: string;
  subject: string;
  message: string;
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
