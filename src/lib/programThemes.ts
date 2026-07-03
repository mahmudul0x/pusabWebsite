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
  /** CSS color values used for this page's accent gradient — always the
   * site's own accent tokens, so every program page matches the main
   * theme rather than carrying its own brand color. */
  colorA: string;
  colorB: string;
  layout: ProgramLayout;
  /** Short one-word mood label shown as a kicker above the title. */
  mood: string;
}

// Every program shares the site's accent gradient — only the layout and
// mood icon/label vary per program, not the color.
const SITE_COLOR_A = "var(--color-accent-1)";
const SITE_COLOR_B = "var(--color-accent-2)";

export const PROGRAM_THEMES: Record<string, ProgramTheme> = {
  reunion: {
    Icon: Users,
    colorA: SITE_COLOR_A,
    colorB: SITE_COLOR_B,
    layout: "timeline",
    mood: "Celebration",
  },
  schooling: {
    Icon: GraduationCap,
    colorA: SITE_COLOR_A,
    colorB: SITE_COLOR_B,
    layout: "curriculum",
    mood: "Education",
  },
  scholarship: {
    Icon: Award,
    colorA: SITE_COLOR_A,
    colorB: SITE_COLOR_B,
    layout: "checklist",
    mood: "Opportunity",
  },
  felicitation: {
    Icon: Award,
    colorA: SITE_COLOR_A,
    colorB: SITE_COLOR_B,
    layout: "spotlight",
    mood: "Recognition",
  },
  humanity: {
    Icon: Stethoscope,
    colorA: SITE_COLOR_A,
    colorB: SITE_COLOR_B,
    layout: "alert",
    mood: "Relief",
  },
  picnic: {
    Icon: Trees,
    colorA: SITE_COLOR_A,
    colorB: SITE_COLOR_B,
    layout: "gallery-first",
    mood: "Togetherness",
  },
  online: {
    Icon: Radio,
    colorA: SITE_COLOR_A,
    colorB: SITE_COLOR_B,
    layout: "compact",
    mood: "Digital",
  },
};

export const DEFAULT_THEME: ProgramTheme = {
  Icon: HeartHandshake,
  colorA: SITE_COLOR_A,
  colorB: SITE_COLOR_B,
  layout: "checklist",
  mood: "Program",
};

export function themeFor(slug: string): ProgramTheme {
  return PROGRAM_THEMES[slug] ?? DEFAULT_THEME;
}
