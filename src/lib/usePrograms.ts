import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  Users,
  GraduationCap,
  HeartHandshake,
  Trees,
  Stethoscope,
  Radio,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { programsApi, optimizeImage } from "@/lib/api";

export type IconType = ComponentType<{ size?: number; className?: string }>;
export type Status = "upcoming" | "ongoing" | "completed";

export type ProgramEvent = {
  id: string;
  title: string;
  category: string;
  Icon: IconType;
  /** ISO date — drives the computed status. Omit for always-on programs. */
  date?: string;
  /** Always-on / recurring programs are surfaced as "ongoing". */
  ongoing?: boolean;
  recurrence?: string;
  location: string;
  desc: string;
  /** Cloudinary/remote image (from the API). Falls back to a repo asset by id. */
  image?: string;
};

// Map an API program's category to an icon for the card.
const CATEGORY_ICON: Record<string, IconType> = {
  flagship: Users,
  education: GraduationCap,
  aid: HeartHandshake,
  community: Trees,
  relief: Stethoscope,
  digital: Radio,
  publication: BookOpen,
};
export const iconFor = (category: string): IconType =>
  CATEGORY_ICON[category.trim().toLowerCase()] ?? Sparkles;

// Real-world programme calendar. Status is derived from the date below, so the
// page stays correct over time without code changes.
export const EVENTS: ProgramEvent[] = [
  {
    id: "webinar-2026",
    title: "Online Career Webinar",
    category: "Digital",
    Icon: Radio,
    date: "2026-07-12",
    location: "Online · Zoom",
    desc: "Live Q&A with alumni across medicine, engineering and civil service on careers after graduation.",
  },
  {
    id: "medical-camp-2026",
    title: "Free Medical Camp",
    category: "Relief",
    Icon: Stethoscope,
    date: "2026-08-23",
    location: "Bishwambarpur Upazila",
    desc: "A day-long free health camp — general check-ups, medicine and awareness for the local community.",
  },
  {
    id: "sayor-2026",
    title: "SAYOR — 12th Edition",
    category: "Publication",
    Icon: BookOpen,
    date: "2026-10-15",
    location: "Print + Digital",
    desc: "The new issue of PUSAB's annual magazine, gathering literature, essays and alumni voices.",
  },
  {
    id: "scholarship-2026",
    title: "PUSAB Scholarship 2026",
    category: "Aid",
    Icon: HeartHandshake,
    date: "2026-11-05",
    location: "Applications online",
    desc: "Merit and need-based stipends for deserving students from underserved families, with mentor pairing.",
  },
  {
    id: "reunion-2026",
    title: "Annual Reunion 2026",
    category: "Flagship",
    Icon: Users,
    date: "2026-12-20",
    location: "Sunamganj",
    desc: "The flagship gathering — cross-batch networking, awards and a cultural evening for 500+ members.",
  },
  {
    id: "schooling",
    title: "School Tutoring Programme",
    category: "Education",
    Icon: GraduationCap,
    ongoing: true,
    recurrence: "Weekly sessions",
    location: "12 local schools",
    desc: "Free tutoring, career mentoring and olympiad prep delivered by members across the upazila.",
  },
  {
    id: "online-mentoring",
    title: "Admission Mentoring",
    category: "Digital",
    Icon: Radio,
    ongoing: true,
    recurrence: "Monthly AMAs",
    location: "Online",
    desc: "Rolling admission AMAs and one-to-one guidance for university aspirants from Bishwambarpur.",
  },
  {
    id: "picnic-2026",
    title: "Winter Picnic 2026",
    category: "Community",
    Icon: Trees,
    date: "2026-01-31",
    location: "Tanguar Haor",
    desc: "A full-day outdoor reunion with games, cuisine and families welcome — a warm start to the year.",
  },
  {
    id: "sayor-11",
    title: "SAYOR — 11th Edition",
    category: "Publication",
    Icon: BookOpen,
    date: "2025-12-10",
    location: "Print + Digital",
    desc: "Released the eleventh annual issue with 17 pieces spanning education, culture and creative writing.",
  },
  {
    id: "reunion-2025",
    title: "Annual Reunion 2025",
    category: "Flagship",
    Icon: Users,
    date: "2025-12-21",
    location: "Sunamganj",
    desc: "Hundreds of members reunited for recognition, networking and a memorable cultural night.",
  },
  {
    id: "scholarship-2025",
    title: "PUSAB Scholarship 2025",
    category: "Aid",
    Icon: HeartHandshake,
    date: "2025-11-08",
    location: "Disbursed directly",
    desc: "Awarded need-based stipends to students preparing for and entering public universities.",
  },
  {
    id: "flood-relief-2024",
    title: "Flood Relief Drive",
    category: "Relief",
    Icon: Stethoscope,
    date: "2024-07-15",
    location: "Sunamganj",
    desc: "Coordinated emergency relief, food and shelter support for flood-affected families across the region.",
  },
];

export function statusOf(e: ProgramEvent, now: number): Status {
  if (e.ongoing) return "ongoing";
  if (e.date && new Date(e.date).getTime() >= now) return "upcoming";
  return "completed";
}

/** Loads programs from the API; falls back to the built-in calendar if empty. */
export function useProgramEvents() {
  const [apiEvents, setApiEvents] = useState<ProgramEvent[] | null>(null);

  useEffect(() => {
    programsApi
      .listAll()
      .then((rows) =>
        setApiEvents(
          rows.map((p) => ({
            id: String(p.id),
            title: p.title,
            category: p.category,
            Icon: iconFor(p.category),
            date: p.date ?? undefined,
            ongoing: p.ongoing,
            recurrence: p.recurrence,
            location: p.location,
            desc: p.description,
            image: p.image_url ? optimizeImage(p.image_url, 800) : undefined,
          })),
        ),
      )
      .catch(() => setApiEvents([]));
  }, []);

  const source = apiEvents && apiEvents.length > 0 ? apiEvents : EVENTS;
  const now = useMemo(() => Date.now(), []);

  return { events: source, now };
}
