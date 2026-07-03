import {
  Users,
  GraduationCap,
  HeartHandshake,
  Trees,
  Stethoscope,
  Radio,
  Award,
  type LucideIcon,
} from "lucide-react";

/**
 * Per-program visual identity for /programs/<slug>. Colors stay within the
 * site's existing palette (no new brand colors), but each program also gets
 * a distinct `layout` — which sections render, and how — so the 7 pages
 * read as genuinely different places rather than one template recolored.
 * All layouts read from the same ProgramPage data; only the presentation
 * (and which optional sections are shown at all) changes.
 */
export type ProgramLayout =
  | "timeline" // Reunion: vertical timeline for highlights, big stat banner, no eligibility grid
  | "checklist" // Scholarship: stat banner up top, highlights as a numbered checklist, eligibility emphasized
  | "curriculum" // Schooling: highlights as a photo mosaic, plain-text eligibility/process (no boxes)
  | "spotlight" // Felicitation: large award-style highlight cards, testimonials pulled up near the top
  | "alert" // Humanity: urgent banner strip, process as numbered action steps, gallery prioritized
  | "gallery-first" // Picnic: masonry gallery leads, no eligibility/process at all
  | "compact"; // Online: minimal, schedule-focused, no gallery (virtual event)

export interface ProgramTheme {
  Icon: LucideIcon;
  /** CSS color values (not var() names) used for this page's accent gradient. */
  colorA: string;
  colorB: string;
  layout: ProgramLayout;
  /** Short one-word mood label shown as a kicker above the title. */
  mood: string;
}

export const PROGRAM_THEMES: Record<string, ProgramTheme> = {
  reunion: {
    Icon: Users,
    colorA: "#f59e0b",
    colorB: "#ef4444",
    layout: "timeline",
    mood: "Celebration",
  },
  schooling: {
    Icon: GraduationCap,
    colorA: "#0ea5e9",
    colorB: "#22c55e",
    layout: "curriculum",
    mood: "Education",
  },
  scholarship: {
    Icon: Award,
    colorA: "#22c55e",
    colorB: "#0ea5e9",
    layout: "checklist",
    mood: "Opportunity",
  },
  felicitation: {
    Icon: Award,
    colorA: "#a855f7",
    colorB: "#ec4899",
    layout: "spotlight",
    mood: "Recognition",
  },
  humanity: {
    Icon: Stethoscope,
    colorA: "#ef4444",
    colorB: "#f59e0b",
    layout: "alert",
    mood: "Relief",
  },
  picnic: {
    Icon: Trees,
    colorA: "#f97316",
    colorB: "#eab308",
    layout: "gallery-first",
    mood: "Togetherness",
  },
  online: {
    Icon: Radio,
    colorA: "#6366f1",
    colorB: "#06b6d4",
    layout: "compact",
    mood: "Digital",
  },
};

export const DEFAULT_THEME: ProgramTheme = {
  Icon: HeartHandshake,
  colorA: "var(--color-accent-1)",
  colorB: "var(--color-accent-2)",
  layout: "checklist",
  mood: "Program",
};

export function themeFor(slug: string): ProgramTheme {
  return PROGRAM_THEMES[slug] ?? DEFAULT_THEME;
}
